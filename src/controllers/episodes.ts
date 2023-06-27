import Elysia, { t } from "elysia";
import { setupPlugin } from "../plugins/setup";
import { db } from "../db/db";
import dayjs from "dayjs";
import { EpisodeAction } from "@prisma/client";
import { isSignedIn } from "../middleware/isSignedIn";
import { isUserNameSessionAndPathMatch } from "../middleware/isUsernameMatch";

const convertEpisodeActionForTransport = (
  episodeAction: {
    device: { clientId: string };
    subscription: { url: string };
    type: { value: string };
  } & EpisodeAction
) => {
  return {
    podcast: episodeAction.subscription.url,
    episode: episodeAction.episodeUrl,
    device: episodeAction.device.clientId,
    action: episodeAction.type.value,
    timestamp: dayjs(episodeAction.timestamp).toISOString(),
    started: episodeAction.started,
    position: episodeAction.position,
    total: episodeAction.total,
  };
};

export const episodesController = (app: Elysia) =>
  app.group("/episodes", (app) =>
    app
      .use(setupPlugin)
      .post(
        "/:username",
        async ({ body, session }) => {
          for (let episodeAction of body) {
            await db.episodeAction.create({
              data: {
                episodeUrl: episodeAction.episode,
                device: {
                  connect: {
                    clientId_ownerId: {
                      clientId: episodeAction.device,
                      ownerId: session?.user.id as string,
                    },
                  },
                },
                subscription: {
                  connectOrCreate: {
                    where: {
                      url: episodeAction.podcast,
                    },
                    create: {
                      url: episodeAction.podcast,
                    },
                  },
                },
                type: {
                  connect: {
                    value: episodeAction.action,
                  },
                },
                timestamp: dayjs(episodeAction.timestamp).toDate() ?? undefined,
                started: episodeAction.started ?? undefined,
                position: episodeAction.position ?? undefined,
                total: episodeAction.total ?? undefined,
              },
            });
          }

          return {
            timestamp: dayjs().unix(),
            update_urls: [],
          };
        },
        {
          body: t.Array(
            t.Object({
              podcast: t.String(),
              episode: t.String(),
              device: t.String(),
              action: t.String(),
              timestamp: t.Optional(t.String()),
              started: t.Optional(t.Numeric()),
              position: t.Optional(t.Numeric()),
              total: t.Optional(t.Numeric()),
            })
          ),
          beforeHandle: [
            isSignedIn,
            (req) => isUserNameSessionAndPathMatch(req),
          ],
        }
      )
      .get(
        "/:username",
        async ({ query: { podcast, device, since, aggregated } }) => {
          const episodeActions = await db.episodeAction.findMany({
            where: {
              subscription: podcast
                ? {
                    url: podcast,
                  }
                : undefined,
              device: device
                ? {
                    clientId: device,
                  }
                : undefined,
              createdAt: {
                gt: dayjs.unix(since).toDate(),
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            include: {
              device: {
                select: {
                  clientId: true,
                },
              },
              type: {
                select: {
                  value: true,
                },
              },
              subscription: {
                select: {
                  url: true,
                },
              },
            },
          });

          return {
            timestamp: dayjs().unix(),
            actions: episodeActions.map(convertEpisodeActionForTransport),
          };
        },
        {
          query: t.Object({
            podcast: t.Optional(t.String()),
            device: t.Optional(t.String()),
            since: t.Numeric(),
            aggregated: t.Optional(t.Boolean()),
          }),
          beforeHandle: [
            isSignedIn,
            (req) => isUserNameSessionAndPathMatch(req),
          ],
        }
      )
  );
