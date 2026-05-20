from rest_framework import viewsets, mixins, permissions
from work.models import Schedule, Task, Duration
from work.serializers import TaskSerializers, ScheduleSerializer, DurationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from work.models import Duration, Task
from work.serializers import DurationSerializer
from rest_framework.decorators import action
from datetime import timedelta

class TaskViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    
):
    queryset = Task.objects.all()
    serializer_class = TaskSerializers
    permission_classes = [permissions.IsAuthenticated]
     
    def get_queryset(self):
     # Return tasks only for the logged-in user
        return Task.objects.filter(user=self.request.user)
       
    def perform_create(self, serializer):
        # Automatically associate the task with the authenticated user
        serializer.save(user=self.request.user)
    def get_serializer_context(self):
        # Pass the request context to the serializer
        return {'request': self.request}

    @action(detail=False, methods=['get'])
    def tasks_due_tomorrow(self, request):
        tomorrow = (now() + timedelta(days=1)).date()
        tasks = Task.objects.filter(user=request.user, due_date=tomorrow, status=False)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data, status=200)

class ScheduleViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin
):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    def perform_create(self, serializer):
        # Automatically associate the task with the authenticated user
        serializer.save(user=self.request.user)
    def get_serializer_context(self):
        # Pass the request context to the serializer
        return {'request': self.request}
 
class TimerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, task_id=None):
        """
        Start a timer for a task.
        """
        try:
            if not task_id:
                return Response({'error': 'Task ID is required to start a timer.'}, status=400)

            task = Task.objects.get(id=task_id, user=request.user)
            duration = Duration.objects.create(task=task, user=request.user, start_time=now())
            return Response({'success': 'Timer started.', 'duration_id': duration.id}, status=201)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    def patch(self, request, duration_id=None):
        """
        Stop a timer for a task.
        """
        try:
            if not duration_id:
                return Response({'error': 'Duration ID is required to stop a timer.'}, status=400)

            duration = Duration.objects.get(id=duration_id, user=request.user)
            if duration.end_time:
                return Response({'error': 'Timer has already been stopped.'}, status=400)

            duration.end_time = now()
            duration.duration_value = (duration.end_time - duration.start_time).total_seconds()   # Convert to seconds
            duration.save()

            return Response({'success': 'Timer stopped.', 'duration': duration.duration_value}, status=200)
        except Duration.DoesNotExist:
            return Response({'error': 'Duration entry not found.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    def get(self, request):
        """
        Retrieve total durations for all tasks of the authenticated user.
        """
        try:
            tasks = Task.objects.filter(user=request.user)

            # Calculate total duration for each task
            task_durations = []
            for task in tasks:
                total_duration = sum(
                    duration.duration_value for duration in task.durations.all() if duration.duration_value
                )
                task_durations.append({
                    "task_id": task.id,
                    "task_name": task.name,
                    "total_duration": total_duration,
                })

            return Response(task_durations, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)