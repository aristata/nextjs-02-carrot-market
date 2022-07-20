import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "@libs/backend/apiHandler";
import client from "@libs/backend/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;
  let user;

  if (phone) {
    user = await client.user.findUnique({
      where: {
        phone: +phone
      }
    });
    if (!user) {
      console.log("유저를 찾을 수 없습니다. 새로 생성합니다.");
      user = await client.user.create({
        data: {
          phone: +phone,
          name: "Anonymous"
        }
      });
    } else {
      console.log("유저를 찾았습니다.");
    }
  }

  if (email) {
    user = await client.user.findUnique({
      where: {
        email: email
      }
    });
    if (!user) {
      console.log("유저를 찾을 수 없습니다. 새로 생성합니다.");
      user = await client.user.create({
        data: {
          email: email,
          name: "Anonymous"
        }
      });
    } else {
      console.log("유저를 찾았습니다.");
    }
  }

  console.log(user);
  return res.status(200).end();
}

export default apiHandler("POST", handler);
