# Tagorit

Tagorit is a small sales-network CRM for website outreach teams.

## Current v2 architecture

- React + Vite frontend
- Vercel serverless API
- Neon/PostgreSQL
- Server-side session authentication with HttpOnly cookies
- Roles: `admin`, `team_lead`, `sales`
- Server-side lead visibility rules
- Team hierarchy and commissions
- Agreement onboarding
- Private messages
- Support tickets
- Client handoff queue
- Audit log schema

## Local / Vercel setup

1. Create a dedicated Neon database for Tagorit.
2. Run `db/schema.sql` on that database.
3. Add the pooled Neon connection string as:

```env
DATABASE_URL=postgresql://...
```

4. Install packages:

```bash
npm install
```

5. Create the first admin:

```bash
ADMIN_EMAIL=you@example.com \
ADMIN_PASSWORD='use-a-strong-password' \
ADMIN_NAME='Toms' \
DATABASE_URL='postgresql://...' \
npm run create-admin
```

6. Deploy to Vercel and add the same `DATABASE_URL` environment variable.

## Security model

A user session is stored as a random opaque token in a HttpOnly cookie. Only a SHA-256 hash of that token is stored in Postgres.

Lead access is enforced by the API:
- Admin sees all leads.
- Team Lead sees own leads and leads belonging to direct team members.
- Sales Partner sees only own leads.

The frontend must never be treated as the security boundary.

## Agreement

The current agreement template is in `src/agreement.js` and is versioned. Employees must accept the active version before using the CRM.

Before using the agreement as a real legal document, have the final wording reviewed by a Latvian lawyer.

## Google Workspace roadmap

Gmail integration is intentionally left for a later phase. The planned model is Google OAuth + Gmail API + Pub/Sub notifications so sent messages and replies can be attached to CRM leads automatically.
