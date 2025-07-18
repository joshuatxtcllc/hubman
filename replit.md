# React Dashboard Application

## Overview

This is a full-stack web application built with React, Express, and TypeScript. The project uses a modern monorepo structure with a React frontend and Express backend, featuring a dashboard interface with analytics and metrics visualization. The application is configured with Drizzle ORM for database management, shadcn/ui for the component library, and Tailwind CSS for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client and server code:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions
- **Development**: tsx for TypeScript execution

### Build System
- **Monorepo Structure**: Shared code between client and server
- **Development**: Vite dev server with Express API proxy
- **Production**: Static build with Express serving both API and static files
- **TypeScript**: Shared type definitions and schemas

## Key Components

### Frontend Components
- **Dashboard**: Main analytics dashboard with metrics cards and data visualization
- **UI Library**: Complete set of reusable components (buttons, cards, forms, etc.)
- **Theme System**: Dark/light mode support with CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Backend Components
- **API Routes**: RESTful API endpoints with Express
- **Database Layer**: Drizzle ORM with PostgreSQL schema definitions
- **Storage Interface**: Abstracted storage layer with memory and database implementations
- **Middleware**: Request logging, error handling, and development tooling

### Shared Components
- **Schema Definitions**: Zod-validated database schemas shared between client and server
- **Type Safety**: Full TypeScript coverage with inferred types from database schema

## Data Flow

1. **Client Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express routes handle HTTP requests and validate data
3. **Storage Layer**: Abstract storage interface allows switching between memory and database
4. **Database**: Drizzle ORM manages PostgreSQL interactions with type safety
5. **Response**: JSON responses with proper error handling and logging

### Authentication Flow
- Basic user authentication system with username/password
- Session-based authentication using PostgreSQL-backed sessions
- User schema includes id, username, and password fields

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Drizzle Kit**: Database migrations and schema management
- **Connection**: Uses DATABASE_URL environment variable

### UI/UX Libraries
- **Radix UI**: Primitive components for accessibility and behavior
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel component for content sliders
- **React Hook Form**: Form validation and management

### Development Tools
- **Vite**: Fast build tool with HMR and development server
- **Replit Integration**: Development environment optimizations
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Deployment Strategy

### Development
- Vite dev server for frontend with hot module replacement
- Express server with tsx for TypeScript execution
- Environment-based configuration for database connections

### Production Build
1. **Frontend**: Vite builds optimized static assets to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations ensure schema consistency
4. **Serving**: Single Express server serves both API and static files

### Environment Configuration
- Development and production environment detection
- Database URL configuration for different environments
- Replit-specific optimizations when deployed on Replit platform

### Key Files
- `package.json`: Scripts for dev, build, and production
- `drizzle.config.ts`: Database configuration and migration settings
- `vite.config.ts`: Frontend build and development configuration
- `tsconfig.json`: TypeScript configuration for monorepo structure