import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    console.log("/pages/_middleware.ts 가 호출 되었습니다");
    return new Response(
      "봇 사용이 감지되었습니다. 해당 요청을 완료할 수 없습니다. " +
        "만약 봇이 아닌데 해당 에러가 표시된다면, 관리자에게 문의하세요.",
      { status: 403 }
    );
  }
  if (
    !req.url.includes("/api") &&
    !req.url.includes("/enter") &&
    !req.cookies.carrotsession
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/enter";
    return NextResponse.redirect(url);
  }
}
