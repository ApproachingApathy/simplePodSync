import Elysia, { t } from "elysia";
import { setupPlugin } from "../plugins/setup";
import { isSignedIn } from "../middleware/isSignedIn";
import { isUserNameSessionAndPathMatch } from "../middleware/isUsernameMatch";
import { db } from "../db/db";
import dayjs from "dayjs";

export const subscriptionController = (app: Elysia) =>
  app.group("/subscriptions", (app) =>
    app
      .use(setupPlugin)
      .get(
        "/:username/:device",
        async ({ params, query }) => {
          const subscriptionsActions = await db.subscriptionAction.findMany({
            where: {
              device: {
                clientId: params.device,
              },
              createdAt: {
                gt: dayjs.unix(query.since).toDate(),
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            distinct: "subscriptionId",
            include: {
              subscription: true,
              type: {
                select: {
                  value: true,
                },
              },
            },
          });

          const subscriptionActionAdditions = [];
          const subscriptionActionRemoves = [];
          for (let sa of subscriptionsActions) {
            if ((sa.type.value = "add")) {
              subscriptionActionAdditions.push(sa.subscription.url);
              continue;
            }
            subscriptionActionRemoves.push(sa.subscription.url);
          }
          subscriptionsActions.filter((sa) => sa.type.value === "add");

          return {
            add: subscriptionActionAdditions,
            remove: subscriptionActionRemoves,
            timestamp: dayjs().unix(),
          };
        },
        {
          query: t.Object({
            since: t.Numeric(),
          }),
          beforeHandle: [
            isSignedIn,
            (req) => isUserNameSessionAndPathMatch(req),
          ],
        }
      )
      .post(
        "/:username/:device",
        async ({ body, params, session }) => {
          for (let url of body.add) {
            await db.subscriptionAction.create({
              data: {
                type: {
                  connect: {
                    value: "add",
                  },
                },
                device: {
                  connect: {
                    clientId_ownerId: {
                      clientId: params.device,
                      ownerId: session?.user.id as string,
                    },
                  },
                },
                subscription: {
                  connectOrCreate: {
                    where: {
                      url,
                    },
                    create: {
                      url,
                    },
                  },
                },
              },
            });
          }

          for (let url of body.add) {
            await db.subscriptionAction.create({
              data: {
                type: {
                  connect: {
                    value: "remove",
                  },
                },
                device: {
                  connect: {
                    clientId_ownerId: {
                      clientId: params.device,
                      ownerId: session?.user.id as string,
                    },
                  },
                },
                subscription: {
                  connectOrCreate: {
                    where: {
                      url,
                    },
                    create: {
                      url,
                    },
                  },
                },
              },
            });
          }

          return {
            timestamp: dayjs().toDate(),
            update_urls: [],
          };
        },
        {
          body: t.Object({
            add: t.Array(t.String()),
            remove: t.Array(t.String()),
          }),
          beforeHandle: [
            isSignedIn,
            (req) => isUserNameSessionAndPathMatch(req),
          ],
        }
      )
  );
