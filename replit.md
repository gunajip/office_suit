# Employee Management System

## Overview

This is a comprehensive full-stack employee management system built with React, TypeScript, Express.js, and in-memory storage. The application provides complete role-based access control for HR, IT, and employee users to manage all aspects of workplace operations including tickets, projects, tasks, leaves, attendance, payroll, announcements, and AI-powered assistance.

## Recent Changes (January 11, 2025)

✓ Implemented all 11 required sidebar functionalities with full CRUD operations
✓ Added AI Chatbot with role-specific intelligent responses  
✓ Built complete leave management system with approval workflow
✓ Integrated attendance tracking with clock in/out functionality
✓ Added payroll management for HR users
✓ Implemented announcements system with priority levels
✓ Enhanced all existing systems (tickets, projects, tasks) with full functionality
✓ Fixed authentication credentials synchronization between frontend and backend
✓ All pages now connect to real APIs instead of using mock data

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with role-based access control
- **Validation**: Zod schemas shared between client and server

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type-safe shared models
- **Tables**: users, tickets, projects, tasks with proper relations
- **Migrations**: Generated in `./migrations` directory

## Key Components

### Authentication System
- Role-based authentication (HR, IT, Employee)
- Session-based authentication with in-memory storage
- Protected routes based on user roles
- Test credentials: hr@company.com/password, it@company.com/password, employee@company.com/password

### Data Models
- **Users**: Email/password auth with role assignments and detailed employee profiles
- **Tickets**: Support ticket system with status tracking and priority levels
- **Projects**: Project management with manager assignments and team collaboration
- **Tasks**: JIRA-like task tracking linked to projects with due dates and status updates
- **Leaves**: Complete leave management with approval workflow and balance tracking
- **Attendance**: Clock in/out system with work hours tracking and location support
- **Announcements**: Company-wide announcements with targeting and priority levels
- **Payroll**: Salary management with allowances, deductions, and pay history
- **AI Chat**: Intelligent chatbot with role-specific responses and workplace assistance

### Role-Based Access Control
- **HR**: Complete access to all features including employee management, leave approvals, payroll processing, announcements creation, performance tracking, and all tickets/projects/tasks
- **IT**: Focus on all ticket management, technical projects, task assignments, and system announcements
- **Employee**: Access to personal dashboard, own tickets creation, assigned tasks, leave requests, attendance tracking, payroll viewing, and company announcements

### UI Components
- Consistent design system using shadcn/ui
- Responsive layout with sidebar navigation
- Form handling with validation
- Modal dialogs for creating/editing entities
- Data tables with sorting and filtering

## Data Flow

1. **Authentication Flow**: Login → Session validation → Role-based routing
2. **API Requests**: React Query → Express routes → Drizzle ORM → PostgreSQL
3. **Real-time Updates**: Optimistic updates with query invalidation
4. **Form Submissions**: React Hook Form → Zod validation → API calls → UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for Neon database
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives for shadcn/ui
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production
- **vite**: Development server and build tool
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds to `dist/public`
- **Backend**: esbuild bundles server to `dist/index.js`
- **Database**: Drizzle migrations via `npm run db:push`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

### Scripts
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build
- `npm run start`: Production server
- `npm run db:push`: Push schema changes to database

### Production Considerations
- Express serves static files from `dist/public`
- Session storage in PostgreSQL for scalability
- Error handling with proper HTTP status codes
- Request logging for API endpoints