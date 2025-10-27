import { API_BASE } from './net';
import { OutboxItem } from './types';
import * as FileSystem from 'expo-file-system';


export async function sendViaRelay(item: OutboxItem, to: string) {
  const form: any = { to, subject: item.subject, body: item.body };
  let fileB64: string | undefined;
  if (item.imageUri) {
    fileB64 = await FileSystem.readAsStringAsync(item.imageUri, { encoding: FileSystem.EncodingType.Base64 });
  }
  const res = await fetch(`${API_BASE}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, attachmentBase64: fileB64, attachmentName: fileB64 ? 'photo.jpg' : undefined })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.messageId as string;
}

