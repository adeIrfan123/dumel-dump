import crypto from "crypto";
import { prisma } from "../src/app/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: {
      encryptionSalt: "null",
    },
    select: {
      id: true,
      username: true,
    },
  });

  console.log(`menemukan ${user.length} user tanpa encryption salt.`);

  for (const user of users) {
    const encryptionSalt = crypto.randomBytes(16).toString("base64");
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        encryptionSalt,
      },
    });

    console.log(`Salt dibuat untuk: ${user.username}`);
  }
  console.log("selesai");
}

main()
  .catch((error) => {
    console.error("gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
