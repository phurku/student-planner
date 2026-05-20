"""
URL configuration for planner project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_other.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from work.views import TaskViewSet, ScheduleViewSet, TimerView
from rest_framework_simplejwt.views import ( 
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
#
api_router = DefaultRouter()

api_router.register('users', UserViewSet, basename='user')
api_router.register('tasks', TaskViewSet, basename='task')
api_router.register('schedules', ScheduleViewSet, basename='schedule')


def api_home(request):
    return JsonResponse({
        'message': 'Student Planner backend is running.',
        'admin': '/admin/',
        'api': '/api/v1/',
    })

"""
http://127.0.0.1:8000/api/v1/users/
[get, post]

http://127.0.0.1:8000/api/v1/users/{user_id}/
[put, patch, delete]



http://127.0.0.1:8000/api/v1/tasks/
"""
urlpatterns = [
    path('', api_home, name='api_home'),
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_router.urls)),
    path('api/v1/timer/start/<int:task_id>/', TimerView.as_view(), name='timer_start'),
    path('api/v1/timer/stop/<int:duration_id>/', TimerView.as_view(), name='timer_stop'),
    path('api/v1/timer/total-duration/', TimerView.as_view(), name='timer_total_duration'),
    path('api/v1/tasks-due-tomorrow/', TaskViewSet.as_view({'get': 'tasks_due_tomorrow'}), name='tasks_due_tomorrow'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')

]
