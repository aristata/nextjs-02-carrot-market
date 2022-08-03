import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/backend/apiHandler";
import client from "@libs/backend/prismaClient";
import { apiSessionHandler } from "@libs/backend/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user }
  } = req;

  const alreadyExists = await client.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: +id.toString()
    },
    select: {
      id: true
    }
  });

  if (alreadyExists) {
    await client.wondering.delete({
      where: {
        id: alreadyExists.id
      }
    });
  } else {
    await client.wondering.create({
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
        }
      }
    });
  }

  res.status(200).json({
    ok: true
  });
}

export default apiSessionHandler(
  apiHandler({
    methods: ["POST"],
    handler
  })
);
