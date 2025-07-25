# React Dashboard Application

## Overview

This is a full-stack web application built with React, Express, and TypeScript. The project uses a modern monorepo structure with a React frontend and Express backend, featuring a comprehensive business intelligence dashboard with integrated workflow automation for Jay's Frames custom framing business. The application includes analytics, metrics visualization, and streamlined order processing workflows that connect directly to existing business tools including POS system, Kanban board, Google Drive storage, and email automation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Workflow Intelligence Integration
- Added comprehensive workflow automation system for order processing
- Integrated 7-step guided workflow: POS calculation → Invoice generation → Payment processing → Email automation → Google Drive storage → Kanban production tracking → Customer communication
- Connected real business app URLs including new POS system (https://framecraftpro.com/orders), Kanban board (https://framecraftpro.com/kanban), AI Assistant (https://framecraftpro.com/ai-assistant), main website (https://frame-houston-JayFrames.replit.app), and Google Drive folder
- Added Mac-specific optimization tips for file handling and drag-and-drop operations
- Implemented automated email generation with professional messaging and order details
- Reduced total order processing time from 27 minutes to 10 minutes through streamlined workflow
- Added workflow templates for standard orders, rush orders, and quote-only processes

### Communication System Integration
- Integrated Twilio Voice SDK for real phone calling functionality
- Added Communication Center with professional calling interface and live call controls
- Implemented real-time call history from Twilio API with duration tracking
- Created quick-dial contacts for customers and suppliers with order context
- Added active call management with mute/unmute controls and device status indicators
- Connected with existing Twilio API keys for production-ready calling capabilities

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
- **Workflow Intelligence**: Guided order processing system with 7-step automation workflow
- **Business Applications Grid**: Real-time status monitoring of connected business tools
- **UI Library**: Complete set of reusable components (buttons, cards, forms, etc.)
- **Theme System**: Glass morphism design with gradient backgrounds and backdrop blur effects
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Backend Components
- **API Routes**: RESTful API endpoints with Express for dashboard data, applications, metrics, activities, customers, and orders
- **Database Layer**: Drizzle ORM with PostgreSQL schema definitions including comprehensive business entities
- **Storage Interface**: DatabaseStorage implementation with full CRUD operations for all business entities
- **Middleware**: Request logging, error handling, and development tooling
- **Database Schema**: Complete business schema with users, customers, orders, applications, business metrics, and activities

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
- **PostgreSQL**: Production-grade relational database with comprehensive business schema
- **Neon Database**: Serverless PostgreSQL provider for scalable hosting
- **Drizzle ORM**: Type-safe database interactions with automatic migrations
- **Database Schema**: Complete business entities including users, customers, orders, applications, business metrics, and activities with proper relationships
- **Connection**: Uses DATABASE_URL environment variable with connection pooling

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