export type ItemProps = {
  title?: string;
  text: string;
};

export type FileRecord = {
  files:File[]
  path: string;
  id: string;
  type: string;
  fileNames?: string[];
};
