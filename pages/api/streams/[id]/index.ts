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
      query: { id }
    } = req;
    const stream = await client.stream.findUnique({
      where: {
        id: +id.toString()
      },
      include: {
        streamMessages: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                id: true,
                avatar: true
              }
            }
          }
        }
      }
    });
    if (stream) {
      return res.json({ ok: true, stream });
    } else {
      return res.json({
        ok: false,
        message: `stream(${id}) 을 찾지 못했습니다.`
      });
    }
  }
}

export default apiSessionHandler(
  apiHandler({
    methods: ["GET"],
    handler
  })
);
