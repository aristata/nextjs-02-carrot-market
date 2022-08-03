import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/prismaClient";
import { apiSessionHandler } from "@libs/backend/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question },
    session: { user }
  } = req;

  const post = await client.post.create({
    data: {
      question: question,
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

export default apiSessionHandler(
  apiHandler({
    methods: ["POST"],
    handler
  })
);
