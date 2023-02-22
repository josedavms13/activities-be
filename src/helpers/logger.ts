import log4js, {Logger as LoggerType} from "log4js";

class Logger {
   private logger: LoggerType;

   constructor(category: string) {
      log4js.configure({
         appenders: {
            out: {type: "stdout"},
            app: {type: "file", filename: "application.log"},
         },
         categories: {
            default: {appenders: ["out"], level: "trace"},
            app: {appenders: ["app"], level: "trace"},
         },
      });
      this.logger = log4js.getLogger(category);
   }

   public log(message: string | any, args?: any) {
      this.logger.debug(message);
      if (args) {
         this.log(args);
      }
   }

   public error(message: string | any, args?: any) {
      this.logger.error(message);
      if (args) {
         this.error(args);
      }
   }

   public trace(message: any) {
      this.logger.trace(message);
   }

   public success(message: string) {
      // eslint-disable-next-line max-len
      this.logger.info(`\n \t \t \t =============== ${ message.toUpperCase() } ===============`);
   }

   public warn(message: string) {
      this.logger.warn(message);
   }
}

export function getLogger(category: string): Logger {
   return new Logger(category);
}
