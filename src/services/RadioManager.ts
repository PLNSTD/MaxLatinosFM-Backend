import { PrismaClient, type Song } from "@prisma/client";

class RadioQueue {
  private queue: number[] = [];
  private currentIndex = 0;
  private songStartTime = Date.now();
  private prisma: PrismaClient;
  private currentSong: Song | null;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.currentSong = null;
  }

  getPrisma() {
    return this.prisma;
  }

  async init() {
    this.queue = await this.randomizerQueue();
    this.currentIndex = 0;
    this.songStartTime = Date.now();
  }

  private getElapsed(): number {
    return Math.floor((Date.now() - this.songStartTime) / 1000);
  }

  getCurrentSong() {
    const song = this.currentSong;
    const elapsed = this.getElapsed();
    return { song, elapsed };
  }

  private async updateCurrentSong() {
    const currentSongId = this.queue[this.currentIndex]!;
    this.currentSong = await this.prisma.song.findUnique({
      where: { id: currentSongId },
    });
    this.songStartTime = Date.now();
  }

  async tick() {
    if (!this.currentSong) {
      this.updateCurrentSong();
    }
    if (!this.currentSong) return;
    console.log(`Now Playing ID: ${this.queue[this.currentIndex]}`);
    if (this.getElapsed() >= this.currentSong!.duration) {
      this.currentIndex++;
      if (this.currentIndex >= this.queue.length) {
        this.queue = await this.randomizerQueue();
        this.currentIndex = 0;
      }
      this.updateCurrentSong();
    }
  }

  private async randomizerQueue(): Promise<number[]> {
    // 1️⃣ Fetch all song IDs from DB
    const songs = await prisma.song.findMany({
      select: { id: true }, // only need IDs for the queue
    });

    // 2️⃣ Extract IDs into an array
    const songIds = songs.map((s) => s.id!) as number[];

    // 3️⃣ Shuffle the array using Fisher–Yates shuffle
    for (let i = songIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      // Swap using a temp variable
      const temp = songIds[i]!;
      songIds[i] = songIds[j]!;
      songIds[j] = temp;
    }

    console.log(songIds);

    return songIds; // randomized queue of IDs
  }
}

// Export one shared instance
const prisma = new PrismaClient();
export const radioQueue = new RadioQueue(prisma);
