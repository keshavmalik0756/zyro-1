from typing import Dict, Any, Optional
from fastapi import Request
import json


class RequestDataExtractor:
    """Utility class to extract data from FastAPI request objects."""
    
    def __init__(self, request: Request):
        self.request = request
    
    def get_request_method(self) -> str:
        """Get the HTTP method of the request."""
        return self.request.method
    
    def get_request_url(self, include_query_params: bool = False) -> str:
        """Get the request URL."""
        url = str(self.request.url.path)
        if include_query_params and self.request.url.query:
            url += f"?{self.request.url.query}"
        return url
    
    def get_request_headers(self) -> Dict[str, str]:
        """Get request headers as a dictionary."""
        return dict(self.request.headers)
    
    async def get_request_body(self) -> Dict[str, Any]:
        """Get the request body as a dictionary."""
        try:
            body = await self.request.body()
            if body:
                return json.loads(body)
            return {}
        except (json.JSONDecodeError, Exception):
            return {}
    
    def get_user_data_from_headers(self) -> Optional[Dict[str, str]]:
        """Extract user data from headers (if available)."""
        # This can be customized based on your auth implementation
        return None

