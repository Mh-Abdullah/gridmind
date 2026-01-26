import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.tableRow.deleteMany({});
  await prisma.tableColumn.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.dashboard.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: "mh.abdulla.688@gmail.com",
      name: "Muhammad Abdullah",
      password: hashPassword("1234"),
      role: "admin",
    },
  });

  console.log("Created admin user:", {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
  });

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      password: hashPassword("test1234"),
      role: "user",
    },
  });

  console.log("Created test user:", {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Create a dashboard for admin
  const dashboard = await prisma.dashboard.create({
    data: {
      title: "Sales Dashboard",
      description: "Track sales and revenue metrics",
      userId: adminUser.id,
    },
  });

  console.log("Created dashboard:", dashboard);

  // Create a table
  const table = await prisma.table.create({
    data: {
      name: "Sales Data",
      description: "Monthly sales records",
      dashboardId: dashboard.id,
      userId: adminUser.id,
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
        userId: adminUser.id,
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
        userId: adminUser.id,
        data: {
          Date: "2026-01-02",
          Revenue: 6200,
          "Units Sold": 310,
        },
      },
    }),
  ]);

  console.log("Created rows:", rows);

  console.log("\n✅ Database seeded successfully!");
  console.log("\n🔐 Admin Credentials:");
  console.log("   Email: mh.abdulla.688@gmail.com");
  console.log("   Password: 1234");
  console.log("   Role: admin");
  console.log("\n📝 Test User Credentials:");
  console.log("   Email: test@example.com");
  console.log("   Password: test1234");
  console.log("   Role: user");
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
