import winston, { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: "DD-MM-YYY HH:MM:ss" }),
    format.printf((info) => {
      return `${[info.timestamp]} : ${[info.level]} : ${[info.message]}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "blue",
});

export default logger;
