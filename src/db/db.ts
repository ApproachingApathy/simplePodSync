import { PrismaClient } from "@prisma/client";
import { config } from "../configuration/configuration";

export const db = new PrismaClient({
    datasources: {
        db: {
            url: config.database.url
        }
    }
});
