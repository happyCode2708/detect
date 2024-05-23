import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeDuplicates = (arr: string[]) => {
  // Use a Set to automatically filter out duplicate entries
  const uniqueArray: string[] = [...new Set(arr)];
  return uniqueArray;
};
