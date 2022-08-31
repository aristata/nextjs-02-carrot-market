import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/server/apiHandler";
import client from "@libs/server/prismaClient";
import { apiSessionHandler } from "@libs/server/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // 등록
  if (req.method === "POST") {
    const {
      body: { productId },
      session: { user }
    } = req;

    // 등록 전 데이터가 있는지 조회한다
    client.chat.findMany({
      where: {
        product: {
          id: productId
        },
        user: {
          id: user?.id
        }
      },
      include: {
        chatMessage: {
          select: {
            id: true,
            createdAt: true,
            createdBy: true,
            createdFor
          }
        }
      }
    });

    // 등록
    const chat = await client.chat.create({
      data: {
        product: {
          connect: {
            id: productId
          }
        }
      }
    });
  }

  // 목록 조회
  else if (req.method === "GET") {
    const {
      session: { user }
    } = req;
  }

  // 나머지 에러 처리
  else {
  }
}

export default apiSessionHandler(
  apiHandler({
    methods: ["POST", "GET"],
    handler
  })
);
