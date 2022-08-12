import { NextApiRequest, NextApiResponse } from "next";
import apiHandler, { ResponseType } from "@libs/server/apiHandler";
import client from "@libs/server/prismaClient";
import { apiSessionHandler } from "@libs/server/apiSessionHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page }
    } = req;
    const streams = await client.stream.findMany({
      take: 25,
      skip: (+page.toString() - 1) * 25
    });
    return res.json({ ok: true, streams });
  } else if (req.method === "POST") {
    const {
      session: { user },
      body: { title, price, description }
    } = req;

    // 결제가 필요한 부분이라 주석 처리함

    // const {
    //   result: {
    //     uid,
    //     rtmps: { streamKey, url }
    //   }
    // } = await (
    //   await fetch(
    //     `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}`
    //       },
    //       body: `{"meta": {"name":"${title}"},"recording": { "mode": "automatic", "timeoutSeconds": 600}}`
    //     }
    //   )
    // ).json();

    const { uid, streamKey, url } = {
      uid: "테스트 아이디",
      streamKey: "테스트 스트림 키",
      url: "테스트 스트림 유알엘"
    };

    const createdStream = await client.stream.create({
      data: {
        title,
        price,
        description,
        user: {
          connect: {
            id: user?.id
          }
        },
        cloudflareId: uid,
        cloudflareKey: streamKey,
        cloudflareUrl: url
      }
    });
    return res.json({ ok: true, stream: createdStream });
  }
}

export default apiSessionHandler(
  apiHandler({
    methods: ["GET", "POST"],
    handler
  })
);
