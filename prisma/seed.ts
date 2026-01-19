import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.tableRow.deleteMany({});
  await prisma.tableColumn.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.dashboard.deleteMany({});
  await prisma.user.deleteMany({});

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      password: "hashed_password_here",
      role: "admin",
    },
  });

  console.log("Created user:", user);

  // Create a dashboard
  const dashboard = await prisma.dashboard.create({
    data: {
      title: "Sales Dashboard",
      description: "Track sales and revenue metrics",
      userId: user.id,
    },
  });

  console.log("Created dashboard:", dashboard);

  // Create a table
  const table = await prisma.table.create({
    data: {
      name: "Sales Data",
      description: "Monthly sales records",
      dashboardId: dashboard.id,
      userId: user.id,
    },
  });

  console.log("Created table:", table);

  // Create table columns
  const columns = await Promise.all([
    prisma.tableColumn.create({
      data: {
        name: "Date",
        type: "date",
        order: 1,
        tableId: table.id,
      },
    }),
    prisma.tableColumn.create({
      data: {
        name: "Revenue",
        type: "number",
        order: 2,
        tableId: table.id,
      },
    }),
    prisma.tableColumn.create({
      data: {
        name: "Units Sold",
        type: "number",
        order: 3,
        tableId: table.id,
      },
    }),
  ]);

  console.log("Created columns:", columns);

  // Create sample rows
  const rows = await Promise.all([
    prisma.tableRow.create({
      data: {
        tableId: table.id,
        userId: user.id,
        data: {
          Date: "2026-01-01",
          Revenue: 5000,
          "Units Sold": 250,
        },
      },
    }),
    prisma.tableRow.create({
      data: {
        tableId: table.id,
        userId: user.id,
        data: {
          Date: "2026-01-02",
          Revenue: 6200,
          "Units Sold": 310,
        },
      },
    }),
  ]);

  console.log("Created rows:", rows);

  console.log("✅ Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
