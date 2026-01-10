from fastapi import APIRouter, Request,Header
from app.core.conf import GITHUB_SECRET_KEY
from app.core.security import verify_github_signature
from app.common.errors import ClientErrors,ServerErrors,CredentialError

webhook_router = APIRouter()
@webhook_router.post("/github")
async def github_webhook(
    request: Request,
    x_hub_signature_256:bytes = Header(None) 
):
    """
    GitHub webhook endpoint
    """
    
    body = await request.body()
    
    # verify the signature
    if not await verify_github_signature(body,GITHUB_SECRET_KEY,x_hub_signature_256):
        raise CredentialError(message="Invalid signature",response_code=401)
    
    payload = await request.json()
    event_type = request.headers.get("x-github-event")
    event = payload.get("action")
    
    print(f"Event type: {event_type}")
    print(f"Event: {event}")
    print(f"Payload: {payload}")
    return {
        'status':'success',
        'event_type':event_type,
        'event':event,
        'payload':payload
    }
    
