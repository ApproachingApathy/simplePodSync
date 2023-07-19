import { Elysia, t } from "elysia";
import {
  authController,
  devicesController,
  subscriptionController,
  episodesController,
} from "./controllers";
import { setupPlugin } from "./plugins/setup";
import { logger } from "./logger/logger";
import { config } from "./configuration/configuration";
import { appAuthController } from "./controllers/appAuth";

const app = new Elysia()
  .use(setupPlugin)
  .on("request", ({ requestId }) => {
    logger.debug(`Received Request ${requestId}`);
  })
  .on("beforeHandle", (context) => {
    logger.debug("Handling Request", {
      requestId: context.requestId,
      method: context.request.method,
      url: context.request.url,
      headers: context.request.headers,
      body: context.body,
    });
  })
  .on("afterHandle", ({ requestId }) => {
    logger.debug(`Completed Request ${requestId}`);
  })
  .on("error", ({ error }) => {
    logger.error(error);
  })
  .get("/info", () => "Simple Pod Sync v0.0.1")
  .group("/simple-sync/api", (app) => app.use(appAuthController))
  .group("/api", (app) =>
    app.group("/2", (app) =>
      app
        .use(authController)
        .use(devicesController)
        .use(subscriptionController)
        .use(episodesController),
    ),
  )
  .get("/", () => "Hello Elysia")
  .listen(3000);

logger.debug("Configuration", { config });
logger.info(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
