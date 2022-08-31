import type { NextRequest, NextFetchEvent } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log("이건 chats 페이지 내부에서만 동작하는 미들웨어 입니다.");
  // console.log(req);
}
