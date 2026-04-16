# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HackPortal is a comprehensive hackathon management platform built with Next.js and Prisma. It handles:
- Hacker applications and team management
- Form builder with dynamic application forms (multi-step)
- Sponsor portal with application viewing and filtering
- Check-in system with QR codes
- Judging and voting systems
- Travel reimbursements
- Dashboard for organizers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Prisma ORM (supports SQLite, PostgreSQL, MySQL, etc.)
- **Authentication**: NextAuth.js with OAuth (GitHub, Google)
- **UI Components**: Radix UI + custom components with Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack React Table
- **Testing**: Jest (unit), Playwright (E2E)
- **Monitoring**: Sentry, Datadog
- **File Storage**: Cloudflare R2
- **Email**: Brevo API
- **QR Codes**: qrcode.react

## Development Commands

### Setup & Installation
```bash
npm install
cp .env.template .env  # Configure with your environment variables
npm run prisma:migrate-dev  # Run database migrations
npm run prisma:seed  # Seed initial data (enums, defaults)
```

### Development
```bash
npm run dev  # Start dev server (http://localhost:3000), hot-reload enabled
npm run dev:turbopack  # Faster dev server with Turbopack
npm run types  # Check TypeScript types without emitting
npm run lint  # Run ESLint
```

### Database
```bash
npm run prisma:generate  # Generate Prisma client after schema changes
npm run prisma:migrate-dev  # Create migration and apply it in dev
npm run prisma:migrate-prod  # Apply migrations in production
npm run prisma:seed  # Seed database with initial values
```

### Testing
```bash
npm run test:jest  # Run Jest unit tests
npm run test:jest:coverage  # Run tests with coverage report
npm run test:e2e  # Run Playwright E2E tests
npm run test:local-e2e-docker  # Run E2E tests locally with Docker
```

### Build & Production
```bash
npm run build  # Build for production
npm run start  # Start production server
export PORT=3003 && npm run start  # Run on custom port
```

### Other
```bash
npm run storybook  # Start Storybook component library (port 6006)
npm run build-storybook  # Build Storybook
```

