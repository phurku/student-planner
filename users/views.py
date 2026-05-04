from datetime import datetime, timedelta
from celery import Task
from rest_framework import viewsets, mixins, permissions
from rest_framework import generics
from rest_framework.decorators import action
from django.contrib.auth.models import User
from users.models import FcmTokens
from users.serializers import FCMTokenSerializer, UserCreateSerializer, UserResponseSerializer
from users.models import PasswordReset
from users.serializers import UserCreateSerializer, UserResponseSerializer, RequestPasswordEmailRequestSerializer, PasswordTokenCheckSerializer
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from rest_framework.views import APIView
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from planner.utils import Util
from users.models import Profile
from uuid import uuid4

from work.serializers import TaskSerializers
from .fcmService import send_fcm_notification
from .models import Notification, Feedback
from .serializers import NotificationSerializer, FeedbackSerializer
from work.models import Task
from rest_framework.permissions import AllowAny
import logging
logger = logging.getLogger(__name__)

class UserProfileView(APIView):
    permission_classes = [authenticate]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
        })


class UserViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin
):
    queryset = User.objects.all()
    serializer_class = UserResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """
        Override permissions for specific actions.
        """
        if self.action in ['create', 'login', 'forget_password', 'verify_email']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    """
    Public
    User registration
    Unauthenticated
    [POST]
    http://127.0.0.1:8000/api/v1/users/
    """
    def create(self, request):
        consent= request.data.get('consent')
        user_serializer = UserCreateSerializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)

        user = user_serializer.save()
        try:
            token = uuid4()
            verify_email_url = f"http://localhost:3000/verify_email/{token}/"

            profile = Profile.objects.create(user=user, email_verification_token=token)
            if consent:
                profile.consent = True
                profile.save()

            message = 'Hello,\nPlease use the link below to Verify your email:\n' + verify_email_url
            data = {'message': message, 'to_email': user.email, 'subject': 'Verify Your Email'}
            Util.send_email(data)
            return Response({'message': 'Registration successful. Please verify your email.'}, status=201)
        except Exception:
            user.delete()
            return Response({'error': 'Could not send verification email. Please try again.'}, status=500)
    

    """
    Public
    User login
    Unauthenticated
    [POST]
    http://127.0.0.1:8000/api/v1/users/login/
    """
    @action(detail=False, methods=['post'])
    def login(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        # Check if the user exists
        try:
            user = User.objects.get(username=username)
            if not user.is_active:
                return Response({'error': 'User account is inactive'}, status=403)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=404)

        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=401)

    """Public
    Request password reset
    [POST]
    http://127.0.0.1:8000/api/v1/users/forgot_password/
    """



    # @action(detail=False, methods=['get'])
    # def forget_password(self,request, *args, **kwargs):
    #     email = request.GET.get('email')
    #     if not email:
    #         return Response({'error': 'Email is required'}, status=400)
    #     try:
    #         user = User.objects.get(email=email)
    #     except User.DoesNotExist:
    #         return Response({'error': 'User does not exist'}, status=404)
    #     # Here you would typically send an email with a password reset link
    #     reset_token=get_random_string(len=32)
    #     user.profile.reset_token=reset_token
    #     user.profile.save()
    #     # Send email logic goes here
    #     reset_link=f"http://127.0.0.1:3000/reset_password/{reset_token}/" #fronend reset link
    #     # Send email logic goes here
    #     send_mail(
    #         'Password Reset',
    #         f'Click the link to reset your password: {reset_link}',
    #         'noreply@student-planner.com',
    #         [email],
    #         fail_silently=False,
    #     )
    #     return Response({'message': 'Password reset link sent'}, status=200)
    

    
    """
    Private
    Fetch current user details
    [GET]
    http://127.0.0.1:8000/api/v1/users/me/
    """
    @action(detail=False, methods=['get'])
    def me(self, request, *args, **kwargs):
        user = self.request.user
        user_serializer = UserResponseSerializer(user)
        return Response(user_serializer.data)
    
    @action(detail=False, methods=['POST'])
    def verify_email(self, request, *args, **kwargs):
        token= request.data.get('token')
        profile= Profile.objects.filter(email_verification_token=token)
        if not profile.exists():
            return Response({'error':'token not found'}, status=400)
        user=profile.first().user
        user.is_active=True
        user.save()
        profile.first().delete()

        
        return Response({'message':'email verified successfully'}, status=200)
    @action(detail=False, methods=['POST'], serializer_class=FCMTokenSerializer)
    def fcm_token(self, request, *args, **kwargs):
        user = self.request.user
        fcm_serializer = FCMTokenSerializer(data=request.data)
        fcm_serializer.is_valid(raise_exception=True)
        FcmTokens.objects.update_or_create(
            user=user,
            defaults={'token': fcm_serializer.validated_data['token']}
        )
        return Response(fcm_serializer.data)

    """"
    http://127.0.0.1:8000/api/v1/users/
    [GET, POST]


    http://127.0.0.1:8000/api/v1/users/{userId}/
    [PUT, PATCH, DELETE]
    """

    """"
    Private
    Change user password
    [POST]
    http://127.0.0.1:8000/api/v1/users/change_password/
    """
    @action(detail=False, methods=['post'])
    def change_password(self, request, *args, **kwargs):
        user = self.request.user
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Password is required'}, status=400)
           # Check if the new password is the same as the old password
        if check_password(password, user.password):
            return Response({'error': 'New password cannot be the same as the old password'}, status=400)
        
        user.set_password(password)
        user.save()
        return Response({'message': 'Password changed successfully'}, status=200)


