import 'dotenv/config';


export const PORT = Number(process.env.PORT || 4000);
export const SMTP_URL = process.env.SMTP_URL as string;
export const FROM_ADDRESS = process.env.FROM_ADDRESS || 'QuickTask Relay <no-reply@example.com>';
export const RATE_LIMIT_PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN || 120);
if (!SMTP_URL) throw new Error('Missing SMTP_URL');

