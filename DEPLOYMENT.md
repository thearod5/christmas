# Deployment Guide

This guide covers deploying the Letter Delivery Application to production on AWS EC2.

## Prerequisites

- AWS account with EC2 access
- Domain name (optional but recommended)
- SSH key pair for EC2 access

## EC2 Instance Setup

### 1. Launch EC2 Instance

1. Launch an Ubuntu 22.04 LTS instance
2. Instance type: t2.small or larger (minimum 2GB RAM)
3. Configure security group:
   - SSH (22) - Your IP only
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
4. Attach your SSH key pair

### 2. Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Install Docker

```bash
# Update package list
sudo apt-get update

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
exit
```

### 4. Install Docker Compose

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Docker Compose V2 is installed with Docker
docker compose version
```

## Application Deployment

### 1. Clone Repository

```bash
git clone <your-repo-url> letterapp
cd letterapp
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit environment variables
nano .env
```

**Important environment variables for production:**

```env
# Database - Use strong passwords!
POSTGRES_USER=letterapp
POSTGRES_PASSWORD=<generate-strong-password>
POSTGRES_DB=letterdb

# Django - CRITICAL: Change these!
DJANGO_SECRET_KEY=<generate-secret-key>
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,<ec2-ip>
FRONTEND_URL=https://your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Frontend
VITE_API_URL=https://your-domain.com/api

# Superuser
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@your-domain.com
DJANGO_SUPERUSER_PASSWORD=<generate-strong-password>
```

**Generate secure secrets:**

```bash
# Django secret key
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# PostgreSQL password
openssl rand -base64 32
```

### 3. Build and Start Production

```bash
# Build and start with production configuration
docker compose -f docker-compose.prod.yml up -d --build

# Check logs
docker compose -f docker-compose.prod.yml logs -f
```

### 4. Verify Deployment

```bash
# Check all containers are running
docker compose -f docker-compose.prod.yml ps

# Test the application
curl http://localhost
```

## Domain Configuration

### 1. Point Domain to EC2

1. In your DNS provider, create an A record:
   - Host: `@` (or your subdomain)
   - Value: Your EC2 public IP
   - TTL: 300

2. Wait for DNS propagation (can take up to 24 hours)

### 2. SSL Certificate Setup (Let's Encrypt)

```bash
# Install certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Stop nginx container temporarily
docker compose -f docker-compose.prod.yml stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Create SSL directory
mkdir -p nginx/ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
sudo chown -R $USER:$USER nginx/ssl/
```

### 3. Update Nginx Configuration

Create `nginx/conf.d/ssl.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # API endpoints
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # Django admin
    location /admin/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # Static files
    location /static/ {
        alias /static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

### 4. Restart Services

```bash
# Restart nginx
docker compose -f docker-compose.prod.yml restart nginx

# Verify SSL
curl https://your-domain.com
```

### 5. Setup Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot will auto-renew, but update the certificates in docker:
sudo crontab -e

# Add this line:
0 0 * * * certbot renew --quiet && cp /etc/letsencrypt/live/your-domain.com/*.pem /home/ubuntu/letterapp/nginx/ssl/ && cd /home/ubuntu/letterapp && docker compose -f docker-compose.prod.yml restart nginx
```

## Maintenance

### View Logs

```bash
docker compose -f docker-compose.prod.yml logs -f [service-name]
```

### Restart Services

```bash
docker compose -f docker-compose.prod.yml restart [service-name]
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# Run new migrations if any
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate
```

### Backup Database

```bash
# Create backup
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U letterapp letterdb > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup_20231224.sql | docker compose -f docker-compose.prod.yml exec -T postgres psql -U letterapp letterdb
```

### Monitor Resources

```bash
# Check disk space
df -h

# Check container resources
docker stats

# Check logs size
du -sh /var/lib/docker/
```

## Security Best Practices

1. **Change default passwords** - Never use default credentials in production
2. **Enable firewall** - Use ufw or AWS security groups
3. **Regular updates** - Keep system and containers updated
4. **Backup regularly** - Automate database backups
5. **Monitor logs** - Set up log monitoring and alerts
6. **Use strong SSL** - Keep certificates up to date
7. **Restrict admin access** - Use VPN or IP whitelist for Django admin

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs [service]

# Check container status
docker compose -f docker-compose.prod.yml ps
```

### Database Connection Issues

```bash
# Restart postgres
docker compose -f docker-compose.prod.yml restart postgres

# Check postgres logs
docker compose -f docker-compose.prod.yml logs postgres
```

### SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Copy to nginx directory
sudo cp /etc/letsencrypt/live/your-domain.com/*.pem nginx/ssl/
```

### Out of Disk Space

```bash
# Clean up Docker
docker system prune -a

# Remove old images
docker image prune -a
```

## Monitoring and Alerts

Consider setting up:

- CloudWatch (AWS) for monitoring
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Log aggregation (CloudWatch Logs, ELK stack)

## Scaling

For high traffic:

1. Use Application Load Balancer
2. Run multiple backend instances
3. Use RDS for PostgreSQL instead of container
4. Use S3 for media files
5. Add Redis for caching
6. Use CloudFront CDN
