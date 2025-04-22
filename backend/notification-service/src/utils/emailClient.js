import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

const { SENDGRID_API_KEY, SENDGRID_FROM } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendEmail(to, subject, text) {
  await sgMail.send({ to, from: SENDGRID_FROM, subject, text });
}
