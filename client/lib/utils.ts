import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs";
import { getSignedURL } from "@/actions/upload";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}


export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

export const handleFileUpload = async (file: File, path: string = "temp") => {
  const signedURLResult = await getSignedURL({
    fileSize: file.size,
    fileType: file.type,
    filePath:path,
    checksum: await computeSHA256(file),
  });
  if (signedURLResult.error !== undefined) {
    throw new Error(signedURLResult.error);
  }
  const url = signedURLResult.success;
  await axios.put(url, file, { headers: { "Content-Type": file.type } });
  const fileUrl = url.split("?")[0];
  return fileUrl;
};