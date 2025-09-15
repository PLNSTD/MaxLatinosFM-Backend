import { PrismaClient } from "@prisma/client";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
