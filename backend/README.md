# Backend - Letter Delivery Application

Django backend with PostgreSQL, Pydantic validation, and type checking.

## Setup with uv

[uv](https://github.com/astral-sh/uv) is a fast Python package manager and resolver written in Rust.

### Install uv

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or with pip
pip install uv
```

### Development Setup

```bash
cd backend

# Create virtual environment with uv
uv venv .venv

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies with uv
uv pip install -r requirements.txt

# Install dev dependencies
uv pip install -e ".[dev]"

# Or sync from pyproject.toml
uv sync
```

### Package Management

```bash
# Add a new package
uv pip install package-name

# Add to requirements.txt
echo "package-name==x.x.x" >> requirements.txt

# Or add to pyproject.toml and sync
uv add package-name
uv sync

# Update all packages
uv pip install --upgrade -r requirements.txt

# Update a specific package
uv pip install --upgrade package-name
```

### Running the Server

```bash
# Run migrations
python manage.py migrate

# Create superuser
python create_superuser.py

# Run development server
python manage.py runserver
```

### Type Checking

```bash
# Run mypy type checking
mypy .

# Or with uv (if installed with dev dependencies)
uv run mypy .
```

### Testing

```bash
# Run Django tests
python manage.py test

# With coverage
uv pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## Project Structure

```
backend/
├── config/              # Django settings and URLs
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── letters/            # Main application
│   ├── models.py       # Database models
│   ├── serializers.py  # DRF serializers
│   ├── schemas.py      # Pydantic schemas
│   ├── views.py        # API views
│   ├── urls.py         # URL routing
│   └── admin.py        # Admin configuration
├── pyproject.toml      # Project configuration and dependencies
├── requirements.txt    # Production dependencies
├── manage.py           # Django management script
└── create_superuser.py # Helper script for superuser creation
```

## API Endpoints

### Public
- `GET /api/letters/{slug}/` - View published letter

### Authentication
- `POST /api/auth/login/` - Admin login
- `POST /api/auth/logout/` - Admin logout
- `GET /api/auth/me/` - Get current user

### Admin (Requires Authentication)
- `GET /api/admin/letters/` - List letters
- `POST /api/admin/letters/` - Create letter
- `GET /api/admin/letters/{id}/` - Get letter
- `PATCH /api/admin/letters/{id}/` - Update letter
- `DELETE /api/admin/letters/{id}/` - Delete letter
- `GET /api/admin/letter-types/` - List letter types
- `POST /api/admin/letter-types/` - Create letter type
- `PATCH /api/admin/letter-types/{id}/` - Update letter type
- `DELETE /api/admin/letter-types/{id}/` - Delete letter type

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost
```

## Type Safety

- All models use type hints
- Pydantic schemas for request/response validation
- mypy configured in strict mode
- Django-stubs for Django type hints
- DRF-stubs for Django REST Framework type hints

## Performance Tips

With uv:
- Package installation is 10-100x faster than pip
- Better dependency resolution
- Compatible with pip and requirements.txt
- Drop-in replacement for pip commands
