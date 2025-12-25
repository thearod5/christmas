"""Django management command to create a superuser if one doesn't exist."""
import os
from typing import Any

from django.core.management.base import BaseCommand

from letters.models import User


class Command(BaseCommand):
    """Create a superuser if one doesn't exist."""

    help = "Creates a superuser if one doesn't exist (useful for initialization)"

    def add_arguments(self, parser: Any) -> None:
        """Add command arguments."""
        parser.add_argument(
            '--username',
            type=str,
            default=os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin'),
            help='Username for the superuser (default: admin or DJANGO_SUPERUSER_USERNAME env var)',
        )
        parser.add_argument(
            '--email',
            type=str,
            default=os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com'),
            help='Email for the superuser (default: admin@example.com or DJANGO_SUPERUSER_EMAIL env var)',
        )
        parser.add_argument(
            '--password',
            type=str,
            default=os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123'),
            help='Password for the superuser (default: admin123 or DJANGO_SUPERUSER_PASSWORD env var)',
        )
        parser.add_argument(
            '--no-input',
            action='store_true',
            help='Skip confirmation prompts',
        )

    def handle(self, *args: Any, **options: Any) -> None:
        """Execute the command."""
        username: str = options['username']
        email: str = options['email']
        password: str = options['password']
        no_input: bool = options['no_input']

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f"Superuser '{username}' already exists.")
            )
            return

        # Create the superuser
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        self.stdout.write(
            self.style.SUCCESS(f"Superuser '{username}' created successfully!")
        )
