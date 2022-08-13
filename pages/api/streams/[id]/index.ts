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
      query: { id },
      session: { user }
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

    // 스트림 소유주가 아니면 URL 및 KEY 를 감추도록 한다
    if (stream && stream.userId !== user?.id) {
      stream.cloudflareKey = "스트림 소유주에게만 노출됩니다";
      stream.cloudflareUrl = "스트림 소유주에게만 노출됩니다";
    }

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
