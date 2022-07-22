import { withIronSessionApiRoute } from "iron-session/next";

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

export function apiSessionHandler(fn: any) {
  return withIronSessionApiRoute(fn, options);
}
