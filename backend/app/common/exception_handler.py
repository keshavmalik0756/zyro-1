from fastapi import HTTPException, Request
import traceback
import logging
from contextvars import ContextVar
from uuid import uuid4

from fastapi.exceptions import RequestValidationError
from functools import wraps
from typing import List, Callable, Literal, cast, Optional
from starlette.responses import JSONResponse

from app.common.errors import UserErrors, ClientErrors, DatabaseErrors
from app.utils.request_data_extractor import RequestDataExtractor
from app.core.conf import APP_NAME, ENVIRONMENT
from app.common.error_manager import ErrorMessageManager

# Setup logging
logger = logging.getLogger(__name__)

# Context variable for request ID
request_id_var: ContextVar[Optional[str]] = ContextVar('request_id', default=None)

def get_current_request_id() -> Optional[str]:
    """Get the current request ID from context."""
    return request_id_var.get()

def create_request_id() -> str:
    """Create and set a new request ID."""
    req_id = str(uuid4())
    request_id_var.set(req_id)
    return req_id

LOG_LEVELS = {
    'ERROR': logger.error,
    'CRITICAL': logger.critical,
    'INFO': logger.info,
    'WARNING': logger.warning
}


class ExceptionHandler:

    def __init__(
        self, 
        request: Request,
        exc: Exception
    ):
        self.request = request
        self.request_data_extractor = RequestDataExtractor(request)
        self.exc = exc

    async def _publish_error_message(self, error_data: dict):
        """Publish error message using ErrorMessageManager."""
        error_message_manager = ErrorMessageManager(
            product=APP_NAME,
            module=APP_NAME,
            log_level="critical",
            token_data=error_data.get('token_data', {}),
            uri=error_data.get('uri', 'unknown-uri'),
            error=error_data.get('err', 'Unhandled error'),
            traceback=error_data.get('traceback', ''),
            error_type=error_data.get('error_type', 'UnknownError'),
            request_data=error_data.get('request_data', {}),
            headers=error_data.get('headers', {}),
            method=error_data.get('method', 'unknown'),
            exclude=[],
            additional_info={}
        )
        error_message_manager.set_channel('logger')
        error_message_manager.set_log_level('error')
        await error_message_manager.publish_error_message()

    async def handle_exception(self):
        if isinstance(self.exc, HTTPException):
            return await self.http_exception_handler()
        
        elif isinstance(self.exc, RequestValidationError):
            return await self.validation_error_handler()
        
        elif isinstance(self.exc, DatabaseErrors):
            return await self.database_error_handler()
        
        elif isinstance(self.exc, UserErrors):
            return await self.user_error_handler()

        elif isinstance(self.exc, ClientErrors):
            return await self.client_error_handler()
        return await self.unknown_error_handler()
    
    def log_error(self):
        log_message = (
            f'{self.request_data_extractor.get_request_method()} : '
            f'{self.request_data_extractor.get_request_url()} : '
            f'{str(self.exc)}'
            f'\n{"".join(traceback.format_exception(type(self.exc), value=self.exc, tb=self.exc.__traceback__))}'
        )
        
        if not isinstance(self.exc, UserErrors):
            logger.error(log_message)
            return
        
        log_level = getattr(self.exc, 'log_level', 'ERROR')
        LOG_LEVELS.get(log_level, logger.error)(log_message)

    async def prepare_error_data(self, exclude_fields: List[str] = []):
        error_data = {
            "log_level": self.exc.log_level if isinstance(self.exc, UserErrors) else 'ERROR', 
            'error_id': get_current_request_id() or 'unknown'
        }

        if "project" not in exclude_fields:
            error_data['project'] = APP_NAME

        if "module" not in exclude_fields:
            error_data['module'] = APP_NAME
        
        if "method" not in exclude_fields:
            error_data['method'] = self.request_data_extractor.get_request_method()
        
        if "headers" not in exclude_fields:
            error_data['headers'] = self.request_data_extractor.get_request_headers()

        if 'uri' not in exclude_fields:
            error_data['uri'] = self.request_data_extractor.get_request_url(include_query_params=True)
        
        if 'err' not in exclude_fields:
            error_data['err'] = str(self.exc)
        
        if "request_data" not in exclude_fields:
            error_data['request_data'] = await self.request_data_extractor.get_request_body()
        
        if "traceback" not in exclude_fields:
            error_data['traceback'] = ''.join(traceback.format_tb(self.exc.__traceback__))
        
        if "error_type" not in exclude_fields:
            error_data['error_type'] = self.exc.type if isinstance(self.exc, UserErrors) else type(self.exc).__name__

        return error_data
        
    async def validation_error_handler(self):
        reformatted_message = {'message': "Invalid Request", 'type': 'InvalidDataError'}
        self.exc: RequestValidationError
        error_message = "Invalid Request"

        for pydantic_error in self.exc.errors():
            loc, msg = pydantic_error["loc"], pydantic_error["msg"]
            filtered_loc = loc[1:] if loc[0] in ("body", "query", "path") else loc
            filtered_loc = (str(i) for i in filtered_loc)
            field_string = ".".join(filtered_loc)
            error_message = field_string.title().replace('_', ' ') + ': ' + msg.title()
            reformatted_message.setdefault(field_string, []).append(msg)

        return JSONResponse(
            status_code=400,
            content={"message": error_message, "details": reformatted_message, 'success': False},
        )
    
    async def database_error_handler(self):
        self.exc: DatabaseErrors
        data = await self.prepare_error_data()
        self.log_error()
        
        return JSONResponse(
            content={
                'details': {
                    'type': self.exc.type,
                    'message': self.exc.message
                },
                'message': self.exc.message,
                'success': False
            },
            status_code=self.exc.response_code
        )
    
    async def http_exception_handler(self):
        return JSONResponse(
            content={
                'details': {
                    'type': type(self.exc).__name__,
                    'message': self.exc.detail
                },
                'message': self.exc.detail,
                'success': False
            },
            status_code=self.exc.status_code,
            headers=self.exc.headers if hasattr(self.exc, 'headers') else None
        )

    async def user_error_handler(self):
        self.exc: UserErrors
        data = await self.prepare_error_data()
        self.log_error()
        response_data = self.exc.data if hasattr(self.exc, 'data') else {}
        
        return JSONResponse(
            content={
                'details': {
                    'type': self.exc.type,
                    'message': self.exc.message
                },
                'message': self.exc.message,
                'data': response_data,
                'success': False
            },
            status_code=self.exc.response_code
        )

    async def client_error_handler(self):
        self.exc: ClientErrors
        data = await self.prepare_error_data()
        self.log_error()
        
        return JSONResponse(
            content={
                'message': self.exc.message,
                'success': False
            },
            status_code=self.exc.response_code
        )

    async def unknown_error_handler(self):
        data = await self.prepare_error_data()
        self.log_error()
        # Publish error message
        await self._publish_error_message(data)

        return JSONResponse(
            content={
                'details': {
                    'type': 'Internal Server Error',
                    'message': 'Internal Server Error'
                },
                'message': 'Internal Server Error', 
                'success': False
            },
            status_code=500
        )


