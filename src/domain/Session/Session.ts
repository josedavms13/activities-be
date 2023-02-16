import {tIOServer} from "../../types/ioServer.types";
import {Activity} from "../../http/DB/models/Activity";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {getLogger} from "../../helpers/logger";
import {Timer} from "./timer/Timer";
// eslint-disable-next-line max-len

const logger = getLogger("Session");

export class Session {
   private isSessionOpen: boolean = false;
   private _isSessionStarted: boolean = false;
   private readonly ioServer: tIOServer;
   private activity: Activity | undefined;
   private readonly hours: number = 0;
   private readonly minutes: number = 59;
   private seconds: number = 59;
   private readonly pauses: number | undefined;

   private readonly io: Server<
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
         this.setUpTimer();
         socket.emit("connectionCheck",
            {
               message: "User connected ",
               user: socket.id,
            });
         socket.on("startTimer", () => this.start());
         socket.on("pauseTimer", () => this.pause());
         socket.on("resumeTimer", () => this.resume());
         socket.on("stopTimer", () => this.stop());
         this._isSessionStarted = socket.connected;
      });
      return this.io !== null && this.io !== undefined;
   }

   private setUpTimer() {
      if (!this.timer) {
         logger.log("setting up timer");
         this.timer = new Timer(
            this.hours,
            this.minutes!,
            this.seconds,
            () => {
               this.io!.to(this.roomName)
                  .emit("timer", {timer: this.timer!.timer});
            },
            () => {
               this.io!.to(this.roomName)
                  .emit("activityFinished");
               this.complete();
            },
         );
         this.isSessionOpen = true;
         logger.log("Timer is ready");
      } else {
         logger.log("Timer was already set");
      }
   }
   private start() {
      logger.log("Starting session");
      this.timer?.start();
   }

   private pause() {
      logger.log("Pausing");
      this.timer?.pause();
   }

   private stop() {
      logger.log("Stopping");
      this.timer?.stop();
   }

   private complete() {
      logger.log("Completing");
   }

   private resume() {
      console.log("Resuming");
      this.timer?.resume();
   }

   get isSessionStarted(): boolean {
      return this._isSessionStarted;
   }
}
