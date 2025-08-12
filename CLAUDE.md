# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev` (uses Next.js with Turbo)
- **Build application**: `pnpm build` (runs database migrations first)
- **Lint code**: `pnpm lint` (ESLint + Biome with auto-fix)
- **Format code**: `pnpm format` (Biome formatter)
- **Database operations**:
  - Generate migrations: `pnpm db:generate`
  - Run migrations: `pnpm db:migrate`
  - Database studio: `pnpm db:studio`
  - Push schema: `pnpm db:push`
- **Run tests**: `pnpm test` (Playwright tests)

## Architecture Overview

This is an AI chatbot application built with Next.js 15, using the AI SDK and multiple model providers. The architecture follows a modern full-stack pattern:

### Core Technologies
- **Frontend**: Next.js 15 with App Router, React 19 RC, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with credentials and guest user support
- **AI Integration**: AI SDK with support for multiple providers (xAI, OpenAI, etc.)
- **Code Quality**: Biome for linting/formatting, ESLint for additional rules

### Application Structure

**Route Groups**:
- `app/(auth)/` - Authentication pages (login, register) with separate layout
- `app/(chat)/` - Main chat interface and API routes  
- `app/(user)/` - User-specific pages (lawyer, user profiles)

**Key Directories**:
- `lib/ai/` - AI model configurations, prompts, and tools
- `lib/db/` - Database schema, migrations, and queries using Drizzle
- `components/` - Reusable UI components following shadcn/ui patterns
- `components/ui/` - Base UI primitives from shadcn/ui

### Database Schema
The application uses a versioned message system with deprecated schemas for backward compatibility:
- `Message_v2` table with parts and attachments (current)
- `Message` table (deprecated, migration guide available)
- Support for chat history, user management, documents, and voting

### Authentication System
- Dual authentication: regular users with email/password and guest users
- Guest user creation for anonymous access
- Session management with JWT tokens including user type

### AI Features
- Multi-provider AI support (configurable in `lib/ai/models.ts`)
- Tool calling capabilities for document management and weather
- Streaming chat responses
- Document creation and editing with suggestions system

## Development Notes

- Uses `pnpm` as package manager
- Database migrations run automatically during build process
- Biome handles both linting and formatting (replaces Prettier)
- Playwright for end-to-end testing
- Environment variables required (see `.env.example`)
- TypeScript strict mode enabled

## Component Patterns

- UI components follow shadcn/ui conventions with Radix UI primitives
- Form handling with react-hook-form and Zod validation
- State management with Zustand for user store
- Theme switching with next-themes
- Toast notifications with Sonner

## Key Files to Understand

- `lib/db/schema.ts` - Database schema definitions
- `app/(auth)/auth.ts` - Authentication configuration
- `lib/ai/models.ts` - AI model definitions
- `components/ui/` - Base component library