export type ItemProps = {
  title?: string;
  text: string;
};

export type FileRecords = {
  id: string;
  path: string;
  type: string;
  files:File[]
  oldFile?:string;
  fileNames?: string[];
};

export type FileRecord = {
  id: string;
  path: string;
  file:File
  oldFile?:string;
};

