import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@cms.com" },
    update: {},
    create: {
      email: "admin@cms.com",
      password: hashedPassword,
      role: "admin",
    },
  });
}

main()
  .then(() => console.log("✅ Admin user created"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
