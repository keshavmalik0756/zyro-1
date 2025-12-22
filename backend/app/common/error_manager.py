from app.core.conf import ENVIRONMENT
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
import json
import logging
from uuid import uuid4

logger = logging.getLogger(__name__)


@dataclass
class MailManager:
    product: str
    module: str
    log_level: str
    uri: str
    error: str
    traceback: str
    error_type: str
    token_data: Optional[Dict[str, str]] = field(default_factory=dict)
    request_data: Optional[Dict[str, Any]] = field(default_factory=dict)
    headers: Optional[Dict[str, str]] = field(default_factory=dict)
    method: str = 'unknown'
    additional_info: Optional[Dict] = field(default_factory=dict)
    channel: str = 'logger'
    sender: str = 'noreply'
    environment: str = ENVIRONMENT.lower()
    to: List[str] = field(default_factory=list)
    exclude: List[str] = field(default_factory=list)
    LOG_LEVELS = {"info", "warning", "error", "critical"}  
    valid_channels = {'logger', 'mail'}

    def set_channel(self, channel: str):
        if channel.lower() in self.valid_channels:
            self.channel  = channel.lower()
        else:
            raise ValueError(f'Invalid channel: {channel}. Choose from {self.valid_channels}')
    def set_log_level(self, level: str):
        """
        Set the log level if it is valid.
        """
        if level.lower() in self.LOG_LEVELS:
            self.log_level = level.lower()
        else:
            raise ValueError(f"Invalid log level: {level}. Choose from {self.LOG_LEVELS}")
        

    def prepare_message(self) -> Dict:
        """
        Prepare the error message as a structured dictionary.
        """
        pass
    
    async def publish_error_message(self):
        """
        Publish the error message to the Redis 'error' channel.
        """
        pass
        
        

@dataclass
class ErrorMessageManager(MailManager):
    channel: str = 'logger'
        
    
    def prepare_message(self) -> Dict:
        """
        Prepare the error message as a structured dictionary.
        """
        return {
            "id":str(uuid4()),
            "product": self.product,
            "module": self.module,
            "log_level": self.log_level,
            "uri": self.uri,
            "error": self.error,
            "traceback": self.traceback,
            "error_type": self.error_type,
            "token_data": self.token_data,
            "sender": self.sender,
            "request_data": self.request_data,
            "headers": self.headers,
            "environment": self.environment,
            "method": self.method,
            "to": self.to,
            "exclude": self.exclude,
            "additional_info": self.additional_info
        }
    
    async def publish_error_message(self):
        """
        Publish the error message to the logger.
        In a production environment, this could publish to Redis or other channels.
        """
        message = self.prepare_message()
        
        if self.channel == 'logger':
            log_level = self.log_level.upper()
            log_message = f"Error: {message.get('error', 'Unknown error')} | Type: {message.get('error_type', 'Unknown')} | URI: {message.get('uri', 'unknown')}"
            
            if log_level == 'CRITICAL':
                logger.critical(log_message, extra=message)
            elif log_level == 'ERROR':
                logger.error(log_message, extra=message)
            elif log_level == 'WARNING':
                logger.warning(log_message, extra=message)
            else:
                logger.info(log_message, extra=message)
        # For 'mail' channel, you would implement email sending here  