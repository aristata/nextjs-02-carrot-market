import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "../../../libs/backend/apiHandler";
import client from "../../../libs/backend/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  return res.status(200).end();
}

export default apiHandler("POST", handler);
