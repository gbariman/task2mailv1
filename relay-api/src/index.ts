import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { sendMail } from './mail.js';
import { PORT, RATE_LIMIT_PER_MIN } from './env.js';


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('tiny'));


// naive in-memory rate limit per IP
const hits = new Map<string, { count: number; ts: number }>();
app.use((req, _res, next) => {
  const key = req.ip;
  const now = Date.now();
  const rec = hits.get(key) || { count: 0, ts: now };
  if (now - rec.ts > 60_000) { rec.count = 0; rec.ts = now; }
  rec.count += 1; hits.set(key, rec);
  if (rec.count > RATE_LIMIT_PER_MIN) return next(new Error('Rate limit exceeded'));
  next();
});


app.post('/send', async (req, res) => {
  try {
    const { to, subject, body, attachmentBase64, attachmentName } = req.body || {};
    if (!to || !subject || !body) return res.status(400).send('Missing fields');
    const messageId = await sendMail({ to, subject, body, attachmentBase64, attachmentName });
    res.json({ ok: true, messageId });
  } catch (e: any) {
    res.status(500).send(e.message || 'Send failed');
  }
});


app.get('/health', (_req, res) => res.json({ ok: true }));


app.listen(PORT, () => console.log(`Relay listening on :${PORT}`));

