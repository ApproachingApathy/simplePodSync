import { createLogger, format, transports, config } from "winston"

export const logger = createLogger({
    level: "debug",
    format: format.combine(format.errors(), format.json()),
    defaultMeta: {
        service: "simplePodSync"
    },
    transports: [
        new transports.File({ dirname: Bun.env.LOG_DIR, filename: "error.log", level: "error" }),
        new transports.File({ dirname: Bun.env.LOG_DIR, filename: "combined.log", level: "info" }),
        new transports.Console({ format: format.combine(format.timestamp(),  format.prettyPrint()), level: "" })
    ]
})