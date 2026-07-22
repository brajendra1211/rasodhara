import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error("Usage: npx tsx scripts/create-admin.ts <name> <email> <password>");
  process.exit(1);
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { name, email, passwordHash, role: "ADMIN" },
  });

  console.log(`Admin ready: ${user.email} (id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
