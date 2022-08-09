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
      body: { question, latitude, longitude },
      session: { user }
    } = req;

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
    const {
      query: { latitude, longitude },
      session: { user }
    } = req;

    const parsedLatitude = parseFloat(latitude.toString());
    const parsedLongitude = parseFloat(longitude.toString());
    // console.log("parsedLatitude = ", parsedLatitude);
    // console.log("parsedLongitude = ", parsedLongitude);

    // 검색 범위 조회 및 설정
    const foundUser = await client.user.findUnique({
      where: {
        id: user?.id
      },
      select: {
        searchRange: true
      }
    });
    // console.log("foundUser = ", foundUser);

    let searchRange: number;
    if (!foundUser || !foundUser.searchRange) {
      searchRange = 0.01;
    } else {
      searchRange = foundUser.searchRange;
    }
    // console.log("searchRange = ", searchRange);

    // 포스트 조회
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
      },
      where: {
        latitude: {
          gte: parsedLatitude - searchRange,
          lte: parsedLatitude + searchRange
        },
        longitude: {
          gte: parsedLongitude - searchRange,
          lte: parsedLongitude + searchRange
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