## Project Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── api/               # API routes and NextAuth
│   ├── dashboard/         # Organizer dashboard (protected routes)
│   ├── sponsors/          # Sponsor portal (protected routes)
│   ├── application/       # Hacker application form (multi-step)
│   ├── signin/signup/     # Authentication pages
│   └── [page].tsx         # Static pages
├── scenes/                # Feature-specific React components (organized by feature)
│   ├── Dashboard/         # Dashboard pages and sub-features
│   ├── Application/       # Application form components
│   ├── Sponsors/          # Sponsor portal components
│   └── ...
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/Radix UI primitives
│   ├── common/           # Shared components (Navbar, dialogs, etc.)
│   └── stories/          # Storybook stories
├── server/               # Server-side functions
│   ├── actions/          # Server Actions (used by client components)
│   ├── getters/          # Data fetching functions (read-only)
│   ├── schemas/          # Zod schemas for validation
│   └── services/         # Business logic and helpers
├── services/             # Shared utilities and helpers
├── styles/               # Global CSS and Tailwind config
└── prisma/               # Database schema and migrations
```

### Key Patterns

**Server Actions**: Located in `src/server/actions/`, these are async functions marked with `"use server"` that handle mutations (create, update, delete). Called from client components via function import.

**Data Getters**: Located in `src/server/getters/`, these fetch read-only data. Organized by feature (e.g., `sponsors/getApplicationsForSponsors.ts`, `dashboard/tables/getChallengeList.ts`).

**Types**: TypeScript types are defined in server getter files (e.g., `ApplicationPropertySponsorList`), imported where needed, and re-exported for client use.

**Form Handling**: Most forms use `react-hook-form` with `Zod` validation. Form fields are rendered dynamically based on Prisma models.

**Protected Routes**: Middleware and helper functions in `src/server/services/helpers/auth/` handle role-based access (organizer, sponsor, hacker).

## Database Schema (Key Models)

- **User**: Authentication + profile info
- **Hackathon**: The event (one per instance)
- **Hacker**: User participating in hackathon, may own/join a team
- **Team**: Group of hackers working together
- **Application**: Hacker's application with form responses
- **ApplicationFormStep**: Multi-step application form definition
- **FormField**: Individual form fields (shown in sponsors view if `shownInSponsorsViewTable: true`)
- **FormValue**: Hacker's answers to form fields
- **Sponsor**: Sponsor user with associated hackathon
- **Organizer**: Organizer user
- **Challenge**: Sponsor challenge for teams to tackle
- **Table**: Physical tables at event for team check-in
- **JudgingSlot**: Judging schedule slots
- **TeamJudging**: Team's judging results

See `prisma/schema.prisma` for full schema.

## Common Development Workflows

### Adding a New Hackathon Feature

1. **Update Prisma schema** (`prisma/schema.prisma`) if new data models needed
2. **Run migration** (`npm run prisma:migrate-dev`)
3. **Create getter** in `src/server/getters/` for data fetching
4. **Create action(s)** in `src/server/actions/` for mutations
5. **Create page** in `src/app/` following App Router conventions
6. **Create scene component(s)** in `src/scenes/` for feature logic
7. **Add tests** for new functionality

### Modifying Application Forms

- Form structure is defined in database (`ApplicationFormStep`, `FormField`)
- Form responses stored in `FormValue` with reference to `FormField`
- Dynamic form rendering happens in `FormRenderer` component
- Sponsors see only fields with `shownInSponsorsViewTable: true`

### Adding a New Sponsor Portal Feature

Sponsors view applications filtered by status (confirmed/attended):
- Get applications via `getApplicationsForSponsors()` in `src/server/getters/sponsors/`
- Display in table via `SponsorsApplicationsTable` component
- Add filtering/searching logic in the table component or getter

### Working with Authentication

- NextAuth configured at `src/app/api/auth/[...nextauth]/route.ts`
- Session checking via `useSession()` hook (client) or `auth()` (server)
- Role validation via helpers: `requireOrganizerSession()`, `requireSponsorSession()`

## Testing Approach

- **Jest**: Unit and component tests in `__tests__/` directories
- **Playwright**: E2E tests in `e2e/` folder, fixtures for reusable page objects
- **Fixtures**: Located in `e2e/fixtures/` for page interactions (e.g., `DashboardPage.ts`)

Run E2E locally: `npm run test:local-e2e-docker` (requires Docker)

## Environment Setup

Key `.env` variables needed:
- `DATABASE_URL` - SQLite file path or connection string
- `NEXTAUTH_URL` & `NEXTAUTH_SECRET` - Auth configuration
- `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET` - OAuth
- `CLOUDFLARE_R2_*` - File storage (optional for development)
- `BREVO_API_KEY` - Email sending (can disable with `EMAILS_ENABLED=false`)

For local development, use the example `.env` from README with OAuth IDs/secrets.

## Common Issues & Debugging

**Fields not displaying in sponsor table**: Check that `shownInSponsorsViewTable: true` is set on the `FormField` in database. Fields are dynamically rendered from `ApplicationPropertySponsorList` type.

**Type errors with form values**: Form values are flexible (`string | null | number | ApplicationStatus`). For complex types (arrays, objects), stringify in database and parse on client.

**Migrations failing**: Ensure database file exists and is writable. For SQLite: `DATABASE_URL="file:./portal.db"`. Run `npm run prisma:generate` if client is out of sync.

**NextAuth session issues**: Verify `NEXTAUTH_SECRET` is set and consistent. Check user exists in database with correct role (User → Organizer/Sponsor/Hacker).

## Performance Considerations

- Tables use TanStack React Table with pagination (default 20 rows per page)
- Column visibility saved to localStorage per hackathon
- Use server actions for mutations to avoid exposing business logic
- Prisma queries should explicitly select needed fields (avoid N+1)
- File uploads stored in Cloudflare R2, accessed via signed URLs

## Useful Patterns

**Creating a protected API route**:
```ts
// src/server/actions/example.ts
"use server"
import { requireOrganizerSession } from "@/server/services/helpers/auth/requireOrganizerSession"

export async function exampleAction(data: ExampleInput) {
  const session = await requireOrganizerSession()
  // Your logic here
}
```

**Fetching data in a server component**:
```ts
// In src/app pages
import getExampleData from "@/server/getters/example"

export default async function Page({ params }: Props) {
  const data = await getExampleData(params.id)
  return <YourComponent data={data} />
}
```

**Client component with form**:
```tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export default function Form() {
  const form = useForm({ resolver: zodResolver(schema) })
  return <form onSubmit={form.handleSubmit(serverAction)} />
}
```
