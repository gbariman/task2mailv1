export type OutboxStatus = 'queued' | 'sending' | 'sent' | 'failed';


export type OutboxItem = {
  id: string;
  subject: string;
  body: string;
  imageUri?: string | null;
  status: OutboxStatus;
  error?: string | null;
  providerMessageId?: string | null;
  createdAt: number; // ms epoch
  sentAt?: number | null;
  retries: number;
};


export type Settings = {
  destEmail: string | null;
  includeMetadata: boolean;
  sendMethod: 'relay'; // extend later ('gmail')
};

