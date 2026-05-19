import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


class Util:
    @staticmethod
    def send_email(data):
        try:
            sent_count = send_mail(
                subject=data['subject'],
                message=data['message'],
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[data['to_email']],
                fail_silently=False,
            )
            if sent_count < 1:
                logger.error('Email backend accepted request but did not send any message.')
                return False
            return True

        except KeyError as e:
            logger.error(f"Missing key in email data: {e}")
            return False
        except Exception:
            logger.exception('Failed to send email')
            return False
