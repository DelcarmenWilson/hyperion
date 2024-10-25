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
type FileUploadProps={
  newFile: File, 
  filePath: string ,
  oldFile?:string|null
}
export const handleFileUpload = async ({newFile, filePath = "temp",oldFile}:FileUploadProps) => {
  const signedURLResult = await getSignedURL({
    oldFile:oldFile,
    fileSize: newFile.size,
    fileType: newFile.type,
    filePath:filePath,
    checksum: await computeSHA256(newFile),
  });
  if (signedURLResult.error !== undefined) 
    throw new Error(signedURLResult.error);
  
  const url = signedURLResult.success;
  await axios.put(url, newFile, { headers: { "Content-Type": newFile.type } });
  const fileUrl = url.split("?")[0];
  return fileUrl;
};