import * as SQLite from 'expo-sqlite';
import { OutboxItem } from './types';


const db = SQLite.openDatabaseSync('quicktask.db', { enableChangeListener: false });


export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS outbox (
      id TEXT PRIMARY KEY NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      imageUri TEXT,
      status TEXT NOT NULL,
      error TEXT,
      providerMessageId TEXT,
      createdAt INTEGER NOT NULL,
      sentAt INTEGER,
      retries INTEGER NOT NULL
    );
  `);


  db.execSync(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    destEmail TEXT,
    includeMetadata INTEGER NOT NULL DEFAULT 1,
    sendMethod TEXT NOT NULL DEFAULT 'relay'
  );`);


  db.execSync(`INSERT OR IGNORE INTO settings (id, destEmail, includeMetadata, sendMethod)
    VALUES (1, NULL, 1, 'relay');`);
}


export function getSettings(): Promise<{ destEmail: string | null; includeMetadata: boolean; sendMethod: 'relay' }> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepareSync('SELECT destEmail, includeMetadata, sendMethod FROM settings WHERE id=1;');
    const result = stmt.executeSync();
    const row = result.getFirst();
    if (row) {
      resolve({
        destEmail: row.destEmail,
        includeMetadata: !!row.includeMetadata,
        sendMethod: row.sendMethod
      });
    } else {
      reject(new Error('Settings not found'));
    }
  });
}


export function setSettings(p: Partial<{ destEmail: string | null; includeMetadata: boolean; sendMethod: 'relay' }>): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (p.destEmail !== undefined) {
        db.runSync('UPDATE settings SET destEmail=? WHERE id=1;', [p.destEmail]);
      }
      if (p.includeMetadata !== undefined) {
        db.runSync('UPDATE settings SET includeMetadata=? WHERE id=1;', [p.includeMetadata ? 1 : 0]);
      }
      if (p.sendMethod !== undefined) {
        db.runSync('UPDATE settings SET sendMethod=? WHERE id=1;', [p.sendMethod]);
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}


export function addOutboxItem(item: OutboxItem): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.runSync(
        'INSERT INTO outbox (id, subject, body, imageUri, status, error, providerMessageId, createdAt, sentAt, retries) VALUES (?,?,?,?,?,?,?,?,?,?);',
        [item.id, item.subject, item.body, item.imageUri ?? null, item.status, item.error ?? null, item.providerMessageId ?? null, item.createdAt, item.sentAt ?? null, item.retries]
      );
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}


export function listOutbox(): Promise<OutboxItem[]> {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepareSync('SELECT * FROM outbox ORDER BY createdAt DESC;');
      const result = stmt.executeSync();
      const items: OutboxItem[] = [];
      for (const row of result.getAll()) {
        items.push(row as OutboxItem);
      }
      resolve(items);
    } catch (e) {
      reject(e);
    }
  });
}


export function updateOutbox(id: string, patch: Partial<OutboxItem>): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  Object.entries(patch).forEach(([k, v]) => {
    fields.push(`${k} = ?`);
    values.push(v);
  });
  values.push(id);
  
  return new Promise((resolve, reject) => {
    try {
      db.runSync(`UPDATE outbox SET ${fields.join(', ')} WHERE id=?;`, values);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

