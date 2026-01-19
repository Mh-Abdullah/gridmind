# Prisma Setup Guide

## Overview
Your GridMind project now has Prisma ORM integrated with the following data models:

### Database Models

#### 1. **User**
- Unique users with email authentication
- Fields: id, email, name, password, avatar, role, timestamps
- Relations: dashboards, tables, table rows

#### 2. **Dashboard**
- Container for organizing tables
- Fields: id, title, description, userId, timestamps
- Relations: tables, owner user

#### 3. **Table**
- Represents a data table within a dashboard
- Fields: id, name, description, dashboardId, userId, timestamps
- Relations: columns, rows, parent dashboard, owner user

#### 4. **TableColumn**
- Defines columns in a table
- Fields: id, name, type, order, tableId, timestamps
- Relations: parent table

#### 5. **TableRow**
- Represents individual rows in a table
- Fields: id, tableId, userId, data (JSON), timestamps
- Relations: parent table, creator user

## Setup Files Created

```
prisma/
├── schema.prisma          # Data model definitions
├── dev.db                 # SQLite database (local development)
├── migrations/            # Migration history
│   └── 20260116160603_init/
│       └── migration.sql
└── seed.ts               # Sample data seeding script

lib/
├── prisma.ts             # Prisma client singleton
└── generated/prisma/     # Generated Prisma types

.env                       # Database URL configuration
prisma.config.ts          # Prisma configuration
```

## Available Commands

```bash
# Run migrations
npm run db:migrate

# Sync schema to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (visual database explorer)
npm run db:studio

# Generate Prisma client
npx prisma generate
```

## Using Prisma in Your Code

### Import the Prisma client:
```typescript
import { prisma } from "@/lib/prisma";
```

### Example: Query users
```typescript
const users = await prisma.user.findMany();
const user = await prisma.user.findUnique({
  where: { email: "test@example.com" },
  include: { dashboards: true, tables: true }
});
```

### Example: Create a dashboard
```typescript
const dashboard = await prisma.dashboard.create({
  data: {
    title: "My Dashboard",
    description: "Dashboard description",
    userId: "user-id-here"
  }
});
```

### Example: Query tables with columns
```typescript
const table = await prisma.table.findUnique({
  where: { id: "table-id" },
  include: {
    columns: { orderBy: { order: 'asc' } },
    rows: true,
    dashboard: true
  }
});
```

## Database Configuration

Currently using **SQLite** for local development (`file:./prisma/dev.db`).

### To switch to PostgreSQL:

1. Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/gridmind"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
}
```

3. Run migration:
```bash
npm run db:migrate
```

## Important Notes

- ✅ SQLite database created and ready for development
- ✅ Initial schema migration applied (`20260116160603_init`)
- ✅ Prisma client generated in `lib/generated/prisma`
- ✅ Seed script available for sample data
- ✅ All relationships use CASCADE delete for data integrity

## Next Steps

1. Run seed command to populate sample data:
   ```bash
   npm run db:seed
   ```

2. Create API routes or server actions to interact with the database

3. Build frontend components to display/manage data

4. For production deployment, update to PostgreSQL or other managed database service
