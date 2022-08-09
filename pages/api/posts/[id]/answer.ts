import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/server/apiHandler";
import client from "@libs/server/prismaClient";
import { apiSessionHandler } from "@libs/server/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
    body: { answer }
  } = req;

  // post 가 있는지 체크
  const post = await client.post.findUnique({
    where: {
      id: +id.toString()
    },
    select: {
      id: true
    }
  });

  // post 가 없으면 에러
  if (!post) {
    return res.status(404).json({
      ok: false,
      message: `Post(${id}) 가 없습니다`
    });
  }
  // answer 생성
  const createdAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id
        }
      },
      post: {
        connect: {
          id: +id.toString()
        }
      },
      answer: answer
    }
  });

  // 생성된 answer 반환
  res.status(200).json({
    ok: true,
    answer: createdAnswer
  });
}

export default apiSessionHandler(
  apiHandler({
    methods: ["POST"],
    handler
  })
);
