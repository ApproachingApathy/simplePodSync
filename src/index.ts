import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie"
import { authController } from "./controllers";

const app = new Elysia()
.on("request", (context) => {
  console.log("--- Request ---")
  console.log("url:", context.request.method, context.request.url)
  console.log("headers:", context.request.headers)
  // console.log("body:")
})
.get("/info", () => "Simple Pod Sync v0.0.1")
.group("/api", app => app
  .group("/2", app => app
    .use(authController)
    .group("/devices", app => app
      .get("/:username", () => {
        return []
      })
    )
  )
)
.get("/", () => "Hello Elysia")
.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


export type App = typeof app