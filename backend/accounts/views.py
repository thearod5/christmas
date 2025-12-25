from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from letters.serializers import UserSerializer
from letters.views import IsAdminUser


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=username, password=password)

    if user is not None and user.is_staff:
        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'user': serializer.data,
            'message': 'Login successful'
        })
    else:
        return Response(
            {'error': 'Invalid credentials or not authorized'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([IsAdminUser])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logout successful'})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def current_user_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
