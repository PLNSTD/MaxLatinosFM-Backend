import { parseFile } from "music-metadata";

export function durationToSeconds(duration: string | undefined): number {
  if (!duration) return 0;

  const parts = duration.split(":").map((v) => Number(v));
  if (parts.length !== 2) return 0;

  const [minutes, seconds] = parts;

  if (typeof minutes !== "number" || isNaN(minutes)) return 0;
  if (typeof seconds !== "number" || isNaN(seconds)) return 0;

  return minutes * 60 + seconds;
}

export async function getAudioDuration(
  file: Express.Multer.File
): Promise<number> {
  const metadata = await parseFile(file.path);
  return Math.floor(metadata.format.duration ?? 0);
}

export function capitalizeWords(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
