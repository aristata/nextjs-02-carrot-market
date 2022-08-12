import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/server/apiHandler";
import client from "@libs/server/prismaClient";
import { apiSessionHandler } from "@libs/server/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            favorites: true
          }
        }
      }
    });
    res.status(200).json({
      ok: true,
      products
    });
  } else if (req.method === "POST") {
    const {
      body: { name, price, description, photoUrl },
      session: { user }
    } = req;

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        imageUrl: photoUrl,
        user: {
          connect: {
            id: user?.id
          }
        }
      }
    });

    res.status(201).json({
      ok: true,
      product
    });
  }
}

export default apiSessionHandler(
  apiHandler({
    methods: ["POST", "GET"],
    handler
  })
);
