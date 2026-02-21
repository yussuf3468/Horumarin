import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return then.toLocaleDateString("so-SO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (days > 0) {
    return `${days} maalmood ka hor`;
  } else if (hours > 0) {
    return `${hours} saacadood ka hor`;
  } else if (minutes > 0) {
    return `${minutes} daqiiqadood ka hor`;
  } else {
    return "Hadda";
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getHotScore(votes: number, createdAt: string): number {
  const ageHours =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  const voteScore = Math.log10(Math.max(Math.abs(votes), 1));
  const sign = votes > 0 ? 1 : votes < 0 ? -1 : 0;
  const timePenalty = ageHours / 12;

  return voteScore * sign - timePenalty;
}

/**
 * Returns true when a post media URL points to a video file.
 * Videos are uploaded under the `videos/` prefix in the "post-media" bucket,
 * or can be detected by common video extensions / MIME-type strings in the URL.
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  // Storage path-based detection (our upload convention)
  if (lower.includes("/videos/")) return true;
  // Extension-based fallback
  const videoExts = [".mp4", ".mov", ".webm", ".avi", ".mkv", ".m4v", ".ogv"];
  return videoExts.some((ext) => lower.split("?")[0].endsWith(ext));
}
