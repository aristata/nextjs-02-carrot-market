import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/prismaClient";
import { apiSessionHandler } from "@libs/backend/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany({});
    res.status(200).json({
      ok: true,
      products
    });
  } else if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user }
    } = req;

    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        imageUrl: "xx.com",
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
