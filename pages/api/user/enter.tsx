import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "@libs/backend/apiHandler";
import client from "@libs/backend/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;
  const payload = phone ? { phone: +phone } : { email };
  const token = await client.token.create({
    data: {
      payload: "12345",
      user: {
        connectOrCreate: {
          where: {
            ...payload
          },
          create: {
            name: "Anonymous",
            ...payload
          }
        }
      }
    }
  });
  console.log(token);
  return res.status(200).end();
}

export default apiHandler("POST", handler);
