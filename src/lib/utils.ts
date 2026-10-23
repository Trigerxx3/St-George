import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a phone number for display
 */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
}

/**
 * Format a phone number for tel: links
 */
export function phoneHref(phone: string): string {
  return `tel:+61${phone.slice(1)}`;
}
