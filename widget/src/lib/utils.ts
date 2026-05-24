import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fakeEmailRegex = /^vkid_\d+@noemail\.local$/;
const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email?: string) {
  if (!email) {
    return "";
  }
  if (!validEmailRegex.test(email) || fakeEmailRegex.test(email)) {
    return "";
  }
  return email;
}
