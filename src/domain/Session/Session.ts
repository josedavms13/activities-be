import {tIOServer} from "../../types/ioServer.types";
import {Activity} from "../../http/DB/models/Activity";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {getLogger} from "../../helpers/logger";

const logger = getLogger("Session");

export class Session {
   private readonly ioServer: tIOServer;
   private activity: Activity;
   private hours: number;
   private minutes: number;
   private seconds: number = 59;
   private pauses: number;
   private io: Server<
      DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any
   > | undefined;

   constructor(ioServer: tIOServer, activity: Activity) {
      this.ioServer = ioServer;
      this.activity = activity;
      this.hours = activity.hours;
      this.minutes = activity.minutes - 1;
      this.pauses = activity.allowedPauses;
   }

   public start() {
      // TODO: Fix cors in production
      this.io = new Server(this.ioServer, {cors: {origin: "*"}});

      this.io.on("connection", (socket) => {
         logger.log(`New connection, ${ socket.id }`);
      });
      this.io.on("timePause", (socket) => {
         this.pause();
         socket.emit("time paused");
      });
   }

   private pause() {
      logger.log("Time pause");
   }
}
