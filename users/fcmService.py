import os

import firebase_admin
from firebase_admin import credentials, messaging

FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT", "secrets/service-keys.json")

# Initialize Firebase only when credentials are available.
firebase_is_ready = False
if os.path.exists(FIREBASE_CREDENTIALS_PATH):
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    firebase_is_ready = True


def send_fcm_notification(token, title, body):
    """
    Send a Firebase Cloud Messaging (FCM) notification.
    Args:
        token (str): The FCM token of the device to send the notification to.
        title (str): The title of the notification.
        body (str): The body of the notification.
    Returns:
        str: A success or error message.
    """
    if not token:
        return "Error: FCM token is required."
    if not title:
        return "Error: Notification title is required."
    if not body:
        return "Error: Notification body is required."
    if not firebase_is_ready:
        return "Firebase is not configured. Set FIREBASE_SERVICE_ACCOUNT or add secrets/service-keys.json."
    try:
        # Create a message
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            token=token,
        )
        # Send the message
        response = messaging.send(message)
        return f"Successfully sent message: {response}"

    except Exception as e:
        return f"Error sending notification: {str(e)}"
