import logging
import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, messaging

logger = logging.getLogger(__name__)

# Initialize Firebase only when credentials are available.
firebase_is_ready = False
FIREBASE_CREDENTIALS_PATH = os.getenv(
    "FIREBASE_SERVICE_ACCOUNT",
    str(Path(__file__).resolve().parent.parent.parent / "secrets" / "service-keys.json")
)

try:
    if os.path.exists(FIREBASE_CREDENTIALS_PATH):
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        # Check if Firebase app is already initialized
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        firebase_is_ready = True
        logger.info("Firebase initialized successfully.")
    else:
        logger.warning(f"Firebase credentials not found at {FIREBASE_CREDENTIALS_PATH}")
except Exception as e:
    logger.error(f"Failed to initialize Firebase: {str(e)}")


def send_fcm_notification(token, title, body, data=None):
    """
    Send a Firebase Cloud Messaging (FCM) notification.
    
    Args:
        token (str): The FCM token of the device to send the notification to.
        title (str): The title of the notification.
        body (str): The body of the notification.
        data (dict, optional): Additional data payload for the notification.
    
    Returns:
        dict: A response dict with 'success' and 'message' keys.
              Example: {'success': True, 'message': 'Successfully sent message: <response_id>'}
    """
    # Validate input parameters
    if not token or not isinstance(token, str):
        return {"success": False, "message": "Error: FCM token is required and must be a string."}
    if not title or not isinstance(title, str):
        return {"success": False, "message": "Error: Notification title is required and must be a string."}
    if not body or not isinstance(body, str):
        return {"success": False, "message": "Error: Notification body is required and must be a string."}
    
    if not firebase_is_ready:
        return {
            "success": False,
            "message": "Firebase is not configured. Set FIREBASE_SERVICE_ACCOUNT environment variable or add secrets/service-keys.json."
        }
    
    try:
        # Create a message with optional data payload
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            token=token,
        )
        
        # Send the message
        response = messaging.send(message)
        logger.info(f"FCM notification sent successfully: {response}")
        return {"success": True, "message": f"Successfully sent message: {response}"}
    
    except firebase_admin.exceptions.FirebaseError as e:
        logger.error(f"Firebase error sending notification: {str(e)}")
        return {"success": False, "message": f"Firebase error: {str(e)}"}
    except Exception as e:
        logger.error(f"Unexpected error sending notification: {str(e)}")
        return {"success": False, "message": f"Error sending notification: {str(e)}"}
