"""
Utility functions for the Planner application.
"""
import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


class Util:
    """Utility class for common functions."""

    @staticmethod
    def send_email(data):
        """
        Send an email using Django's email backend.
        
        Args:
            data (dict): Dictionary containing:
                - 'to_email' (str or list): Recipient email address(es)
                - 'subject' (str): Email subject
                - 'message' (str): Email message/body
        
        Returns:
            bool: True if email was sent successfully, False otherwise.
        """
        try:
            to_email = data.get('to_email')
            subject = data.get('subject')
            message = data.get('message')
            
            # Validate required fields
            if not all([to_email, subject, message]):
                logger.warning("Email data missing required fields")
                return False
            
            # Ensure to_email is a list
            if isinstance(to_email, str):
                to_email = [to_email]
            
            # Send the email
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=to_email,
                fail_silently=False,
            )
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False
