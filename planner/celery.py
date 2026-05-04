import os
from datetime import datetime, timedelta
from django.utils import timezone
from celery import Celery, shared_task
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'planner.settings')

app = Celery('planner')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()


@app.on_after_configure.connect
def setup_periodic_tasks(sender: Celery, **kwargs):
    from users.views import send_deadline_notifications
    sender.add_periodic_task(
        crontab(hour=8, minute=0),  # Runs daily at 8:00 AM
        send_deadline_notifications.s(),
        name='send_deadline_notifications'
    )

@shared_task
def send_deadline_notifications():
    view=send_deadline_notifications()
    view.post(None)
@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


@app.task()
def send_notifications():
    from work.models import Task
    from users.fcmService import send_fcm_notification
    today = timezone.now().date()
    tomorrow = today + timedelta(days=1)
    tomorrow_start = timezone.make_aware(datetime.combine(tomorrow, datetime.min.time()))
    tomorrow_end = tomorrow_start + timedelta(days=1)
    tasks = Task.objects.filter(due_date__range=(tomorrow_start, tomorrow_end))
    for task in tasks:
        fcm_user = task.user.fcm_tokens.first()
        if fcm_user:
            # Assuming you have a function to send FCM notifications
            send_fcm_notification(
                fcm_user.token,
                'Task Reminder',
                f'You have a task due tomorrow: {task.name}'
            )
            print(f"Notification sent to {fcm_user.user.username} for task: {task.name}")
        else:
            print(f"No FCM token found for user: {task.user.username}")
    print('Request:')

# celery -A planner worker -l INFO
# celery -A planner beat
