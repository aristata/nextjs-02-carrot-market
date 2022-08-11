import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/server/apiHandler";
import client from "@libs/server/prismaClient";
import { apiSessionHandler } from "@libs/server/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page }
    } = req;
    const streams = await client.stream.findMany({
      take: 25,
      skip: (+page.toString() - 1) * 25
    });
    return res.json({ ok: true, streams });
  } else if (req.method === "POST") {
    const {
      session: { user },
      body: { title, price, description }
    } = req;
    const createdStream = await client.stream.create({
      data: {
        title,
        price,
        description,
        user: {
          connect: {
            id: user?.id
          }
        }
      }
    });
    return res.json({ ok: true, stream: createdStream });
  }
}

export default apiSessionHandler(
  apiHandler({
    methods: ["GET", "POST"],
    handler
  })
);
