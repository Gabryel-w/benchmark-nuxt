# DevBlog - Nuxt 3

A high-performance blog application built with Nuxt 3, designed as part of a TCC thesis comparing Next.js and Nuxt performance.

## Features

- Server-Side Rendering (SSR) for admin pages
- Static Site Generation (SSG) for homepage
- Incremental Static Regeneration (ISR) for blog posts
- JWT-based authentication
- Prisma ORM with PostgreSQL
- TypeScript support
- Tailwind CSS styling
- Markdown content support
- Comment system
- Admin panel for post management

## Tech Stack

- **Framework**: Nuxt 3
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd benchmark-nuxt
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials and JWT secret:

```
DATABASE_URL="postgresql://user:password@localhost:5432/benchmark_blog"
JWT_SECRET="your-secret-key-here"
```

4. Run database migrations and seed:

```bash
npx prisma migrate dev
npm run seed
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Admin Login

Default credentials:
- Email: `admin@devblog.com`
- Password: `admin123`

## Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
benchmark-nuxt/
├── pages/              # Route pages and layouts
├── components/         # Reusable Vue components
├── composables/        # Composition API utilities
├── server/             # Server-side API routes
├── prisma/             # Database schema and migrations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── assets/             # Static assets and CSS
└── middleware/         # Route middleware
```

## API Endpoints

### Public Routes

- `GET /api/posts` - List published posts (with pagination)
- `GET /api/posts/:slug` - Get single post by slug
- `GET /api/posts/:slug/comments` - Get comments for a post

### Admin Routes (Requires Authentication)

- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update existing post
- `DELETE /api/posts/:id` - Delete post

### Authentication

- `POST /api/auth/login` - Admin login

## Database Schema

### Post
- `id`: Unique identifier
- `title`: Post title (max 100 chars)
- `slug`: URL-friendly identifier (unique)
- `content`: Markdown content
- `excerpt`: Brief description (max 200 chars)
- `author`: Post author name
- `published_at`: Publication date
- `updated_at`: Last update date

### Comment
- `id`: Unique identifier
- `post_id`: Associated post
- `author_name`: Comment author
- `content`: Comment text (max 500 chars)
- `created_at`: Creation date

### AdminUser
- `id`: Unique identifier
- `email`: Admin email (unique)
- `password_hash`: Hashed password

## Rendering Strategies

- **Home (`/`)**: Prerendered at build time (SSG)
- **Posts (`/posts/[slug]`)**: Prerendered with ISR (60 second revalidation)
- **Admin routes**: Server-side rendered (SSR)
- **Comments**: Client-side fetched with `useFetch`

## Performance Features

- Image optimization with `@nuxt/image`
- Font optimization with Google Fonts
- Route-based code splitting
- Lazy component loading
- ISR for blog posts (60 second intervals)

## Authentication Flow

1. User logs in with email and password
2. Server validates credentials against hashed password
3. JWT token is generated and set in `auth-token` cookie
4. Token is verified for protected API routes
5. Client-side middleware protects admin routes

## License

MIT
