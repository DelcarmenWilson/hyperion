import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhoneNumber = (str: string) => {
  let cleaned = ("" + str).replace(/\D/g, "");
  let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  // if (match) {
  //   let intlCode = match[1] ? "+1 " : "";
  //   return [
  //     intlCode,
  //     "(",
  //     match[2],
  //     ") ",
  //     match[3],
  //     "-",
  //     match[4],
  //   ].join("");
  // }

  if (match) {
    let intlCode = match[1] ? "+1 " : "";
    return [
      "+",
      intlCode,
      match[2],
      match[3],
      match[4],
    ].join("");
  }

  return "";
};