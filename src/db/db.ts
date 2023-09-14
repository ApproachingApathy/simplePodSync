import { PrismaClient } from "@prisma/client";
import { config } from "../configuration/configuration";
import { join } from "path";

const appDir = join(import.meta.dir, "../../");

const proc = Bun.spawnSync(["bunx", "prisma", "migrate", "dev"], {
  env: {
    ...Bun.env,
    DATABASE_URL: config.database.url,
  },
  cwd: appDir,
});

  
if (!proc.success)
  throw new Error(`Error running migration: ${proc.exitCode} ${proc.stderr}`);

const proc2 = Bun.spawnSync(["bunx", "prisma", "db", "seed"], {
  env: {
    ...Bun.env,
    DATABASE_URL: config.database.url
  },
  cwd: appDir
})

if (!proc2.success)
  throw new Error(`Failed to seed database: ${proc2.exitCode} ${proc2.stderr}`)

export const db = new PrismaClient({
  datasources: {
    db: {
      url: config.database.url,
    },
  },
});
