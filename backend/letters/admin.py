from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, LetterType, Letter, ContentBlock


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom user admin with UUID support."""
    list_display = ['username', 'email', 'is_staff', 'is_superuser', 'created_at']
    list_filter = ['is_staff', 'is_superuser', 'is_active']
    search_fields = ['username', 'email']
    ordering = ['-created_at']


class ContentBlockInline(admin.TabularInline):
    """Inline editor for content blocks."""
    model = ContentBlock
    extra = 1
    fields = ['block_type', 'order', 'content']


@admin.register(LetterType)
class LetterTypeAdmin(admin.ModelAdmin):
    """Admin for letter types."""
    list_display = ['name', 'slug', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Letter)
class LetterAdmin(admin.ModelAdmin):
    """Admin for letters with inline content blocks."""
    list_display = ['title', 'recipient_name', 'letter_type', 'is_published', 'created_by', 'copy_url_button', 'created_at']
    list_filter = ['is_published', 'letter_type', 'created_at']
    search_fields = ['title', 'recipient_name', 'description']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'get_public_url']
    inlines = [ContentBlockInline]

    def copy_url_button(self, obj):  # type: ignore
        """Display a button to copy the public URL."""
        url = obj.get_public_url()
        return format_html(
            '<button type="button" onclick="navigator.clipboard.writeText(\'{}\'); '
            'this.textContent=\'Copied!\'; setTimeout(() => this.textContent=\'Copy URL\', 2000);" '
            'style="padding: 5px 10px; cursor: pointer; background: #417690; color: white; '
            'border: none; border-radius: 4px; font-size: 11px;">Copy URL</button>',
            url
        )
    copy_url_button.short_description = 'Public URL'  # type: ignore

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'recipient_name', 'description')
        }),
        ('Letter Configuration', {
            'fields': ('letter_type', 'custom_properties')
        }),
        ('Publishing', {
            'fields': ('is_published', 'published_at')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at', 'get_public_url'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):  # type: ignore
        """Set created_by to current user if not set."""
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    """Admin for content blocks."""
    list_display = ['letter', 'block_type', 'order', 'created_at']
    list_filter = ['block_type', 'created_at']
    search_fields = ['letter__title']
    ordering = ['letter', 'order']
