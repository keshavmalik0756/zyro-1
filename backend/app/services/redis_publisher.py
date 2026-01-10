import json
from app.core.redis_config import async_redis_client
from app.common.logging.logging_config import Logger
from app.common.errors import ClientErrors
from fastapi import status

class RedisPublisher:
    @staticmethod
    async def publish_issue_update(project_id: int, issue_data: dict):
        """Publish issue update event to Redis"""
        try:
            channel = f"project:{project_id}:updates"
            message = {
                "type": "issue_updated",
                "data": issue_data
            }
            result = await async_redis_client.publish(channel, json.dumps(message))
            Logger.info(f"Published issue update to Redis channel: {channel}, subscribers: {result}")
            
        except Exception as e:
            import traceback
            Logger.error(f"Error publishing issue update to Redis: {e}")
            Logger.error(f"Redis publish traceback: {traceback.format_exc()}")
            # Don't raise - allow the API to succeed even if Redis fails
            # This prevents Redis issues from breaking the update API
    
    @staticmethod
    async def publish_issue_created(project_id: int, issue_data: dict):
        """Publish issue creation event to Redis"""
        try:
            channel = f"project:{project_id}:updates"
            message = {
                "type": "issue_created",
                "data": issue_data
            }
            result = await async_redis_client.publish(channel, json.dumps(message))
            Logger.info(f"Published issue creation to Redis channel: {channel}, subscribers: {result}")
        except Exception as e:
            import traceback
            Logger.error(f"Error publishing create issue to Redis: {e}")
            Logger.error(f"Redis publish traceback: {traceback.format_exc()}")
            # Don't raise - allow the API to succeed even if Redis fails
    
    @staticmethod
    async def publish_issue_deleted(project_id: int, issue_id: int):
        """Publish issue deletion event to Redis"""
        try:
            channel = f"project:{project_id}:updates"
            message = {
                "type": "issue_deleted",
                "data": {"issue_id": issue_id}
            }
            result = await async_redis_client.publish(channel, json.dumps(message))
            Logger.info(f"Published issue deletion to Redis channel: {channel}, subscribers: {result}")
        except Exception as e:
            import traceback
            Logger.error(f"Error publishing issue deletion to Redis: {e}")
            Logger.error(f"Redis publish traceback: {traceback.format_exc()}")
            # Don't raise - allow the API to succeed even if Redis fails

redis_publisher = RedisPublisher()