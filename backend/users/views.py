from rest_framework import viewsets, mixins, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action  # Import the action decorator
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from users.serializers import UserCreateSerializer

class UserViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer

    def get_permissions(self):
        if self.action in ['create', 'login']:
            return [permissions.AllowAny()]  # Allow unauthenticated access for registration and login
        return [permissions.IsAuthenticated()]  # Require authentication for other actions

    def create(self, request):
        user_serializer = UserCreateSerializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login successful'
            }, status=200)
        return Response({'error': 'Invalid credentials'}, status=401)