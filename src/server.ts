import { PrismaClient } from "@prisma/client";
import app from "./app.js";
import { radioQueue } from "./services/RadioManager.js";

const PORT = process.env.PORT || 3001;

const prisma = new PrismaClient();

async function boostrap() {
  await radioQueue.init();
  setInterval(() => radioQueue.tick(), 1000); // check every 1s

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

boostrap();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
