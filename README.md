# Stay Property and Document Portal

A React/TypeScript interface for account administration, rentals, leases, regulation documents, uploads, and document-analysis conversations.

## Main workspaces

- Role-protected user and admin dashboards.
- Rental, lease, and regulation tables with search and detail modals.
- Document upload and lease revision flows.
- Polling-backed chat/history views for document analysis.

The matching API is maintained in [`stay-accounts-backend`](https://github.com/alirazawatoo/stay-accounts-backend).

## Local setup

```bash
npm install
npm run dev
```

Configure the backend URL and authentication contract expected by the API client before signing in.

## Verification boundary

Vitest coverage includes routing and private-route behavior, not complete rental/document workflows. Upload privacy, polling cancellation, session expiry, error recovery, role enforcement, and responsive behavior require integration verification.
