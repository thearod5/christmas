# Letter Delivery Application - Technical Specification

## TODO: Implementation Progress

### Phase 1: Foundation ✅
- [x] Project structure and Docker Compose setup
- [x] PostgreSQL container configuration
- [x] Django project initialization with Pydantic support
- [x] React + TypeScript + Vite project setup
- [x] Nginx reverse proxy configuration
- [x] Basic Docker networking and volume management

### Phase 2: Backend Core ✅
- [x] Database models (User, LetterType, Letter, ContentBlock)
- [x] Django migrations
- [x] Pydantic schemas for validation
- [x] mypy configuration and type checking
- [x] Django admin customization for Letter management
- [x] Authentication system setup

### Phase 3: API Development ✅
- [x] Public letter viewing endpoint
- [x] Admin CRUD endpoints for Letters
- [x] Admin CRUD endpoints for LetterTypes
- [x] Auth endpoints (login, logout, me)
- [x] API error handling and validation

### Phase 4: Frontend Foundation ✅
- [x] TypeScript configuration (strict mode)
- [x] Zustand stores (auth, letter, letterType)
- [x] API client setup with type safety
- [x] Routing configuration
- [x] Authentication flow

### Phase 5: Admin Interface ✅
- [x] Admin login page
- [x] Admin dashboard
- [x] Letter list view
- [x] Letter creation form
- [x] Letter editing form
- [x] LetterType management

### Phase 6: Public Letter Experience 🚧
- [x] Public letter viewing route
- [x] Letter landing page UI (basic)
- [ ] Letter opening animation
- [x] Scrollable letter content component (basic)
- [x] Text block rendering with emoji support
- [ ] Responsive design (mobile + desktop)

### Phase 7: Integration & Testing ✅
- [x] End-to-end workflow testing (basic structure in place)
- [x] Type checking (mypy + tsc)
- [x] Production build configuration
- [x] Environment variable configuration
- [x] Documentation for deployment

### Future Enhancements 🔮
- [ ] Letter opening animation with beautiful UI
- [ ] Image block support
- [ ] Rich text block support
- [ ] Responsive design polish
- [ ] Letter templates
- [ ] Custom themes per letter
- [ ] Email notifications
- [ ] Analytics/view tracking

---

## 1. Project Overview

A self-contained web application for creating and sharing beautifully presented letters to loved ones. Admins create letters through Django admin, which are then accessible via public links with an elegant viewing experience.

## 2. Requirements

### 2.1 Functional Requirements

#### Admin Features
- FR-1: Admin authentication and authorization system
- FR-2: Create letters with title, description, and recipient information
- FR-3: Define letter types with typed metadata and customizable properties
- FR-4: Generate public-facing URLs for each letter
- FR-5: Manage letter content with support for text blocks (with emoji support)
- FR-6: Future extensibility for image blocks, rich text blocks, and other content types

#### Public/Visitor Features
- FR-7: Access letters via public URL without authentication
- FR-8: View letter landing page showing title and intended recipient
- FR-9: Trigger letter opening animation on user interaction
- FR-10: Scroll through letter content on mobile and desktop
- FR-11: Render text blocks with emoji support
- FR-12: Responsive design for phone and desktop viewports

### 2.2 Non-Functional Requirements

- NFR-1: Type safety on frontend (TypeScript) and backend (Pydantic + mypy)
- NFR-2: Self-contained deployment via Docker Compose
- NFR-3: Nginx reverse proxy for routing traffic
- NFR-4: PostgreSQL database for data persistence
- NFR-5: Zustand for centralized frontend state management
- NFR-6: Deployable on EC2 instance with public IP

## 3. Architecture

### 3.1 System Architecture

```
[Client Browser]
       |
       v
[Nginx Reverse Proxy] :80, :443
       |
       +----> /api/*     -> Django Backend :8000
       +----> /*         -> React Frontend :3000
```

### 3.2 Technology Stack

#### Backend
- Framework: Django 4.x
- Validation: Pydantic v2
- Type Checking: mypy
- Database: PostgreSQL 15+
- WSGI Server: Gunicorn

#### Frontend
- Framework: React 18+
- Language: TypeScript 5+
- State Management: Zustand
- Build Tool: Vite
- HTTP Client: Axios or Fetch API

#### Infrastructure
- Containerization: Docker + Docker Compose
- Reverse Proxy: Nginx
- Database: PostgreSQL (containerized)

### 3.3 Container Architecture

```
docker-compose.yml
├── nginx (port 80, 443)
├── frontend (internal port 3000)
├── backend (internal port 8000)
└── postgres (internal port 5432)
```

## 4. Database Models

### 4.1 User Model
```
User (Django built-in with customization)
- id: UUID (PK)
- email: EmailField (unique)
- username: CharField (unique)
- is_staff: Boolean
- is_superuser: Boolean
- created_at: DateTimeField
- updated_at: DateTimeField
```

### 4.2 LetterType Model
```
LetterType
- id: UUID (PK)
- name: CharField (unique) - e.g., "Birthday", "Anniversary", "Thank You"
- slug: SlugField (unique)
- description: TextField
- meta_schema: JSONField - Defines typed metadata structure
- created_at: DateTimeField
- updated_at: DateTimeField
```

### 4.3 Letter Model
```
Letter
- id: UUID (PK)
- title: CharField
- description: TextField
- recipient_name: CharField
- letter_type: ForeignKey(LetterType)
- custom_properties: JSONField - Validated against letter_type.meta_schema
- slug: SlugField (unique) - Used in public URL
- created_by: ForeignKey(User)
- is_published: Boolean (default: False)
- published_at: DateTimeField (nullable)
- created_at: DateTimeField
- updated_at: DateTimeField
```

