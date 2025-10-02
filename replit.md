# Digital Sòl - Project Documentation

## Overview
Digital Sòl is a modern financial management application built with React, TypeScript, and Vite. The application appears to be designed for managing digital finances with a focus on Haitian Creole language support.

## Tech Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **Routing**: React Router DOM 6.30.1
- **State Management**: TanStack Query (React Query) 5.83.0
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Project Structure
- `src/pages/` - Application pages
  - `Index.tsx` - Home page
  - `CreateSol.tsx` - Create new sol page
  - `Dashboard.tsx` - Dashboard view
  - `SolDetail.tsx` - Individual sol detail page
  - `NotFound.tsx` - 404 page
- `src/components/ui/` - Shadcn UI components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions

## Recent Changes (October 2, 2025)
- Configured project for Replit environment
- Updated Vite configuration to use port 5000 and bind to 0.0.0.0
- Configured HMR for Replit's proxy setup
- Set up workflow for development server
- Installed all npm dependencies

## Development
- **Start Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`

## Deployment
- Configured for Replit Autoscale deployment
- Build command: `npm run build`
- Start command: `npm run start` (uses preview mode)

## User Preferences
None specified yet.

## Project Architecture
This is a frontend-only application with client-side routing. No backend server or database is currently configured. The application uses in-memory state management with React Query for data fetching and caching.
