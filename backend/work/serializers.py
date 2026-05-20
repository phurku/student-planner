from rest_framework import serializers
from work.models import Task, Schedule, Duration


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'start_time', 'end_time', 'created_at', 'updated_at', 'user']
        read_only_fields = ['user']  # Make the user field read-only

    def create(self, validated_data):
        # Automatically associate the schedule with the authenticated user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
class DurationSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()  # Add a custom field for the calculated duration

    class Meta:
        model = Duration
        fields = ['id', 'task', 'user', 'start_time', 'end_time', 'duration', 'created_at', 'updated_at']
        read_only_fields = ['user', 'duration', 'created_at', 'updated_at']  # Make certain fields read-only

    def get_duration(self, obj):
        # Calculate the duration in seconds
        if obj.start_time and obj.end_time:
            return (obj.end_time - obj.start_time).total_seconds() 
        return None
class TaskSerializers(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True)

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'due_date', 'priority', 'status', 'created_at', 'updated_at', 'schedules']
        read_only_fields = ['user']  # Make the user field read-only

    def create(self, validated_data):
        schedules_data = validated_data.pop('schedules', [])
        # Remove the 'user' field from validated_data if it exists
        validated_data.pop('user', None)
        # Automatically associate the task with the authenticated user
        task = Task.objects.create(user=self.context['request'].user, **validated_data)
        # Create schedules and associate them with the task and authenticated user
        for schedule_data in schedules_data:
            schedule_data.pop('id', None)
            Schedule.objects.create(task=task, user=self.context['request'].user, **schedule_data)
        return task

    
    def update(self, instance, validated_data):
        schedules_data = validated_data.pop('schedules', [])
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.due_date = validated_data.get('due_date', instance.due_date)
        instance.priority = validated_data.get('priority', instance.priority)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        # Get the IDs of the schedules sent in the update request
        schedule_ids = [schedule_data.get('id') for schedule_data in schedules_data if schedule_data.get('id')]

        # Delete schedules that are not in the update request
        instance.schedules.exclude(id__in=schedule_ids).delete()

    # Update or create schedules
        for schedule_data in schedules_data:
            schedule_id = schedule_data.get('id')
            if schedule_id:
                # Update existing schedule
                schedule = Schedule.objects.get(id=schedule_id, task=instance)
                schedule.start_time = schedule_data.get('start_time', schedule.start_time)
                schedule.end_time = schedule_data.get('end_time', schedule.end_time)
                schedule.save()
            else:
                schedule_data.pop('id', None)
                # Create new schedule and associate it with the authenticated user
                Schedule.objects.create(
                    task=instance,
                    user=self.context['request'].user,  # Set the user explicitly
                    **schedule_data
                )

        return instance
    
