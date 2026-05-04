import firebase_admin
from firebase_admin import credentials, messaging

# Initialize Firebase Admin SDK with service account credentials
cred = credentials.Certificate("secrets/service-keys.json")

firebase_admin.initialize_app(cred)


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
