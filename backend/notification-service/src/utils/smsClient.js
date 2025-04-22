import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER
} = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function sendSms(to, body) {
  await client.messages.create({ from: TWILIO_FROM_NUMBER, to, body });
}
