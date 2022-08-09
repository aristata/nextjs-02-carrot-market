import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/server/apiHandler";
import client from "@libs/server/prismaClient";
import { apiSessionHandler } from "@libs/server/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { message },
    query: { id }
  } = req;

  const stream = await client.stream.findUnique({
    where: {
      id: +id.toString()
    }
  });

  if (!stream) {
    return res.json({
      ok: false,
      errorMessage: `Stream(${id})을 찾지 못했습니다`
    });
  }

  const streamMessage = await client.streamMessage.create({
    data: {
      message,
      user: {
        connect: {
          id: user?.id
        }
      },
      stream: {
        connect: {
          id: +id.toString()
        }
      }
    }
  });

  return res.json({ ok: true, streamMessage });
}

export default apiSessionHandler(
  apiHandler({
    methods: ["POST"],
    handler
  })
);