# FastAPI exception handler functions
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for FastAPI."""
    handler = ExceptionHandler(request, exc)
    return await handler.handle_exception()


async def http_exception_handler(request: Request, exc: HTTPException):
    """Handler for HTTPException."""
    handler = ExceptionHandler(request, exc)
    return await handler.http_exception_handler()


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handler for RequestValidationError."""
    handler = ExceptionHandler(request, exc)
    return await handler.validation_error_handler()


default_logger_format = 'Error occurred after request in function: {funcname} with args: {args} and kwargs: {kwargs}'

def after_request_exception_handler(
    logger_format: str = default_logger_format,
    db_connection_type: Literal['read', 'write'] = 'write'
):
    """
    Decorator for handling exceptions after request processing.
    Formatter gives following keyword arguments: 
    funcname, args, kwargs
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                create_request_id()
                return await func(*args, **kwargs)
        
            except UserErrors as exc:
                logger.error(
                    logger_format.format(
                        funcname=f'{func.__code__.co_filename}:{func.__name__}', 
                        args=args, 
                        kwargs=kwargs
                    ), 
                    exc_info=True
                )
                error_data = {
                    "log_level": exc.log_level,
                    'user_id': kwargs.get('user_id'),
                    'project': APP_NAME,
                    'module': APP_NAME,
                    'error_id': get_current_request_id(),
                    'uri': 'AfterRequest',
                    'err': str(exc),
                    'request_data': {
                        'args': str(args),
                        'kwargs': str(kwargs)
                    },
                    'traceback': f'\n{"".join(traceback.format_exception(type(exc), value=exc, tb=exc.__traceback__))}',
                    'error_type': exc.type
                }
                raise  # Re-raise to let FastAPI handle it
    
            except Exception as exc:
                logger.error(
                    logger_format.format(
                        funcname=f'{func.__code__.co_filename}:{func.__name__}', 
                        args=args, 
                        kwargs=kwargs
                    ), 
                    exc_info=True
                )
                error_data = {
                    "log_level": 'ERROR',
                    'user_id': kwargs.get('user_id'),
                    'project': APP_NAME,
                    'module': APP_NAME,
                    'error_id': get_current_request_id(),
                    'uri': 'AfterRequest',
                    'err': str(exc),
                    'request_data': {
                        'args': str(args),
                        'kwargs': str(kwargs)
                    },
                    'traceback': f'\n{"".join(traceback.format_exception(type(exc), value=exc, tb=exc.__traceback__))}',
                    'error_type': type(exc).__name__
                }
                error_message_manager = ErrorMessageManager(
                    product=APP_NAME,
                    module=APP_NAME,
                    log_level="critical",
                    token_data=error_data.get('token_data', {}),
                    uri=error_data.get('uri', 'unknown-uri'),
                    error=error_data.get('err', 'Unhandled error'),
                    traceback=error_data.get('traceback', ''),
                    error_type=error_data.get('error_type', 'UnknownError'),
                    request_data=error_data.get('request_data', {}),
                    headers=error_data.get('headers', {}),
                    method=error_data.get('method', 'unknown'),
                    exclude=[],
                    additional_info={}
                )
                error_message_manager.set_channel('logger')
                error_message_manager.set_log_level('error')
                await error_message_manager.publish_error_message()
                raise  # Re-raise to let FastAPI handle it
          
        return cast(Callable, wrapper)
    
    return decorator
