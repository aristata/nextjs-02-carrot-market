import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "@libs/backend/apiHandler";
import client from "@libs/backend/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;
  const payload = phone ? { phone: +phone } : { email };
  const user = await client.user.upsert({
    where: {
      ...payload
    },
    create: {
      name: "Anonymous",
      ...payload
    },
    update: {}
  });

  console.log(user);
  return res.status(200).end();
}

export default apiHandler("POST", handler);
