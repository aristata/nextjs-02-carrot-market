import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/server/apiHandler";
import client from "@libs/server/prismaClient";
import { apiSessionHandler } from "@libs/server/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user }
  } = req;

  const sales = await client.sale.findMany({
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
    sales
  });
}

export default apiSessionHandler(
  apiHandler({
    methods: ["GET"],
    handler
  })
);
