export type Voicemail = {
  id: string;
  lead: { firstName: string; lastName: string } | null;
  from: string;
  recordUrl: string | null;
  updatedAt: Date;
};