### 4.4 ContentBlock Model
```
ContentBlock
- id: UUID (PK)
- letter: ForeignKey(Letter, related_name='content_blocks')
- block_type: CharField - Choices: 'text', 'image', 'rich_text'
- order: IntegerField - For ordering blocks
- content: JSONField - Structure varies by block_type
  * For 'text': {"text": "content here"}
  * For 'image': {"url": "...", "caption": "..."}
  * For 'rich_text': {"html": "..."}
- created_at: DateTimeField
- updated_at: DateTimeField

Meta:
- ordering: ['order']
- unique_together: ['letter', 'order']
```

## 5. API Endpoints

### 5.1 Public Endpoints (No Authentication Required)

#### GET /api/letters/{slug}/
- Description: Retrieve letter details by slug for public viewing
- Response: Letter object with nested content blocks, letter type info
- Status Codes: 200 OK, 404 Not Found

### 5.2 Admin Endpoints (Authentication Required)

#### GET /api/admin/letters/
- Description: List all letters (admin only)
- Response: Paginated list of letters
- Status Codes: 200 OK, 401 Unauthorized, 403 Forbidden

#### POST /api/admin/letters/
- Description: Create a new letter
- Request Body: Letter data with content blocks
- Response: Created letter object
- Status Codes: 201 Created, 400 Bad Request, 401 Unauthorized

#### GET /api/admin/letters/{id}/
- Description: Retrieve specific letter by ID (admin only)
- Response: Full letter object
- Status Codes: 200 OK, 404 Not Found, 401 Unauthorized

#### PUT /api/admin/letters/{id}/
- Description: Update existing letter
- Request Body: Updated letter data
- Response: Updated letter object
- Status Codes: 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

#### DELETE /api/admin/letters/{id}/
- Description: Delete a letter
- Response: No content
- Status Codes: 204 No Content, 404 Not Found, 401 Unauthorized

#### GET /api/admin/letter-types/
- Description: List all letter types
- Response: List of letter types with meta schemas
- Status Codes: 200 OK, 401 Unauthorized

#### POST /api/admin/letter-types/
- Description: Create a new letter type
- Request Body: Letter type data with meta schema
- Response: Created letter type object
- Status Codes: 201 Created, 400 Bad Request, 401 Unauthorized

#### POST /api/auth/login/
- Description: Admin login
- Request Body: {"username": "...", "password": "..."}
- Response: {"token": "...", "user": {...}}
- Status Codes: 200 OK, 401 Unauthorized

#### POST /api/auth/logout/
- Description: Admin logout
- Response: Success message
- Status Codes: 200 OK, 401 Unauthorized

#### GET /api/auth/me/
- Description: Get current authenticated user
- Response: User object
- Status Codes: 200 OK, 401 Unauthorized

## 6. Frontend Routes

### Public Routes
- `/letter/{slug}` - View letter (landing page with animation)

### Admin Routes
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard
- `/admin/letters` - List all letters
- `/admin/letters/new` - Create new letter
- `/admin/letters/{id}/edit` - Edit existing letter
- `/admin/letter-types` - Manage letter types

## 7. Frontend State Management (Zustand)

### Stores

#### authStore
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
```

#### letterStore
```typescript
interface LetterState {
  currentLetter: Letter | null;
  letters: Letter[];
  isLoading: boolean;
  error: string | null;
  fetchLetter: (slug: string) => Promise<void>;
  fetchLetters: () => Promise<void>;
  createLetter: (data: CreateLetterDTO) => Promise<void>;
  updateLetter: (id: string, data: UpdateLetterDTO) => Promise<void>;
  deleteLetter: (id: string) => Promise<void>;
}
```

#### letterTypeStore
```typescript
interface LetterTypeState {
  letterTypes: LetterType[];
  isLoading: boolean;
  fetchLetterTypes: () => Promise<void>;
  createLetterType: (data: CreateLetterTypeDTO) => Promise<void>;
}
```

## 8. Type Safety Implementation

### Backend (Django + Pydantic)

- Use Pydantic models for request/response validation
- Configure mypy strict mode in `pyproject.toml`
- Use Django-Ninja or similar for automatic OpenAPI spec generation
- Type hints for all function signatures

### Frontend (TypeScript)

- Strict TypeScript configuration in `tsconfig.json`
- Shared type definitions in `src/types/`
- Auto-generate types from OpenAPI spec (optional)
- No `any` types without justification

## 9. Deployment Configuration

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@postgres:5432/dbname
SECRET_KEY=<django-secret>
DEBUG=False
ALLOWED_HOSTS=example.com,www.example.com
FRONTEND_URL=https://example.com
```

#### Frontend (.env)
```
VITE_API_URL=https://example.com/api
```

#### Docker Compose
```
POSTGRES_USER=letterapp
POSTGRES_PASSWORD=<secure-password>
POSTGRES_DB=letterdb
```

## 10. Development Phases

### Phase 1: Foundation
- Docker Compose setup
- Django project with PostgreSQL
- React project with TypeScript + Zustand
- Nginx configuration
- Basic authentication

### Phase 2: Core Features
- Database models and migrations
- Django admin customization
- CRUD API endpoints
- Frontend admin interface

### Phase 3: Public Experience
- Public letter viewing endpoint
- Letter landing page UI
- Letter opening animation
- Scrollable letter content rendering

### Phase 4: Polish & Deploy
- Responsive design refinement
- Error handling and validation
- Production configuration
- EC2 deployment documentation

## 11. Future Enhancements

- Image block support
- Rich text block support
- Video block support
- Letter templates
- Custom themes per letter
- Email notifications
- Analytics/view tracking
- Letter expiration dates
