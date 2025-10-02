# Digital Sòl - Project Documentation

## Overview
Digital Sòl is a modern rotating savings group (sòl/tontin) management application built with React, TypeScript, and Vite. The application is designed in Haitian Creole to help communities manage their traditional rotating savings groups where members contribute money regularly and take turns receiving payouts.

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

### Initial Setup
- Configured project for Replit environment
- Updated Vite configuration to use port 5000 and bind to 0.0.0.0
- Configured HMR for Replit's proxy setup
- Set up workflow for development server
- Installed all npm dependencies

### Core Features Implementation
- Implemented localStorage-based data persistence system (src/lib/storage.ts)
- Added "winners per round" feature allowing multiple recipients per round
- Enhanced sol creation form with name field and recipients-per-round selector
- Updated Dashboard to display real sols from storage with statistics
- Rewrote SolDetail page to support multiple recipients per round with calendar grouping

### Payment Tracking & Events System
- Extended Sol schema to include payments[] and events[] arrays for transaction tracking
- Created Payment and SolEvent interfaces to track all financial transactions with dates
- Implemented payment recording system with partial payment support
- Added overpayment prevention to ensure users cannot pay more than they owe
- Created tabbed interface in SolDetail with three views:
  - **Peman (Payments)**: Shows payment status for all members (paid, partial, unpaid)
  - **Kalendriye (Calendar)**: Displays full payout schedule with dates
  - **Istwa (Events)**: Timeline of all payments and payouts with dates
- Enhanced payment dialog with real-time balance information and validation
- Added ability to record when members receive their payouts

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
This is a frontend-only application with client-side routing and localStorage persistence. No backend server or database is currently configured.

### Key Features
1. **Sol Management**: Create and manage rotating savings groups (sols)
2. **Flexible Recipients**: Configure how many members receive money per round (1 to N)
3. **Payment Tracking**: Track who paid, who hasn't, and partial payments
4. **Events Timeline**: Complete history of all payments and payouts with dates
5. **Smart Validation**: Prevents overpayments and ensures data integrity
6. **Haitian Creole Interface**: Full application in Haitian Creole for accessibility

### Data Structure
- **Sol**: Main entity representing a rotating savings group
  - Basic info: name, frequency, amount per member, member count, winners per round
  - Members: Array of participants with positions
  - Payments: Tracks all payment transactions with amounts and dates
  - Events: Complete timeline of payments and payouts
- **Payment**: Tracks individual payment transactions with partial payment support
- **SolEvent**: Records all financial events (payments, payouts) with dates
- **Storage**: localStorage-based persistence with JSON serialization
