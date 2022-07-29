import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/prismaClient";
import { apiSessionHandler } from "@libs/backend/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user }
  } = req;

  const foundFavorite = await client.favorite.findFirst({
    where: {
      userId: user?.id,
      productId: +id.toString()
    }
  });

  if (foundFavorite) {
    await client.favorite.delete({
      where: {
        id: foundFavorite.id
      }
    });
  } else {
    await client.favorite.create({
      data: {
        user: {
          connect: {
            id: user?.id
          }
        },
        product: {
          connect: {
            id: +id.toString()
          }
        }
      }
    });
  }

  res.status(200).json({
    ok: true
  });
}

export default apiSessionHandler(
  apiHandler({
    methods: ["POST"],
    handler
  })
);
