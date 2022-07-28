import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/prismaClient";
import { apiSessionHandler } from "@libs/backend/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { id } = req.query;
  const product = await client.product.findUnique({
    where: {
      id: +id.toString()
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word
    }
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id
        }
      }
    }
  });
  res.status(200).json({
    ok: true,
    product,
    relatedProducts
  });
}

export default apiSessionHandler(
  apiHandler({
    methods: ["GET"],
    handler
  })
);
