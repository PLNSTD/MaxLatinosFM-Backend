import { PrismaClient, type Bumper, type Song } from "@prisma/client";

class RadioQueue {
  private songsQueue: number[] = [];
  private bumpersQueue: number[] = [];
  private currentIndex = 0;
  private bumperCnt = 0;
  private songStartTime = Date.now();
  private prisma: PrismaClient;
  private currentSong: Song | null | Bumper;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.currentSong = null;
  }

  getPrisma() {
    return this.prisma;
  }

  async init() {
    this.songsQueue = await this.randomizerSongQueue();
    this.currentIndex = 0;
    this.songStartTime = Date.now();
  }

  clearQueue() {
    this.songsQueue = [];
    this.currentSong = null;
  }

  getElapsed(): number {
    return Math.floor((Date.now() - this.songStartTime) / 1000);
  }

  getCurrentSong() {
    const song = this.currentSong;
    const elapsed = this.getElapsed();
    return { song, elapsed };
  }

  async setCurrentSong(currentSongId: number) {
    this.songsQueue = [currentSongId];
    this.currentSong = await this.prisma.song.findUnique({
      where: { id: currentSongId },
    });
    this.songStartTime = Date.now();
  }

  private async updateCurrentSong() {
    const currentSongId = this.songsQueue[this.currentIndex]!;
    this.currentSong = await this.prisma.song.findUnique({
      where: { id: currentSongId },
    });
    this.songStartTime = Date.now();
  }

  private async updateCurrentBumper() {
    const bumpers = await prisma.bumper.findMany();

    if (bumpers.length === 0) {
      this.updateCurrentSong();
      return; // no bumpers in DB
    }

    // pick random index
    const randomIndex = Math.floor(Math.random() * bumpers.length);
    this.currentSong = bumpers[randomIndex]!;
    this.songStartTime = Date.now();
  }

  async tick() {
    if (this.songsQueue.length == 0) {
      await this.randomizerSongQueue();
      return;
    }
    if (!this.currentSong) {
      this.updateCurrentSong();
      this.songStartTime = Date.now();
    }
    if (!this.currentSong) return;

    if (this.getElapsed() >= this.currentSong!.duration) {
      this.currentIndex++;
      this.bumperCnt++;
      console.log(`Now Playing ID: ${this.songsQueue[this.currentIndex]}`);
      console.log(`Bumper Counter: ${this.bumperCnt}`);
      if (this.currentIndex >= this.songsQueue.length) {
        this.songsQueue = await this.randomizerSongQueue();
        this.currentIndex = 0;
      }
      if (this.bumperCnt % 3 == 0) {
        this.bumperCnt = 0;
        this.currentIndex--;
        this.updateCurrentBumper();
      } else this.updateCurrentSong();
    }
  }

  private async randomizerSongQueue(): Promise<number[]> {
    // 1️⃣ Fetch all song IDs from DB
    let songs = await this.prisma.song.findMany({
      select: { id: true }, // only need IDs for the queue
    });

    // 2️⃣ Extract IDs into an array
    const songsIds = songs.map((s) => s.id!) as number[];

    // 3️⃣ Shuffle the array using Fisher–Yates shuffle
    for (let i = songsIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      // Swap using a temp variable
      const temp = songsIds[i]!;
      songsIds[i] = songsIds[j]!;
      songsIds[j] = temp;
    }

    console.log(`Songs Queue: ${songsIds}`);
    return songsIds; // randomized queue of IDs
  }

  private async randomizerBumperQueue(): Promise<number[]> {
    let bumpers = await this.prisma.bumper.findMany({
      select: { id: true },
    });

    const bumpersIds = bumpers.map((b) => b.id!) as number[];

    for (let i = bumpersIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      // Swap using a temp variable
      const temp = bumpersIds[i]!;
      bumpersIds[i] = bumpersIds[j]!;
      bumpersIds[j] = temp;
    }
    console.log(`Bumpers Queue: ${bumpersIds}`);
    return bumpersIds;
  }
}
// Export one shared instance
const prisma = new PrismaClient();
export const radioQueue = new RadioQueue(prisma);
