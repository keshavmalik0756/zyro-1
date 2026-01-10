"""
Custom Logging Configuration for Zyro API
Provides structured logging with request ID tracking.
"""
import logging
import sys
from pathlib import Path

from app.common.logging.request import get_current_request_id
from app.core.conf import IS_LOCAL, BASE_DIR

# Create logs directory if it doesn't exist
LOGS_DIR = BASE_DIR / "logs"
LOGS_DIR.mkdir(exist_ok=True)

# Custom formatter with request ID
formatter = logging.Formatter(
    '%(request_id)s :: %(asctime)s :: %(filename)s :: %(pathname)s :: %(levelname)s :: %(funcName)s :: %(lineno)d :: %(message)s\n'
    '==================================================================\n'
)

class CustomLogger(logging.Logger):
    """Custom logger that automatically includes request ID in all log messages."""
    
    def _log_with_request_id(self, level, msg, *args, **kwargs):
        """Internal method to log with request ID."""
        request_id = get_current_request_id() or "NO-REQUEST-ID"
        
        if self.isEnabledFor(level):
            # Ensure request_id is in extra
            if 'extra' not in kwargs:
                kwargs['extra'] = {}
            kwargs['extra']['request_id'] = request_id
            self._log(level=level, msg=msg, args=args, **kwargs)

    def error(self, msg, *args, **kwargs):
        """Log error message with request ID."""
        request_id = get_current_request_id() or "NO-REQUEST-ID"
        if self.isEnabledFor(logging.ERROR):
            if 'extra' not in kwargs:
                kwargs['extra'] = {}
            kwargs['extra']['request_id'] = request_id
            self._log(level=logging.ERROR, msg=msg, args=args, **kwargs)
    
    def critical(self, msg, *args, **kwargs):
        """Log critical message with request ID."""
        request_id = get_current_request_id() or "NO-REQUEST-ID"
        if self.isEnabledFor(logging.CRITICAL):
            if 'extra' not in kwargs:
                kwargs['extra'] = {}
            kwargs['extra']['request_id'] = request_id
            self._log(level=logging.CRITICAL, msg=msg, args=args, **kwargs)

    def warning(self, msg, *args, **kwargs):
        """Log warning message with request ID."""
        request_id = get_current_request_id() or "NO-REQUEST-ID"
        if self.isEnabledFor(logging.WARNING):
            if 'extra' not in kwargs:
                kwargs['extra'] = {}
            kwargs['extra']['request_id'] = request_id
            self._log(level=logging.WARNING, msg=msg, args=args, **kwargs)
    
    def info(self, msg, *args, **kwargs):
        """Log info message with request ID."""
        request_id = get_current_request_id() or "NO-REQUEST-ID"
        if self.isEnabledFor(logging.INFO):
            if 'extra' not in kwargs:
                kwargs['extra'] = {}
            kwargs['extra']['request_id'] = request_id
            self._log(level=logging.INFO, msg=msg, args=args, **kwargs)
    
    def debug(self, msg, *args, **kwargs):
        """Log debug message with request ID."""
        request_id = get_current_request_id() or "NO-REQUEST-ID"
        if self.isEnabledFor(logging.DEBUG):
            if 'extra' not in kwargs:
                kwargs['extra'] = {}
            kwargs['extra']['request_id'] = request_id
            self._log(level=logging.DEBUG, msg=msg, args=args, **kwargs)


# Set the custom logger class as the default
logging.setLoggerClass(CustomLogger)


def get_logger(name: str) -> CustomLogger:
    """
    Get a logger instance with the given name.
    
    Args:
        name: Logger name (usually __name__)
    
    Returns:
        CustomLogger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)  # Set to DEBUG to see all logs
    
    # Remove existing handlers to avoid duplicates
    if logger.handlers:
        for handler in logger.handlers[:]:
            logger.removeHandler(handler)
    
    # Always add both file and console handlers for better visibility
    # File handler
    log_file = LOGS_DIR / "app.log"
    file_handler = logging.FileHandler(filename=str(log_file), encoding='utf-8')
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    # Console handler (always add for terminal visibility)
    console_handler = logging.StreamHandler(stream=sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    # Simpler formatter for console
    console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)
    
    # Prevent propagation to root logger
    logger.propagate = False
    
    return logger


# Create a default logger instance
Logger = get_logger(__name__)