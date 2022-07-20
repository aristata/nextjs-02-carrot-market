import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "@libs/backend/apiHandler";
import client from "@libs/backend/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;
  const userInfo = phone ? { phone: +phone } : { email };
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
  console.log(token);
  return res.status(200).end();
}

export default apiHandler("POST", handler);
