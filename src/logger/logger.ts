import { createLogger, format, transports } from "winston";
import { config } from "../configuration/configuration";

export const logger = createLogger({
  level: "debug",
  format: format.combine(format.errors(), format.json()),
  defaultMeta: {
    service: "simplePodSync",
  },
  transports: [
    new transports.File({
      dirname: config.log_dir,
      filename: "error.log",
      level: "error",
    }),
    new transports.File({
      dirname: config.log_dir,
      filename: "combined.log",
      level: "info",
    }),
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.prettyPrint({ colorize: true }),
      ),
      level: "",
    }),
  ],
});
