import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";

config();

async function listUsers() {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const { api } = await import("../convex/_generated/api");
  const users = await client.query(api.users.getAllUsers, {});
  console.log("Total users in DB:", users.length);
  users.forEach((u: { email: string; role: string; name?: string }) =>
    console.log(` - ${u.email} | ${u.role} | ${u.name}`)
  );
}

listUsers();
