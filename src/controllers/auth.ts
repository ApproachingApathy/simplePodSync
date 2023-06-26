import cookie from "@elysiajs/cookie";
import Elysia, { t } from "elysia";
import { db } from "../db/db";
import dayjs from "dayjs";

export const authController = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      .use(cookie())
      .post(
        "/:username/login.json",
        async ({ params: { username }, setCookie, cookie, set, headers }) => {
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

          console.log(user.password?.value, decodedPassword)
          if (user.password?.value !== decodedPassword) {
            set.status = 401;
            return;
          }

          const expiresAt = dayjs().add(7).toDate()

          const session = await db.session.create({
            data: {
              userId: user.id,
              expiresAt
            }
          })

          setCookie("sessionid", session.id, {
            secure: true,
            expires: expiresAt,
            sameSite: true,
            httpOnly: true
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
