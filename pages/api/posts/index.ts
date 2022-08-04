import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/prismaClient";
import { apiSessionHandler } from "@libs/backend/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question, latitude, longitude },
    session: { user }
  } = req;

  // 등록
  if (req.method === "POST") {
    const post = await client.post.create({
      data: {
        question: question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id
          }
        }
      }
    });

    res.status(201).json({
      ok: true,
      post
    });
  }

  // 목록 조회
  if (req.method === "GET") {
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            wonderings: true,
            answers: true
          }
        }
      }
    });

    res.status(200).json({
      ok: true,
      posts
    });
  }
}

export default apiSessionHandler(
  apiHandler({
    methods: ["POST", "GET"],
    handler
  })
);
