import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// English to Bangla number converter
const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaNumber(num: number | string): string {
  return num.toString().replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
}

// Price formatter with Bangla numbers
export function formatBanglaPrice(price: number): string {
  return toBanglaNumber(price.toLocaleString()) + '৳';
}
