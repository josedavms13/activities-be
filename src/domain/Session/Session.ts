import {tIOServer} from "../../types/ioServer.types";
import {Activity} from "../../http/DB/models/Activity";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {getLogger} from "../../helpers/logger";
import {Timer} from "./timer/Timer";

const logger = getLogger("Session");

export class Session {
   private readonly ioServer: tIOServer;
   private activity: Activity | undefined;
   private readonly hours: number = 0;
   private readonly minutes: number = 59;
   private userId: string | undefined;
   private seconds: number = 59;
   private readonly pauses: number | undefined;
   private io: Server<
      DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any
   > | undefined;

   constructor(ioServer: tIOServer, activity: Activity) {
      this.ioServer = ioServer;
      this.activity = activity;
      this.hours = activity.hours;
      this.minutes = activity.minutes;
      this.pauses = activity.allowedPauses;
   }

   public start() {
      let timer: Timer;
      this.io = new Server(this.ioServer, {cors: {origin: "*"}});
      logger.log("Starting webSocket server");
      // // ---------- SOCKET INITIALIZATION ---------- ////
      this.io.on("connect", (socket) => {
         this.userId = socket.id;
         socket.emit("connectionCheck", {message: "User connected"});
         logger.log(`New connection, ${ this.userId }`);
         timer = new Timer(this.hours, this.minutes!, this.seconds, () => {
            let i = 0;
            console.log("Emitting time" + i++);
            socket.emit("timer", {timer: timer.timer});
         });
         timer.start();
      });
      console.log("wait");
   }

   private pause() {
      logger.log("Time pause");
      if (this.pauses) {

      }
   }

   private sessionFailed() {
      this.activity?.sayThings();
   }
}
