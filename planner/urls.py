"""
URL configuration for planner project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import PasswordResetAPIView, RequestPasswordResetEmailAPIView, UserViewSet, UserProfileView
from users.views import SendNotificationAPIView, NotificationListView, TaskDueTomorrowView, FeedbackCreateView
from work.views import TimerView

# from users.views import MarkTaskAsReadViewSet
from users.views import UserProfileView
from work.views import ScheduleViewSet, TaskViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


def api_root(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'StudyMate backend is running.',
        'api_base': '/api/v1/'
    })

#
api_router = DefaultRouter()
# REgister the UserViewSet
api_router.register('users', UserViewSet, basename='user')
api_router.register('tasks', TaskViewSet, basename='task')
api_router.register('schedules', ScheduleViewSet, basename='schedule')
# api_router.register('durations', TaskTotalDurationAPIView, basename='duration')
api_router.register('forget-password', RequestPasswordResetEmailAPIView, basename='password-reset')
api_router.register('password-reset-confirm', PasswordResetAPIView, basename='password-reset-confirm')



# Register the TaskViewSet
# api_router.register('tasks', TaskViewSet, basename='task')

"""
http://127.0.0.1:8000/api/v1/users/
[get, post]

http://127.0.0.1:8000/api/v1/users/{user_id}/
[put, patch, delete]



http://127.0.0.1:8000/api/v1/tasks/
"""
urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    # handles http post request to send notification
    path('api/v1/send-notification/', SendNotificationAPIView.as_view(), name='send-notification'),
    path('api/v1/notifications/', NotificationListView.as_view(), name='notifications'),
    path('api/v1/tasks-due-tomorrow/',TaskDueTomorrowView.as_view(), name='tasks-due-tomorrow'),
    path('api/v1/feedback/', FeedbackCreateView.as_view(), name='feedback'),
    # path('api/v1/users/forget_password/', RequestPasswordResetEmailAPIView.as_view(), name='user-forget-password'),
# Timer urls
path('api/v1/timer/start/<int:task_id>/', TimerView.as_view(), name='start-timer'),
    path('api/v1/timer/stop/<int:duration_id>/', TimerView.as_view(), name='stop-timer'),
    path('api/v1/timer/total-duration/', TimerView.as_view(), name='total-duration'),

    # path('api/v1/tasks/<int:task_id>/start-timer/', StartTimerAPIView.as_view(), name='start-timer'),
    # path('api/v1/durations/<int:duration_id>/stop-timer/', StopTimerAPIView.as_view(), name='stop-timer'),
    # path('api/v1/tasks/total-duration/', TimerView.as_view(), name='total-duration'),    
    # path('tasks/<int:task_id>/mark-as-read/', MarkTaskAsReadViewSet.as_view(), name='mark-task-as-read'),

]
