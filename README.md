# Letter Delivery Application

A self-contained web application for creating and sharing beautifully presented letters to loved ones. Admins create letters through Django admin, which are then accessible via public links with an elegant viewing experience.

## Tech Stack

### Backend
- Django 4.2 with PostgreSQL
- Pydantic for validation
- mypy for type checking
- Django REST Framework

### Frontend
- React 18 with TypeScript
- Zustand for state management
- Vite for building
- React Router for routing

### Infrastructure
- Docker Compose
- Nginx reverse proxy
- PostgreSQL 15

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Development Setup (Recommended)

The development setup runs services with hot-reload and direct port access (no nginx proxy).

1. **Clone the repository and use the provided .env file**
   ```bash
   # The .env file is already configured for development
   # No need to copy from .env.example
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173 (Vite dev server with hot reload)
   - Backend API: http://localhost:8000/api
   - Django Admin: http://localhost:8000/admin
   - PostgreSQL: localhost:5432

   Default admin credentials:
   - Username: `admin`
   - Password: `admin123`

   Note: Migrations and superuser creation happen automatically on startup.

### Production Setup

The production setup uses nginx as a reverse proxy and serves optimized builds.

1. **Copy and configure production environment**
   ```bash
   cp .env.prod.example .env
   # Edit .env and update all CHANGE_ME values
   ```

2. **Start the application with production overrides**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

3. **Access the application**
   - All traffic: http://yourdomain.com (via nginx)
   - Frontend: Served via nginx at /
   - Backend API: Proxied via nginx at /api
   - Django Admin: Proxied via nginx at /admin

   Note: In production, services are not directly accessible; nginx handles all routing.

### Development

#### Backend Development

We use [uv](https://github.com/astral-sh/uv) for fast Python package management.

**Install uv:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Setup:**
```bash
cd backend

# Create virtual environment
uv venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt

# Or sync from pyproject.toml
uv sync

# Run migrations
python manage.py migrate

# Create superuser
python manage.py ensure_superuser

# Run development server
python manage.py runserver
```

**Package management:**
```bash
# Add a package
uv pip install package-name
echo "package-name==x.x.x" >> requirements.txt

# Or with pyproject.toml
uv add package-name

# Update packages
uv pip install --upgrade -r requirements.txt
```

**Type checking:**
```bash
mypy .
```

#### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

**Type checking:**
```bash
npm run type-check
```

## Project Structure

```
.
├── backend/                 # Django backend
│   ├── config/             # Django settings
│   ├── letters/            # Main app
│   │   ├── models.py       # Database models
│   │   ├── serializers.py  # DRF serializers
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── views.py        # API views
│   │   └── admin.py        # Django admin config
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── stores/        # Zustand stores
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── nginx/                  # Nginx configuration
│   ├── nginx.conf
│   └── conf.d/
├── docker-compose.yml      # Development configuration
├── docker-compose.prod.yml # Production overrides
├── .env                    # Development environment variables
├── .env.prod.example       # Production environment template
└── REQUIREMENTS.md         # Technical specification
```

## API Endpoints

### Public Endpoints
- `GET /api/letters/{slug}/` - View a published letter

### Authentication
- `POST /api/auth/login/` - Admin login
- `POST /api/auth/logout/` - Admin logout
- `GET /api/auth/me/` - Get current user

### Admin Endpoints (Authentication Required)
- `GET /api/admin/letters/` - List all letters
- `POST /api/admin/letters/` - Create a letter
- `GET /api/admin/letters/{id}/` - Get letter details
- `PATCH /api/admin/letters/{id}/` - Update a letter
- `DELETE /api/admin/letters/{id}/` - Delete a letter
- `GET /api/admin/letter-types/` - List letter types
- `POST /api/admin/letter-types/` - Create a letter type

## Usage

### Creating a Letter Type

1. Log in to the admin interface at `/admin/dashboard`
2. Navigate to "Letter Types"
3. Create a new letter type with a name and description
4. Optionally define a JSON schema for custom properties

### Creating a Letter

1. Navigate to "Letters" in the admin dashboard
2. Click "Create New Letter"
3. Fill in the letter details:
   - Title
   - Recipient name
   - Description
   - Select a letter type
   - Add text content blocks
4. Check "Published" when ready to make it public
5. Save the letter

### Sharing a Letter

Once a letter is published, it will have a public URL in the format:
```
http://yourdomain.com/letter/{slug}
```

Share this URL with the recipient to view the letter.

## Type Safety

### Backend (Python)
- All models use type hints
- Pydantic schemas validate API requests/responses
- mypy configured in strict mode
- Run `mypy .` to type-check

### Frontend (TypeScript)
- Strict TypeScript configuration
- Type-safe API client
- Type-safe Zustand stores
- Run `npm run type-check` to validate types

## Deployment

### Production Configuration

1. **Copy and configure production environment:**
   ```bash
   cp .env.prod.example .env
   ```

   Then edit `.env` and update all values marked with `CHANGE_ME`:
   - Generate a secure `DJANGO_SECRET_KEY`
   - Set strong passwords for `POSTGRES_PASSWORD` and `DJANGO_SUPERUSER_PASSWORD`
   - Update `ALLOWED_HOSTS` with your domain(s)
   - Update `FRONTEND_URL` and `CORS_ALLOWED_ORIGINS` with your production URL(s)

2. **Build and start production containers:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

   Note: Migrations and superuser creation happen automatically on startup.

3. **Verify deployment:**
   ```bash
   docker-compose logs -f
   ```

### Environment Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| Compose Command | `docker-compose up` | `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d` |
| Frontend Port | 5173 (direct) | 80/443 (via nginx) |
| Backend Port | 8000 (direct) | Internal only (via nginx) |
| Frontend Server | Vite dev (hot reload) | Static build served by serve |
| Backend Server | Django runserver | Gunicorn |
| Nginx | Not used | Reverse proxy |
| Source Mounting | Yes | No |
| Debug Mode | True | False |

### AWS EC2 Deployment

1. Launch an EC2 instance (Ubuntu 22.04 recommended)
2. Install Docker and Docker Compose:
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo systemctl enable docker
   sudo usermod -aG docker ubuntu
   ```
3. Clone the repository
4. Follow "Production Configuration" steps above
5. Open ports 80 and 443 in security groups
6. (Optional) Configure SSL with Let's Encrypt:
   ```bash
   # Install certbot
   sudo apt install -y certbot
   # Generate certificates
   sudo certbot certonly --standalone -d yourdomain.com
   # Update nginx config to use SSL
   ```

## Contributing

See `REQUIREMENTS.md` for detailed technical specifications and implementation progress.

## License

Proprietary - All rights reserved
