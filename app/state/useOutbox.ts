import { useEffect, useState, useCallback } from 'react';
import { addOutboxItem, listOutbox, updateOutbox, getSettings } from '../lib/outboxStore';
import { OutboxItem } from '../lib/types';
import NetInfo from '@react-native-community/netinfo';
import { sendViaRelay } from '../lib/emailSender';
import { Platform } from 'react-native';


function buildBody(text: string, includeMetadata: boolean) {
  const lines = [text.trim()].filter(Boolean);
  if (includeMetadata) {
    lines.push('\n—');
    lines.push(`Captured: ${new Date().toLocaleString()}`);
    lines.push(`Device: ${Platform.OS}`);
    lines.push('App: QuickTask v0.1');
  }
  return lines.join('\n');
}


export function useOutbox() {
  const [items, setItems] = useState<OutboxItem[]>([]);


  const refresh = useCallback(async () => {
    const all = await listOutbox();
    setItems(all);
  }, []);


  useEffect(() => { refresh(); }, [refresh]);


  const sendItem = useCallback(async (id: string) => {
    const s = await getSettings();
    const item = items.find(i => i.id === id);
    if (!item || !s.destEmail) return;
    try {
      await updateOutbox(id, { status: 'sending', error: null });
      const messageId = await sendViaRelay(item, s.destEmail);
      await updateOutbox(id, { status: 'sent', sentAt: Date.now(), providerMessageId: messageId });
    } catch (e: any) {
      await updateOutbox(id, { status: 'failed', error: String(e.message || e) });
    } finally {
      refresh();
    }
  }, [items, refresh]);


  // network regain retry
  useEffect(() => {
    const sub = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        const queued = items.filter(i => i.status === 'queued' || i.status === 'failed');
        for (const q of queued) await sendItem(q.id);
      }
    });
    return () => sub();
  }, [items, sendItem]);


  const createAndSend = useCallback(async (text: string, imageUri?: string | null) => {
    const s = await getSettings();
    if (!s.destEmail) throw new Error('Please set your destination email in Settings.');


    const subject = text.trim().slice(0, 120) || 'Future task';
    const body = buildBody(text, s.includeMetadata);
    const item: OutboxItem = {
      id: crypto.randomUUID(),
      subject, body,
      imageUri: imageUri || null,
      status: 'queued',
      error: null,
      providerMessageId: null,
      createdAt: Date.now(),
      sentAt: null,
      retries: 0
    };


    await addOutboxItem(item);
    await sendItem(item.id);
    await refresh();
  }, [refresh, sendItem]);


  return { items, refresh, createAndSend, sendItem };
}

