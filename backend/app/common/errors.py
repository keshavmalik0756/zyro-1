from typing import Literal, Dict
from dataclasses import dataclass, field


@dataclass
class ClientErrors(Exception):
    message: str = "Invalid request"
    response_code: int = 400
    type: str = "ClientErrors"
    log_level: Literal['ERROR', 'CRITICAL', 'INFO', 'WARNING'] = 'ERROR'
    data: Dict = field(default_factory=dict)
    
    def __str__(self):
        return self.message

@dataclass
class UserErrors(Exception):
    message: str = "Internal Server Error"
    response_code: int = 400
    type: str = 'UserError'
    log_level: Literal['ERROR', 'CRITICAL', 'INFO', 'WARNING'] = 'ERROR'
    data: Dict = field(default_factory=dict)

    def __str__(self):
        return self.message

@dataclass
class InvalidDataError(UserErrors):
    message: str = "The given data is invalid please try again with correct data."
    type: str = 'InvalidDataError'
    log_level: Literal['ERROR', 'CRITICAL', 'INFO', 'WARNING'] = 'ERROR'

    def __str__(self):
        return self.message

@dataclass
class DatabaseErrors(UserErrors):
    pass

@dataclass
class ServerErrors(UserErrors):
    pass


@dataclass
class GmailError(UserErrors):
    message: str = 'Mail Operation Failed. Please try again later.'
    response_code: int = 502
    type: str = 'GmailError'

    def __str__(self):
        return self.message
    
@dataclass
class CredentialError(UserErrors):
    message: str = 'Could not validate credentials'
    response_code: int = 401
    type: str = 'CredentialError'
    log_level: Literal['ERROR', 'CRITICAL', 'INFO', 'WARNING'] = 'WARNING'

    def __str__(self):
        return self.message

@dataclass
class S3Error(UserErrors):
    message: str = 'Error while connecting to S3. Please try again.'
    type: str = 'S3Errors'

    def __str__(self):
        return self.message

@dataclass
class PermissionDeniedError(UserErrors):
    message: str = "You don't have access to requested resource."
    response_code: int = 403
    type: str = 'PermissionDeniedError'
    log_level: Literal['ERROR', 'CRITICAL', 'INFO', 'WARNING'] = 'ERROR'

    def __str__(self):
        return self.message
    
    
@dataclass
class GDriveError(UserErrors):
    message:str = "Some error occurred while communicating with google drive, please try again."
    type: str = "GDriveError"

@dataclass
class S3ConnectionError(UserErrors):
    message: str = "Try Again"
    error_message: str = ""
    response_code: int = 500
    type: Literal["S3ConnectionError"] = "S3ConnectionError"