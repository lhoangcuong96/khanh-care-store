import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function convertQueryStringToObject(queryString: string) {
  const params = new URLSearchParams(queryString);
  const obj = Object.fromEntries(params);
  return obj;
}
