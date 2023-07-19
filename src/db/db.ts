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

export const db = new PrismaClient({
  datasources: {
    db: {
      url: config.database.url,
    },
  },
});
