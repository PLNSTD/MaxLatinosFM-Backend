import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete all existing records
  await prisma.song.deleteMany();

  // Create song
  const first_song = await prisma.song.create({
    data: {
      title: "TempSong",
      artist: "Dev",
      duration: 180,
    },
  });

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
