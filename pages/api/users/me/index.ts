import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/server/apiHandler";
import client from "@libs/server/prismaClient";
import { apiSessionHandler } from "@libs/server/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: {
        id: req.session.user?.id
      }
    });

    return res.json({
      ok: true,
      profile
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { email, phone, name, avatarUrl }
    } = req;

    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id
      }
    });
    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email
          },
          select: {
            id: true
          }
        })
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          errorMessage: "이미 등록된 이메일 입니다."
        });
      }
      await client.user.update({
        where: {
          id: user?.id
        },
        data: {
          email
        }
      });
      res.json({
        ok: true
      });
    }
    if (phone && phone !== currentUser?.phone) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            phone
          },
          select: {
            id: true
          }
        })
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          errorMessage: "이미 등록된 전화번호 입니다."
        });
      }
      await client.user.update({
        where: {
          id: user?.id
        },
        data: {
          phone
        }
      });
      res.json({
        ok: true
      });
    }
    if (name && name !== currentUser?.name) {
      await client.user.update({
        where: {
          id: user?.id
        },
        data: {
          name
        }
      });
      res.json({
        ok: true
      });
    }
    if (avatarUrl) {
      await client.user.update({
        where: {
          id: user?.id
        },
        data: {
          avatar: avatarUrl
        }
      });
      res.json({
        ok: true
      });
    }
    res.json({
      ok: true
    });
  }
}

export default apiSessionHandler(
  apiHandler({
    methods: ["GET", "POST"],
    handler
  })
);
