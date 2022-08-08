import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/prismaClient";
import { apiSessionHandler } from "@libs/backend/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user }
  } = req;

  const favorites = await client.favorite.findMany({
    where: {
      user: {
        id: user?.id
      }
    },
    include: {
      product: {
        include: {
          _count: true
        }
      }
    }
  });

  res.json({
    ok: true,
    favorites
  });
}

export default apiSessionHandler(
  apiHandler({
    methods: ["GET"],
    handler
  })
);
