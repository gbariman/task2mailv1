import nodemailer from 'nodemailer';
import { SMTP_URL, FROM_ADDRESS } from './env.js';


const transporter = nodemailer.createTransport(SMTP_URL);


export async function sendMail({ to, subject, body, attachmentBase64, attachmentName }: {
  to: string; subject: string; body: string; attachmentBase64?: string; attachmentName?: string;
}) {
  const attachments = attachmentBase64 ? [{ filename: attachmentName || 'photo.jpg', content: Buffer.from(attachmentBase64, 'base64') }] : [];
  const info = await transporter.sendMail({ from: FROM_ADDRESS, to, subject, text: body, attachments, replyTo: to });
  return info.messageId as string;
}

