import { PrismaClient } from "@prisma/client";
import seedData from "./seed/data.json";

const prisma = new PrismaClient();

async function main() {
  // Delete all existing records
  await prisma.song.deleteMany();

  for (const songData of seedData.songs) {
    await prisma.song.create({
      data: songData,
    });
  }

  console.log("Database has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
