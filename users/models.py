from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

from work.models import Task

class FcmTokens(models.Model):

    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='fcm_tokens')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(default=now)  # Add default=now
    def __str__(self):
        return f"{self.user.username} - {self.token}"
class PasswordReset(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
 
class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    email_verification_token = models.CharField(max_length=255, unique=True)
    # consent added
    consent = models.BooleanField(default=False)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')  
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)  # Link to the task
    title = models.CharField(max_length=255)  # Title of the notification
    body = models.TextField()  # Body of the notification
    is_read = models.BooleanField(default=False)  # Whether the notification has been read
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the notification was created

    def __str__(self):
        return f"Notification for {self.user.username} - {self.title}"

    class Meta:
        ordering = ['-created_at']  # Order notifications by most recent first


class Feedback(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'General Feedback'),
        ('bug',     'Bug Report'),
        ('feature', 'Feature Request'),
        ('ux',      'UI / UX Issue'),
        ('other',   'Other'),
    ]

    user     = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='feedbacks')
    rating   = models.PositiveSmallIntegerField()          # 1–5
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    message  = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback({self.category}, {self.rating}★) by {self.user}"

    class Meta:
        ordering = ['-created_at']
