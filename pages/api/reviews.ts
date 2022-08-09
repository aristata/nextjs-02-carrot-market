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

  const reviews = await client.review.findMany({
    where: {
      createdForId: user?.id
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  });

  res.json({
    ok: true,
    reviews
  });
}

export default apiSessionHandler(
  apiHandler({
    methods: ["GET"],
    handler
  })
);
