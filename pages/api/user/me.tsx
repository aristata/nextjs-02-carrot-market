import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/client";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const profile = await client.user.findUnique({
    where: {
      id: req.session.user?.id
    }
  });

  res.json({
    ok: true,
    profile
  });
}

export default withIronSessionApiRoute(apiHandler("GET", handler), {
  cookieName: "carrotSession",
  password: process.env.IRON_SESSION_PASSWORD!
});
