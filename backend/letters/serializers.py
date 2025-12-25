"""DRF Serializers for API endpoints."""
from rest_framework import serializers
from .models import User, LetterType, Letter, ContentBlock


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser']
        read_only_fields = ['id']


class ContentBlockSerializer(serializers.ModelSerializer):
    """Serializer for ContentBlock model."""

    class Meta:
        model = ContentBlock
        fields = ['id', 'block_type', 'order', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class LetterTypeSerializer(serializers.ModelSerializer):
    """Serializer for LetterType model."""

    class Meta:
        model = LetterType
        fields = ['id', 'name', 'slug', 'description', 'meta_schema', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class LetterSerializer(serializers.ModelSerializer):
    """Serializer for Letter model."""
    content_blocks = ContentBlockSerializer(many=True, read_only=True)
    letter_type = LetterTypeSerializer(read_only=True)
    letter_type_id = serializers.UUIDField(write_only=True)
    public_url = serializers.CharField(source='get_public_url', read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Letter
        fields = [
            'id', 'title', 'description', 'recipient_name', 'slug',
            'letter_type', 'letter_type_id', 'custom_properties',
            'content_blocks', 'is_published', 'published_at',
            'created_by', 'created_at', 'updated_at', 'public_url'
        ]
        read_only_fields = ['id', 'slug', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):  # type: ignore
        """Create letter with content blocks."""
        content_blocks_data = self.context.get('content_blocks', [])
        letter = Letter.objects.create(**validated_data)

        for block_data in content_blocks_data:
            ContentBlock.objects.create(letter=letter, **block_data)

        return letter


class LetterPublicSerializer(serializers.ModelSerializer):
    """Public serializer for Letter model (no admin fields)."""
    content_blocks = ContentBlockSerializer(many=True, read_only=True)
    letter_type = LetterTypeSerializer(read_only=True)

    class Meta:
        model = Letter
        fields = [
            'id', 'title', 'description', 'recipient_name', 'slug',
            'letter_type', 'custom_properties', 'content_blocks', 'created_at'
        ]
        read_only_fields = fields
