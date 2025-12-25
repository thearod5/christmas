import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify


class User(AbstractUser):
    """Custom user model with UUID primary key."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.username


class LetterType(models.Model):
    """Defines letter templates with typed metadata schemas."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField()
    meta_schema = models.JSONField(
        help_text="JSON schema defining the structure of custom properties",
        default=dict,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs) -> None:  # type: ignore
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Letter(models.Model):
    """Main letter entity with typed metadata and public URL."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    recipient_name = models.CharField(max_length=200)
    letter_type = models.ForeignKey(
        LetterType,
        on_delete=models.PROTECT,
        related_name='letters',
    )
    custom_properties = models.JSONField(
        help_text="Custom properties validated against letter_type.meta_schema",
        default=dict,
        blank=True,
    )
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    created_by = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='letters',
    )
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs) -> None:  # type: ignore
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Letter.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.title} (to {self.recipient_name})"

    def get_public_url(self) -> str:
        """Generate the public URL for this letter."""
        from django.conf import settings
        return f"{settings.FRONTEND_URL}/letter/{self.slug}"


class ContentBlock(models.Model):
    """Polymorphic content blocks for letters (text, image, rich_text)."""

    BLOCK_TYPE_CHOICES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('rich_text', 'Rich Text'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    letter = models.ForeignKey(
        Letter,
        on_delete=models.CASCADE,
        related_name='content_blocks',
    )
    block_type = models.CharField(max_length=20, choices=BLOCK_TYPE_CHOICES)
    order = models.IntegerField()
    content = models.JSONField(
        help_text=(
            "Structure varies by block_type. "
            "text: {'text': '...'}, "
            "image: {'url': '...', 'caption': '...'}, "
            "rich_text: {'html': '...'}"
        )
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        unique_together = ['letter', 'order']

    def __str__(self) -> str:
        return f"{self.block_type} block #{self.order} for {self.letter.title}"
