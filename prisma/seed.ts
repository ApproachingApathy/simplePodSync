import { Prisma, PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/password";

await main();

async function main() {
  const prisma = new PrismaClient({});

  const deviceTypes: Prisma.DeviceTypeCreateInput[] = [
    { value: "desktop" },
    { value: "laptop" },
    { value: "mobile" },
    { value: "server" },
    { value: "other" },
  ];

  for (let dt of deviceTypes) {
    await prisma.deviceType.upsert({
      where: { value: dt.value },
      create: dt,
      update: {},
    });
  }

  const subscriptionActionTypes: Prisma.SubscriptionActionTypeCreateInput[] = [
    { value: "add" },
    { value: "remove" },
  ];

  for (let sa of subscriptionActionTypes) {
    await prisma.subscriptionActionType.upsert({
      where: { value: sa.value },
      create: sa,
      update: {},
    });
  }

  const episodeActionTypes: Prisma.EpisodeActionTypeCreateInput[] = [
    { value: "download" },
    { value: "delete" },
    { value: "play" },
    { value: "new" },
    { value: "flattr" },
  ];

  for (let ea of episodeActionTypes) {
    await prisma.episodeActionType.upsert({
      where: { value: ea.value },
      create: ea,
      update: {},
    });
  }

  await prisma.user.upsert({
    where: {
      username: "test",
    },
    create: {
      username: "test",
      password: {
        create: {
          value: await hashPassword("password"),
        },
      },
    },
    update: {},
  });
}