class RequestPasswordResetEmailAPIView(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = RequestPasswordEmailRequestSerializer

    def create(self, request):
        logger.info(f"Request headers: {request.headers}")
        logger.info(f"Request data: {request.data}")
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
                token = PasswordResetTokenGenerator().make_token(user)
                absurl = f"{settings.PASSWORD_RESET_URL}{token}"
                message = f"Hello {user},\nPlease use the link below to reset your password:\n{absurl}"
                data = {
                    'message': message,
                    'to_email': user.email,
                    'subject': 'Reset Your Password'
                }
                PasswordReset.objects.update_or_create(user=user, defaults={'token': token})
                Util.send_email(data)
                return Response({"success": "We have sent you an email to reset your password."}, status=200)
            else:
                return Response({"error": "This email is not registered."}, status=400)
        return Response(serializer.errors, status=400)


class PasswordResetAPIView(viewsets.GenericViewSet):
    serializer_class = PasswordTokenCheckSerializer

    def create(self, request):
        try:
            token = request.data.get('token')
            password = request.data.get('password')
            reset_user = PasswordReset.objects.filter(token=token)
            if not reset_user.exists():
                return Response({'error':'password reset request not found'}, status=400)
            user = reset_user.first().user
            user.set_password(password)   
            user.save()
            reset_user.first().delete()   
        except Exception as e:
            return Response({'error':'encounter error while reseting password, try again later'}, status=500)
        return Response({'success':'password reset succes'}, status=200)
    


class SendNotificationAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
    #    Get the current time and calculate the nearest deadline range
        current_time = datetime.now()
        deadline_range = current_time + timedelta(hours=24)
        # Get the tasks that are due within the next 24 hours
        tasks = Task.objects.filter(user=request.user, due_date__range=(current_time, deadline_range))
        if not tasks.exists():
            return Response({'message': 'No tasks due in the next 24 hours.'}, status=200)
        notifications_sent = 0
          # Send notifications for each task
        for task in tasks:
            user = task.user
            # Get the FCM token for the user
            fcm_token = user.fcm_tokens.first()
            if fcm_token:  # Ensure the FCM token exists
                title = 'Task Reminder'
                # Check if a notification for this task already exists
            if not Notification.objects.filter(user=user, task=task).exists():
                # Create a new notification if it doesn't exist
                 Notification.objects.create(user=user, task=task, title=title, body=body)   
                 notifications_sent += 1

        return Response({'message': f'Notifications sent for {notifications_sent} tasks.'}, status=200)          

class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
         # Fetch notifications for the authenticated user
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
class TaskDueTomorrowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        current_time = datetime.now()
        deadline_range = current_time + timedelta(hours=24)
        tasks_due_soon = Task.objects.filter(user=request.user, due_date__range=(current_time, deadline_range))
        tasks_data=[
            {
                'id': task.id,
                'name': task.name,
                'description': task.description,
                'due_date': task.due_date
            }
            for task in tasks_due_soon
        ]
        return Response(tasks_data, status=200)


class FeedbackCreateView(APIView):
    """Accept feedback from authenticated or anonymous users."""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            # Attach the user if authenticated
            user = request.user if request.user.is_authenticated else None
            serializer.save(user=user)
            return Response({'message': 'Feedback received. Thank you!'}, status=201)
        return Response(serializer.errors, status=400)

