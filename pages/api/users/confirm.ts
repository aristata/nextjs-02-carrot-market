import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/prismaClient";
import { apiSessionHandler } from "@libs/backend/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token: inputToken } = req.body;
  console.log(`inputToken = ${inputToken}`);

  const outputToken = await client.token.findUnique({
    where: {
      payload: inputToken
    },
    include: {
      user: true
    }
  });
  if (!outputToken) return res.status(404).end();

  req.session.user = {
    id: outputToken.userId
  };
  await req.session.save();
  await client.token.deleteMany({
    where: {
      userId: outputToken.userId
    }
  });
  res.json({ ok: true });
}

export default apiSessionHandler(apiHandler({ methods: ["POST"], handler }));
