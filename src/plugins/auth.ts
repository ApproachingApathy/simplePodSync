import cookie from "@elysiajs/cookie";
import Elysia from "elysia";
import { db } from "../db/db";

const SESSION_ID_COOKIE_NAME = "sessionid"

export const authPlugin = (app: Elysia) => app
    .use(cookie())
    .derive(async ({ cookie }) => {
        if (!cookie[SESSION_ID_COOKIE_NAME]) return { session: undefined }
        const session = await db.session.findFirst({
            where: {
                id: cookie[SESSION_ID_COOKIE_NAME],
                expiresAt: {
                    gt: new Date()
                },
                invalidated: false

            },
            orderBy: {
                expiresAt: "desc"
            },
            include: {
                user: true
            }
        })

        return {
            session: session ?? undefined
        }
    })