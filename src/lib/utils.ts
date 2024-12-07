import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getSoundFiles() {
  try {
    const response = await fetch('/api/sounds');
    if (!response.ok) throw new Error('Failed to fetch sounds');
    const files = await response.json();
    return files.map((file: string) => ({
      name: file.split('/').pop()?.split('.')[0] || '',
      path: file,
      type: file.split('.').pop() || '',
    }));
  } catch (error) {
    console.error('Error loading sound files:', error);
    return [];
  }
}
