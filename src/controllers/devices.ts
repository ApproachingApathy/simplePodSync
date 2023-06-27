import Elysia, { t } from "elysia";
import { setupPlugin } from "../plugins/setup";
import { isSignedIn } from "../middleware/isSignedIn";
import { isUserNameSessionAndPathMatch } from "../middleware/isUsernameMatch";
import { db } from "../db/db";
import { Prisma, Device } from "@prisma/client";

const convertDeviceForTransport = (
  dbDevice: { type: { value: string } } & Device
) => {
  return {
    id: dbDevice.clientId,
    caption: dbDevice.caption,
    type: dbDevice.type.value,
    // TODO
    subscriptions: 0,
  };
};

export const devicesController = (app: Elysia) =>
  app.group("/devices", (app) =>
    app
      .use(setupPlugin)
      .post(
        "/:username/:device",
        async ({ params, body, session }) => {
          await db.device.upsert({
            where: {
              clientId_ownerId: {
                clientId: params.device,
                ownerId: session?.user.id as string,
              },
            },
            create: {
              clientId: params.device,
              caption: body.caption,
              type: {
                connect: {
                  value: body.type,
                },
              },
              owner: {
                connect: {
                  id: session?.user.id as string,
                },
              },
            },
            update: {
              caption: body.caption,
              type: {
                connect: {
                  value: body.type,
                },
              },
            },
          });
        },
        {
          body: t.Object({
            caption: t.String(),
            type: t.String({ pattern: "desktop|laptop|mobile|server|other" }),
          }),
          beforeHandle: [isSignedIn, isUserNameSessionAndPathMatch],
        }
      )
      .get(
        "/:username",
        async ({ params, session }) => {
          const devices = await db.device.findMany({
            where: {
              owner: {
                id: session?.user.id,
              },
            },
            include: {
              type: {
                select: {
                  value: true,
                },
              },
            },
          });

          return devices.map(convertDeviceForTransport);
        },
        {
          beforeHandle: [isSignedIn, isUserNameSessionAndPathMatch],
        }
      )
  );
