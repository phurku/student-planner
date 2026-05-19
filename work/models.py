from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    due_date = models.DateField()
    priority = models.CharField(max_length=10, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')])
    # status True means completed
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Schedule(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE,related_name='schedules')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.task.name

class Duration(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='durations')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField(null=True, blank=True)  # Allow NULL for start_time
    end_time = models.DateTimeField(null=True, blank=True)    # Allow NULL for end_time
    duration_value = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.task.name
    def get_duration(self):
        if self.start_time and self.end_time:
            return (self.end_time - self.start_time).total_seconds()  # Duration in seconds
        return 0