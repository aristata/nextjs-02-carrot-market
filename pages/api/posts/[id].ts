import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/prismaClient";
import { apiSessionHandler } from "@libs/backend/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id }
  } = req;

  const post = await client.post.findUnique({
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
      },
      answers: {
        select: {
          answer: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      },
      _count: {
        select: {
          answers: true,
          wonderings: true
        }
      }
    }
  });

  if (post) {
    res.status(200).json({
      ok: true,
      post
    });
  } else {
    res.status(404).json({
      ok: false,
      message: "post 를 찾지 못했습니다."
    });
  }
}

export default apiSessionHandler(
  apiHandler({
    methods: ["GET"],
    handler
  })
);
