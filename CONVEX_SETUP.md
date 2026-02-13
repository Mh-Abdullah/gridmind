# Convex Real-time Database Setup

This guide explains how to set up Convex for real-time spreadsheet syncing in GridMind.

## What is Convex?

Convex is a real-time backend platform that automatically syncs data between your app and the database. This means:

- **Data persists immediately** - Changes are saved as you type
- **No data loss** - Even if the browser closes unexpectedly, your work is saved
- **Real-time collaboration** - Multiple users can see changes instantly (future feature)

## Quick Setup

### 1. Initialize Convex

Run the following command in your project directory:

```bash
npx convex dev
```

This command will:
- Prompt you to log in or create a Convex account (free)
- Create a new Convex project or link to an existing one
- Deploy your schema and functions
- Start the development server

### 2. Configure Environment Variables

After running `npx convex dev`, you'll see a deployment URL like:

```
https://your-project-123.convex.cloud
```

Add this URL to your `.env.local` file:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-project-123.convex.cloud
```

### 3. Start Your App

Run your Next.js development server:

```bash
npm run dev
```

The spreadsheet will now automatically save all changes to Convex in real-time!

## How It Works

### Data Flow

1. **User edits a cell** → Local state updates immediately for smooth UX
2. **Debounced sync** → Changes are batched and sent to Convex after 300ms of inactivity
3. **Convex persists** → Data is stored in the cloud database
4. **Real-time subscription** → Other browser tabs/clients receive updates automatically

### What Gets Saved

- **Cells**: All cell values (key format: "row-col", e.g., "0-0" for A1)
- **Cell Formatting**: Bold, italic, colors, alignment, font size
- **Column Widths**: Custom column sizes
- **Row Heights**: Custom row heights
- **Metadata**: Project name, number of rows/columns

### Sync Status Indicator

The top header shows the current sync status:

- 🔄 **Saving...** - Changes are being synced to the cloud
- ☁️ **Saved** - All changes are persisted
- ⏳ **Loading...** - Initial data is being fetched
- ⚠️ **Offline** - No connection to Convex (data saved locally)

## Schema Structure

The Convex schema (`convex/schema.ts`) defines:

```typescript
users            // User accounts
  ├─ email       // Unique email
  ├─ name        // Display name
  ├─ password    // Hashed password
  ├─ role        // "user" or "admin"
  ├─ createdAt   // Timestamp
  └─ updatedAt   // Timestamp

spreadsheets     // Main spreadsheet metadata
  ├─ tableId     // Unique table identifier
  ├─ userId      // Owner
  ├─ name        // Project name
  ├─ numRows     // Grid dimensions
  └─ numCols

cells            // Cell values
  ├─ spreadsheetId
  ├─ cellKey     // "row-col" format
  └─ value

cellFormatting   // Cell styles
  ├─ spreadsheetId
  ├─ cellKey
  ├─ bold, italic, underline
  ├─ alignment
  ├─ textColor, backgroundColor
  └─ fontSize

columnWidths     // Column sizing
  ├─ spreadsheetId
  ├─ colIndex
  └─ width

rowHeights       // Row sizing
  ├─ spreadsheetId
  ├─ rowIndex
  └─ height
```

## Development Commands

```bash
# Start Convex dev server (run in a separate terminal)
npx convex dev

# Deploy to production
npx convex deploy

# View Convex dashboard
npx convex dashboard

# Generate types after schema changes
npx convex codegen
```

## Troubleshooting

### "NEXT_PUBLIC_CONVEX_URL is not set" warning

Make sure your `.env.local` file contains the Convex URL:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

Then restart your Next.js dev server.

### Data not syncing

1. Check the browser console for errors
2. Ensure `npx convex dev` is running in a separate terminal
3. Verify the Convex URL is correct
4. Check the Convex dashboard for any function errors

### Offline mode

If you see "Offline" status, the app will still work locally but changes won't be persisted to the cloud. This can happen if:

- `NEXT_PUBLIC_CONVEX_URL` is not set
- Convex dev server is not running
- Network connectivity issues

## Production Deployment

1. Deploy Convex to production:
   ```bash
   npx convex deploy
   ```

2. Set the production URL in your hosting platform (Vercel, etc.):
   - `NEXT_PUBLIC_CONVEX_URL` = your production Convex URL

3. Deploy your Next.js app

## Additional Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Convex with Next.js](https://docs.convex.dev/quickstart/nextjs)
- [Convex Dashboard](https://dashboard.convex.dev/)
