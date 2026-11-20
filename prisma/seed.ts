import { PrismaClient, AdminRole, AdminStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const name = process.env.ADMIN_BOOTSTRAP_NAME;
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!email || !password || !name) {
    console.error(
      "\n[Bootstrap Error]: Missing required bootstrap environment variables.\n" +
      "Please set the following before running the seed script:\n" +
      "  - ADMIN_BOOTSTRAP_NAME (e.g. 'AIPP Super Administrator')\n" +
      "  - ADMIN_BOOTSTRAP_EMAIL (e.g. 'admin@aipp-praxis.org')\n" +
      "  - ADMIN_BOOTSTRAP_PASSWORD (minimum 8 characters)\n"
    );
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (password.length < 8) {
    console.error("[Bootstrap Error]: ADMIN_BOOTSTRAP_PASSWORD must be at least 8 characters long.");
    process.exit(1);
  }

  // Check if administrator already exists
  const existing = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    console.log(
      `[Bootstrap Notice]: Administrator already exists for ${normalizedEmail}. ` +
      `Existing credentials preserved (safe to rerun).`
    );
    return;
  }

  console.log(`[Bootstrap]: Hashing password and provisioning Super Admin...`);
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.create({
    data: {
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      status: AdminStatus.ACTIVE,
    },
  });

  console.log(
    `[Bootstrap Success]: Provisioned initial Super Admin [${admin.id}] for: ${admin.email}`
  );
}

main()
  .catch((e) => {
    console.error("[Bootstrap Fatal Error]:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
