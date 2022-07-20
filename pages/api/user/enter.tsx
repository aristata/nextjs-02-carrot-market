import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/client";
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const userInfo = phone ? { phone: +phone } : email ? { email } : null;
  if (!userInfo) return res.status(400).json({ ok: false });
  const randomNumber = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload: randomNumber,
      user: {
        connectOrCreate: {
          where: {
            ...userInfo
          },
          create: {
            name: "Anonymous",
            ...userInfo
          }
        }
      }
    }
  });
  if (phone) {
    const twilioResponse = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MS_SID,
      to: process.env.MY_PHONE!,
      body: `당신의 로그인 토큰은 ${randomNumber} 입니다.`
    });
    console.log(twilioResponse);
  }
  return res.status(200).json({ ok: true });
}

export default apiHandler("POST", handler);
