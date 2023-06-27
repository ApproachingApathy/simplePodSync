import cookie from "@elysiajs/cookie";
import { authPlugin } from "./auth";
import Elysia from "elysia";
import { db } from "../db/db";

const SESSION_ID_COOKIE_NAME = "sessionid";

export const setupPlugin = (app: Elysia) =>
  app
    // remove ".json from params"
    .onTransform(({ params }) => {
      if (!params) return;
      const cleanedParamEntries = Object.entries(params).map(([key, value]) => {
        if (typeof value === "string" && value.includes(".json")) {
          return [key, value.replace(".json", "")] as const;
        }
        return [key, value] as const;
      });

      cleanedParamEntries.forEach(([key, value]) => {
        params[key] = value;
      });
    })
    .state("version", "0.0.1")
    .use(cookie())
    .derive(async ({ cookie }) => {
      if (!cookie[SESSION_ID_COOKIE_NAME]) return { session: undefined };
      const session = await db.session.findFirst({
        where: {
          id: cookie[SESSION_ID_COOKIE_NAME],
          expiresAt: {
            gt: new Date(),
          },
          invalidated: false,
        },
        orderBy: {
          expiresAt: "desc",
        },
        include: {
          user: true,
        },
      });

      return {
        session: session ?? undefined,
      };
    });
// .use(authPlugin)
