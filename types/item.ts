export type ItemProps = {
  title?: string;
  text: string;
};

export type FileRecords = {
  files:File[]
  path: string;
  id: string;
  type: string;
  oldFile?:string;
  fileNames?: string[];
};

export type FileRecord = {
  file:File
  path: string;
  id: string;
  type: string;
  oldFile?:string;
};

