import cookie from "@elysiajs/cookie";
import Elysia, { t } from "elysia";
import { db } from "../db/db";
import dayjs from "dayjs";
import { setupPlugin } from "../plugins/setup";

export const authController = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      .use(setupPlugin)
      .post(
        "/:username/login.json",
        async ({ params: { username }, setCookie, session, set, headers }) => {
          if (!headers.authorization) {
            set.status = 401;
            return;
          }

          const user = await db.user.findUnique({
            where: {
              username,
            },
            include: {
              password: true,
            },
          });

          if (!user) {
            set.status = 401;
            return;
          }

          // Decoded payload in the form `username:password`
          const decodedPayload = atob(headers.authorization.split(" ")[1]);
          const [,decodedPassword] = decodedPayload.split(":")

          const doesPasswordMatches = await Bun.password.verify(decodedPassword, user.password?.value as string)
          if (!doesPasswordMatches) {
            set.status = 401;
            return;
          }

          const expiresAt = dayjs().add(7, "days").toDate()

          const newSession = await db.session.create({
            data: {
              userId: user.id,
              expiresAt
            }
          })

          setCookie("sessionid", newSession.id, {
            // secure: true,
            expires: expiresAt,
            sameSite: true,
            httpOnly: true,
            path: "/"
          })

          return;
        },
        {
          headers: t.Object({
            authorization: t.Optional(t.String({ pattern: "^Basic (.*)" })),
          }),
        }
      )
      .post("/:username/logout.json", ({}) => {
        return;
      })
  );
