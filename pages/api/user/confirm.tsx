import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/client";

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
  if (!outputToken) res.status(404).end();

  req.session.user = {
    id: outputToken?.userId
  };
  await req.session.save();
  res.status(200).end();
}

export default withIronSessionApiRoute(apiHandler("POST", handler), {
  cookieName: "carrotSession",
  password: process.env.IRON_SESSION_PASSWORD!
});
