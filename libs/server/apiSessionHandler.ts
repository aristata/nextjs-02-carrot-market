import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}
const options = {
  cookieName: "carrotSession",
  password: process.env.IRON_SESSION_PASSWORD!
};

/**
 * IronSession 에서 제공하는 API Route Wrapping function 으로 입력받은 function 을 감싸준다
 */
export function apiSessionHandler(fn: any) {
  return withIronSessionApiRoute(fn, options);
}

/**
 * IronSession 에서 제공하는 SSR Wrapping function 으로 입력받은 function 을 감싸준다
 */
export function ssrSessionHandler(fn: any) {
  return withIronSessionSsr(fn, options);
}
