# Project Structure - Complete Nuxt 3 Blog Application

## Overview
Complete Nuxt 3 blog application for TCC thesis benchmark comparing Next.js vs Nuxt performance.

## Directory Structure

```
benchmark-nuxt/
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── PROJECT_STRUCTURE.md            # This file
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── nuxt.config.ts                  # Nuxt 3 configuration
│
├── assets/
│   └── css/
│       └── main.css                # Global Tailwind CSS
│
├── components/                     # Reusable Vue components
│   ├── Header.vue                  # Blog header with navigation
│   ├── Footer.vue                  # Blog footer
│   ├── PostCard.vue                # Individual post preview card
│   ├── PostList.vue                # Grid of post cards
│   ├── PostContent.vue             # Rendered markdown content
│   ├── CommentItem.vue             # Single comment display
│   ├── CommentList.vue             # List of comments
│   ├── AdminPostForm.vue           # Form for creating/editing posts
│   └── Pagination.vue              # Pagination controls
│
├── composables/                    # Composition API utilities
│   └── useAuth.ts                  # Authentication composable
│
├── layouts/
│   └── default.vue                 # Default layout with header/footer
│
├── middleware/
│   └── admin-auth.ts               # Client-side admin route protection
│
├── pages/                          # Route pages
│   ├── index.vue                   # Home page (/)
│   ├── posts/
│   │   └── [slug].vue              # Post detail page (/posts/[slug])
│   └── admin/
│       ├── login.vue               # Admin login page
│       └── posts/
│           ├── index.vue           # Post management list
│           ├── new.vue             # Create new post
│           └── [id]/
│               └── edit.vue        # Edit post
│
├── prisma/                         # Database configuration
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Database seeding script
│
├── server/                         # Server-side logic
│   ├── api/
│   │   ├── auth/
│   │   │   └── login.post.ts       # POST /api/auth/login
│   │   └── posts/
│   │       ├── index.get.ts        # GET /api/posts (list)
│   │       ├── index.post.ts       # POST /api/posts (create)
│   │       └── [slug]/
│   │           ├── index.get.ts    # GET /api/posts/:slug
│   │           ├── index.put.ts    # PUT /api/posts/:slug (update)
│   │           ├── index.delete.ts # DELETE /api/posts/:slug
│   │           └── comments.get.ts # GET /api/posts/:slug/comments
│   ├── middleware/
│   │   └── auth.ts                 # Server-side auth middleware
│   └── utils/
│       ├── prisma.ts               # Prisma client singleton
│       └── auth.ts                 # JWT utilities
│
├── types/
│   └── index.ts                    # TypeScript type definitions
│
└── utils/
    └── markdown.ts                 # Markdown to HTML converter

```

## Key Files Description

### Configuration Files

- **nuxt.config.ts**: Main Nuxt configuration
  - Module setup (Tailwind, Google Fonts, @nuxt/image)
  - Route rules (prerender, SSR, ISR)
  - Runtime config for JWT secret and database URL
  - CSS and Nitro configuration

- **package.json**: Project dependencies and scripts
  - `dev`: Start development server
  - `build`: Build for production
  - `generate`: Generate static site
  - `seed`: Run database seeding

- **tsconfig.json**: TypeScript compiler options
- **tailwind.config.ts**: Tailwind CSS theme and plugins

### Database & Prisma

- **prisma/schema.prisma**: Database schema with 3 models:
  - Post: Blog posts with markdown content
  - Comment: Comments on posts
  - AdminUser: Admin accounts with hashed passwords

- **prisma/seed.ts**: Database seeding script
  - Creates 50 sample posts with markdown content
  - Creates 10 comments per post (500 total)
  - Creates 1 admin user (admin@devblog.com / admin123)
  - Deterministic data for reproducibility

### API Routes (Server)

All located in `server/api/` directory:

