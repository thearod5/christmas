from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.request import Request
from .models import Letter, LetterType, ContentBlock
from .serializers import (
    LetterSerializer,
    LetterPublicSerializer,
    LetterTypeSerializer,
)
from typing import Any


class IsAdminUser(permissions.BasePermission):
    """Custom permission to only allow admin users."""

    def has_permission(self, request: Request, view: Any) -> bool:
        return bool(request.user and request.user.is_staff)


class LetterTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for letter types (admin only)."""
    queryset = LetterType.objects.all()
    serializer_class = LetterTypeSerializer
    permission_classes = [IsAdminUser]


class LetterViewSet(viewsets.ModelViewSet):
    """ViewSet for letters (admin only)."""
    queryset = Letter.objects.select_related('letter_type', 'created_by').prefetch_related('content_blocks').all()
    serializer_class = LetterSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer: Any) -> None:
        """Set created_by to current user."""
        serializer.save(created_by=self.request.user)

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Create a letter with content blocks."""
        serializer = self.get_serializer(
            data=request.data,
            context={'content_blocks': request.data.get('content_blocks', [])}
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Update a letter and optionally replace content blocks."""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Handle content blocks update
        if 'content_blocks' in request.data:
            # Delete existing content blocks
            instance.content_blocks.all().delete()
            # Create new content blocks
            for block_data in request.data['content_blocks']:
                ContentBlock.objects.create(letter=instance, **block_data)

        # Refresh to get updated content blocks
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def letter_public_view(request: Request, slug: str) -> Response:
    """Public view for a letter by slug."""
    try:
        letter = Letter.objects.select_related('letter_type').prefetch_related('content_blocks').get(
            slug=slug,
            is_published=True
        )
        serializer = LetterPublicSerializer(letter)
        return Response(serializer.data)
    except Letter.DoesNotExist:
        return Response(
            {'error': 'Letter not found or not published'},
            status=status.HTTP_404_NOT_FOUND
        )


