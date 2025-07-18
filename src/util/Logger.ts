import {
  createLogger,
  type Logger as WinstonLogger,
  transports,
  format,
} from "winston";

export enum LogTypes {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export class Logger {
  private handle: WinstonLogger;

  private constructor() {
    this.handle = createLogger();

    this.handle.add(
      new transports.Console({
        format: format.combine(
          format.colorize({ all: true }),
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.printf(({ timestamp, level, message, stack }) => {
            return `[${timestamp}] [${level}]: ${stack || message}`;
          }),
        ),
      }),
    );

    this.handle.add(
      new transports.File({
        filename: "logs/error.log",
        level: "error",
        format: format.combine(
          format.timestamp(),
          format.errors({ stack: true }),
          format.json(),
        ),
      }),
    );
  }

  private static instance: Logger;

  static getInstance(): Logger {
    if (!this.instance) this.instance = new Logger();
    return this.instance;
  }

  log(type: LogTypes, message: string, ...meta: unknown[]): Logger {
    this.handle.log(type as string, message, ...meta);
    return this;
  }

  debug(message: string, ...meta: unknown[]): Logger {
    return this.log(LogTypes.DEBUG, message, ...meta);
  }

  info(message: string, ...meta: unknown[]): Logger {
    return this.log(LogTypes.INFO, message, ...meta);
  }

  warn(message: string, ...meta: unknown[]): Logger {
    return this.log(LogTypes.WARN, message, ...meta);
  }

  error(message: string, ...meta: unknown[]): Logger {
    return this.log(LogTypes.ERROR, message, ...meta);
  }

  crit(message: string, ...meta: unknown[]): Logger {
    return this.log(LogTypes.ERROR, message, ...meta);
  }
}
