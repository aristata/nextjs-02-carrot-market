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
    session: { user }
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

  const isWondering = Boolean(
    await client.wondering.findFirst({
      where: {
        postId: +id.toString(),
        userId: user?.id
      },
      select: {
        id: true
      }
    })
  );

  if (post) {
    res.status(200).json({
      ok: true,
      post,
      isWondering
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
