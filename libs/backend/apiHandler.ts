import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

interface ApiParam {
  method: "GET" | "POST" | "DELETE";
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function apiHandler({
  method,
  handler,
  isPrivate = true
}: ApiParam) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== method) {
      return res
        .status(405)
        .json({ ok: false, message: "허용하지 않는 HTTP method 입니다." });
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, message: "로그인 해 주세요." });
    }
    try {
      handler(req, res);
    } catch (error) {
      return res.status(500).json({ ok: false, error });
    }
  };
}
