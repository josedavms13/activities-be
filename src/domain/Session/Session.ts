import {tIOServer} from "../../types/ioServer.types";
import {Activity} from "../../http/DB/models/Activity";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {getLogger} from "../../helpers/logger";
import {Timer} from "./timer/Timer";

const logger = getLogger("Session");

export class Session {
   private isSessionStarted: boolean = false;
   private readonly ioServer: tIOServer;
   private activity: Activity | undefined;
   private readonly hours: number = 0;
   private readonly minutes: number = 59;
   private seconds: number = 59;
   private readonly pauses: number | undefined;

   private io: Server<
      DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any
   > | undefined;
   private timer: Timer | null | undefined;
   private readonly roomName: string;

   constructor(ioServer: tIOServer, activity: Activity) {
      this.ioServer = ioServer;
      this.activity = activity;
      this.hours = activity.hours;
      this.minutes = activity.minutes;
      this.pauses = activity.allowedPauses;
      this.io = new Server(this.ioServer, {cors: {origin: "*"}});
      this.roomName = activity.name;
      logger.log("Starting webSocket server");
   }

   public join(): boolean {
      this.io!.on("connect", (socket) => {
         socket.join(this.roomName);
         logger.log(`New connection, ${ socket.id }`);
         socket.emit("connectionCheck",
            {message: "User connected ",
               user: socket.id,
            });
         if (!this.timer) {
            this.timer = new Timer(
               this.hours, this.minutes!, this.seconds, () => {
                  this.io!.to(this.roomName)
                     .emit("timer", {timer: this.timer!.timer});
               });
            logger.log("Timer is ready");
         } else {
            logger.log("Time was already set");
         }
         socket.on("startTimer", () => this.start());
         socket.on("pauseTimer", () => this.pause());
         socket.on("resumeTimer", () => this.resume());
      });
      return this.isSessionStarted;
   }

   private start() {
      console.log("Starting session");
      this.timer?.start();
   }

   private pause() {
      console.log("Pausing");
      this.timer?.pause();
   }

   private resume() {
      console.log("Resuming");
      this.timer?.resume();
   }

   private sessionFailed() {
      this.activity?.sayThings();
   }
}