**Posts API:**
- `GET /api/posts`: List posts with pagination
- `POST /api/posts`: Create post (requires auth)
- `GET /api/posts/:slug`: Get single post
- `PUT /api/posts/:slug`: Update post (requires auth)
- `DELETE /api/posts/:slug`: Delete post (requires auth)
- `GET /api/posts/:slug/comments`: Get post comments

**Auth API:**
- `POST /api/auth/login`: Admin login with JWT token

### Components

**Layout Components:**
- `Header.vue`: Navigation with DevBlog branding
- `Footer.vue`: Copyright footer

**Post Components:**
- `PostCard.vue`: Individual post preview
- `PostList.vue`: Responsive grid of posts (1-3 columns)
- `PostContent.vue`: Rendered markdown content with styling

**Comment Components:**
- `CommentItem.vue`: Single comment display
- `CommentList.vue`: List of comments

**Admin Components:**
- `AdminPostForm.vue`: Form for creating/editing posts
- `Pagination.vue`: Navigation between pages

### Pages (Routes)

**Public Pages:**
- `/`: Home page with paginated post list
- `/posts/[slug]`: Individual post page with comments

**Admin Pages (Protected):**
- `/admin/login`: Login form
- `/admin/posts`: Post management list
- `/admin/posts/new`: Create new post
- `/admin/posts/[id]/edit`: Edit existing post

### Utilities

- **composables/useAuth.ts**: Auth state management
- **utils/markdown.ts**: Markdown parsing with 'marked'
- **server/utils/prisma.ts**: Prisma client singleton
- **server/utils/auth.ts**: JWT token generation and verification
- **middleware/admin-auth.ts**: Client-side route protection
- **server/middleware/auth.ts**: Server-side API authentication

### Type Definitions

All TypeScript interfaces in `types/index.ts`:
- Post, Comment, AdminUser
- API request/response types
- Auth types

## Rendering Strategies

- **Home (`/`)**: Prerendered at build time (SSG)
- **Posts (`/posts/[slug]`)**: Prerendered with ISR (60-second revalidation)
- **Admin routes**: Server-side rendered (SSR)
- **Comments**: Client-side fetched with useFetch

## Authentication Flow

1. User visits `/admin/login`
2. Submits email and password
3. Server validates against hashed password in database
4. JWT token generated and set in `auth-token` cookie
5. Client middleware redirects to `/admin/posts` on success
6. Protected API routes verify token via server middleware
7. All authenticated requests include token in cookie

## Database Schema

**Post Table:**
- id (int, primary key, auto-increment)
- title (varchar(100), required)
- slug (varchar, unique)
- content (text, markdown)
- excerpt (varchar(200))
- author (varchar)
- published_at (timestamp, default: now)
- updated_at (timestamp, auto-update)

**Comment Table:**
- id (int, primary key, auto-increment)
- post_id (int, foreign key)
- author_name (varchar)
- content (varchar(500))
- created_at (timestamp, default: now)

**AdminUser Table:**
- id (int, primary key, auto-increment)
- email (varchar, unique)
- password_hash (varchar, bcrypt)

## API Response Format

All API responses follow consistent JSON format:

**List Posts:**
```json
{
  "posts": [...],
  "total": 50
}
```

**Single Post:**
```json
{
  "post": {...}
}
```

**Comments:**
```json
{
  "comments": [...]
}
```

**Login:**
```json
{
  "token": "eyJhbGc..."
}
```

## Security Features

- JWT authentication with 24-hour expiration
- Bcrypt password hashing
- HTTP-only auth token cookies
- Server-side API middleware authentication
- Client-side route protection
- CSRF-safe API design

## Performance Optimizations

- Image optimization with @nuxt/image
- Google Fonts optimization
- Route-based code splitting
- Lazy component loading with defineAsyncComponent
- ISR for frequent content updates
- Static generation for homepage
- Efficient Prisma queries

## Development Features

- Full TypeScript support
- Vue 3 Composition API
- Hot module replacement (HMR)
- Tailwind CSS IntelliSense
- Prisma studio for database inspection
- Development tools enabled

