import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function formatText(input, fallback = "N/A") {
  if (!input || typeof input !== "string" || input.trim() === "") {
    return fallback;
  }

  let formatted = input.replace(/[_\-]+/g, " ");
  formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2");
  formatted = formatted
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formatted || fallback;
}