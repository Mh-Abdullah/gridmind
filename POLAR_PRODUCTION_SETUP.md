# Polar production setup

The application selects Polar's live API when `POLAR_MODE=production`.

## Switching sandbox and production

All Polar API paths (product sync, checkout confirmation, customer portal, and
checkout creation) use `POLAR_MODE`. Change only these values, then restart the
local server or redeploy so Next.js reloads them:

```env
# Sandbox
POLAR_MODE=sandbox
POLAR_ACCESS_TOKEN=polar_sandbox_access_token
POLAR_WEBHOOK_SECRET=polar_sandbox_webhook_secret

# Production
POLAR_MODE=production
POLAR_ACCESS_TOKEN=polar_production_access_token
POLAR_WEBHOOK_SECRET=polar_production_webhook_secret
```

GridMind stores a separate product ID for each Polar environment. Sync each
package once in sandbox and once in production. After that one-time setup,
switching between them never requires editing code or clearing product IDs.

## Required production environment variables

Set these in the hosting provider for the production deployment:

```env
POLAR_MODE=production
POLAR_ACCESS_TOKEN=polar_production_access_token
POLAR_WEBHOOK_SECRET=polar_production_webhook_secret
NEXT_PUBLIC_APP_URL=https://gridsmind.vercel.app
POLAR_RETURN_URL=https://gridsmind.vercel.app/billing
```

Do not reuse sandbox tokens, webhook secrets, or product IDs.

## Polar dashboard setup

1. Create a production access token for the live Polar organization.
2. Create a production webhook whose URL is:
   `https://gridsmind.vercel.app/api/webhooks/polar`
3. Subscribe the webhook to the `order.paid` event.
4. Copy the webhook signing secret into `POLAR_WEBHOOK_SECRET`.
5. Redeploy the application after setting the production variables.

## One-time production product sync

For every package that has not yet been synced to production:

1. Edit the package.
2. Keep **Auto-sync to Polar after save** enabled.
3. Save it, then confirm a production product ID is displayed.

Review each newly created product's name, USD price, visibility, and description
in the production Polar dashboard before accepting payments.

## Verification

Make one low-value real purchase with a normal user account. Confirm that:

- checkout opens on Polar's production domain;
- payment succeeds and returns to `/billing`;
- the `order.paid` webhook returns a successful response;
- credits are granted exactly once;
- the customer portal opens and returns to the application.
