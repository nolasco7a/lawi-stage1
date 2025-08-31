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
- `lib/stripe/webhook-handlers.ts` - Stripe webhook event processing
- `lib/db/subscription-helpers.ts` - Subscription management utilities

## Subscription Management & Webhooks

The application implements a comprehensive subscription system using Stripe. The `is_active` field is critical for managing user access and ensuring only one active subscription per user.

### Webhook Flow & is_active Field Management

**Webhook Processing Order:**
1. `customer.subscription.created` - Creates subscription record, `is_active` set based on initial status
2. `customer.subscription.updated` - Updates status and activates subscription when status becomes 'active'
3. `payment_intent.succeeded` - Logs successful payments 
4. `invoice.payment_succeeded` - Records invoice payment details

**is_active Field Logic:**
- **Creation:** `is_active = true` only if subscription status is 'active' initially
- **Update:** When status changes to 'active', `setActiveSubscription()` is called to:
  - Deactivate all existing subscriptions for the user
  - Set the new subscription as active (`is_active = true`)
- **Deletion:** `is_active = false` when subscription is canceled

### Key Functions (`lib/db/subscription-helpers.ts`):

```typescript
// Primary function to manage active subscriptions
setActiveSubscription(userId, subscriptionId) // Deactivates old, activates new

// Utility functions for subscription management
getActiveSubscription(userId) // Gets current active subscription
validateAndFixActiveSubscriptions(userId) // Repairs inconsistent states
deactivateInvalidSubscriptions(userId) // Cleans up invalid active subscriptions
getUserSubscriptionHistory(userId) // Audit trail of all subscriptions
```

### Webhook Handlers (`lib/stripe/webhook-handlers.ts`):

- **handleSubscriptionCreated:** Initial subscription creation with proper is_active logic
- **handleSubscriptionUpdated:** Status updates with activation when status becomes 'active'
- **handleSubscriptionDeleted:** Deactivation on cancellation
- **handleInvoicePaymentSucceeded/Failed:** Invoice tracking for billing history

### Common Issues & Solutions:

1. **is_active stays false:** Usually happens when subscription starts as 'incomplete' and becomes 'active' via update webhook
2. **Multiple active subscriptions:** Resolved by `validateAndFixActiveSubscriptions()` function
3. **Race conditions:** Handled with 500ms delay in update handler and transaction management

### Database Schema:

```sql
-- Subscription table with is_active field for access control
CREATE TABLE "Subscription" (
  is_active BOOLEAN NOT NULL DEFAULT false, -- Only one per user should be true
  status VARCHAR CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing', 'paused')),
  -- Partial unique index ensures only one active subscription per user
);
```

### Troubleshooting Commands:

```bash
# Check subscription status for a user
psql -c "SELECT * FROM \"Subscription\" WHERE user_id = 'USER_ID' ORDER BY created_at DESC;"

# Fix inconsistent subscription states
# Call validateAndFixActiveSubscriptions(userId) from the application
```