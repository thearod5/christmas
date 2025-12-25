# Quick Start Guide

Get the Letter Delivery Application up and running in less than 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- Ports 80, 3000, 5432, and 8000 available

## Installation Steps

### 1. Clone and Setup

```bash
# Navigate to project directory
cd christmas

# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

The setup script will:
- Build all Docker containers
- Start PostgreSQL, backend, frontend, and nginx
- Run database migrations
- Create an admin user

### 2. Access the Application

Once setup is complete, you can access:

- **Frontend**: [http://localhost](http://localhost)
- **Django Admin**: [http://localhost/admin](http://localhost/admin)
- **API**: [http://localhost/api](http://localhost/api)

### 3. Login

Use these default credentials to log in:

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## First Steps

### Create Your First Letter Type

1. Log in at [http://localhost/admin/dashboard](http://localhost/admin/dashboard)
2. Click "Manage Types"
3. Click "Create New Type"
4. Enter:
   - **Name**: Birthday Letter
   - **Description**: A letter for birthday wishes
5. Click "Create"

### Create Your First Letter

1. Go back to the dashboard
2. Click "Manage Letters"
3. Click "Create New Letter"
4. Fill in the form:
   - **Title**: Happy Birthday!
   - **Recipient Name**: John
   - **Description**: A special birthday message
   - **Letter Type**: Birthday Letter
   - **Content Blocks**: Click "Add Text Block" and write your message
5. Check "Published" to make it public
6. Click "Create Letter"

### View Your Letter

1. After creating the letter, you'll see it in the letters list
2. The slug will be auto-generated (e.g., `happy-birthday`)
3. Access it at: `http://localhost/letter/happy-birthday`
4. Share this link with anyone to view the letter!

## Development

### View Logs

```bash
docker-compose logs -f
```

### Stop the Application

```bash
docker-compose down
```

### Restart the Application

```bash
docker-compose up -d
```

### Local Development (without Docker)

**Backend:**
```bash
cd backend

# Install uv if not installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create and activate virtual environment
uv venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
uv sync

# Run server
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Type Checking

**Backend (Python):**
```bash
cd backend
source .venv/bin/activate
mypy .
```

**Frontend (TypeScript):**
```bash
cd frontend
npm run type-check
```

### Package Management

**Backend (with uv):**
```bash
# Add a package
uv pip install package-name

# Update packages
uv pip install --upgrade -r requirements.txt

# Or use pyproject.toml
uv add package-name
uv sync
```

**Frontend:**
```bash
npm install package-name
npm update
```

## Troubleshooting

### Port Already in Use

If you see "port already allocated" errors:

```bash
# Stop the containers
docker-compose down

# Check what's using the port
lsof -i :80  # or :3000, :5432, :8000

# Kill the process or change the port in docker-compose.yml
```

### Database Connection Issues

```bash
# Restart the database container
docker-compose restart postgres

# Wait a few seconds and try again
```

### Frontend Not Loading

```bash
# Rebuild the frontend container
docker-compose up -d --build frontend
```

### Need to Reset Everything

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Run setup again
./setup.sh
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [REQUIREMENTS.md](REQUIREMENTS.md) for technical specifications
- Customize the styling in the frontend
- Add custom letter types with metadata schemas
- Deploy to production (see README.md)

## Support

For issues or questions, refer to the main documentation files:
- [README.md](README.md) - Full documentation
- [REQUIREMENTS.md](REQUIREMENTS.md) - Technical specifications
