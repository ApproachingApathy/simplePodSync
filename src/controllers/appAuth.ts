import Elysia, { t } from "elysia";
import { setupPlugin } from "../plugins/setup";
import { db } from "../db/db";
import { hashPassword } from "../password";

export const appAuthController = (app: Elysia) =>
  app.use(setupPlugin).group("/user", (app) =>
    app.post(
      "/signup",
      async ({ body }) => {
        const hash = await hashPassword(body.password);
        await db.user.create({
          data: {
            username: body.username,
            password: {
              create: {
                value: hash,
              },
            },
          },
        });
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
      },
    ),
  );
