import {tIOServer} from "../../types/ioServer.types";
import {Activity} from "../../http/DB/models/Activity";
import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {getLogger} from "../../helpers/logger";
import {Timer} from "./timer/Timer";
// eslint-disable-next-line max-len
import {
   closeActivityDB,
   stopActivityDB,
} from "../../http/controllers/activities/operations/activities.put.operations";
import {closeSession} from "../../http/controllers/sesion/sesion.controller";
import {getTimeFromSeconds} from "../utils/timeConverters";

const logger = getLogger("Session");

export class Session {
   private isSessionOpen: boolean = false;
   private _isSessionStarted: boolean = false;
   private _isSessionPaused: boolean = true;
   private readonly ioServer: tIOServer;
   private activity: Activity | undefined;
   private hours: number = 0;
   private minutes: number = 0;
   private seconds: number = 0;
   private pauses: number | undefined;

   private readonly io: Server<
      DefaultEventsMap, DefaultEventsMap
   > | undefined;
   private timer: Timer | null | undefined;
   private readonly roomName: string;

   constructor(ioServer: tIOServer, activity: Activity) {
      this.ioServer = ioServer;
      this.activity = activity;
      this.setTimeVariables();
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
         socket.on("stopActivity", () => this.stopActivity());
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
                  .emit("activityCompleted");
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
      this._isSessionPaused = false;
      this.timer?.start();
   }

   private pause() {
      if (!this._isSessionPaused) {
         if (this.pauses! > 0) {
            logger.log("Pausing");
            this.io?.to(this.roomName)
               .emit("pauseTimerConfirmation",
                  {remainingPauses: this.pauses!--});
            this.timer?.pause();
            this._isSessionPaused = true;
         } else {
            logger.log("No pauses left");
            this.io?.to(this.roomName)
               .emit("noPausesLeft");
         }
      } else {
         this.io?.to(this.roomName)
            .emit("sessionStillPaused");
      }
   }

   private stopActivity() {
      logger.log("Stopping");
      stopActivityDB(this.activity!.id,
         this.timer!.remainingSeconds,
         this.pauses!)
         .then((data) => {
            logger.log("Activity stopped");
            logger.log(`Stop status: ${ data.success }`);
            closeSession();
         });
      this.timer?.stop();
      this.closeServer();
   }

   private complete() {
      closeActivityDB(this.activity!.id, true)
         .then((data) => {
            logger.log("Activity stopped");
            logger.log(data.success);
            closeSession();
         });
      this.timer?.stop();
      logger.log("Completing");
      this.closeServer();
   }

   private resume() {
      console.log("Resuming");
      this._isSessionPaused = false;
      this.timer?.resume();
   }

   private closeServer() {
      logger.log("Closing server");
      this.io?.to(this.roomName).emit("closeConnection");
      this.io?.removeAllListeners();
   }

   private setTimeVariables() {
      if (this.activity!.hasOpenSession) {
         logger.log("This activity is open");
         const [hours, minutes, seconds] =
            getTimeFromSeconds(this.activity!.missingSeconds);
         logger.log(`Time set to \n H: ${ hours }, 
         M: ${ minutes }\n, S:${ seconds }`);
         this.seconds = seconds;
         this.hours = hours;
         this.minutes = minutes;
      } else {
         this.hours = this.activity!.hours;
         this.minutes = this.activity!.minutes;
         this.pauses = this.activity!.allowedPauses;
      }
   }

   get isSessionStarted(): boolean {
      return this._isSessionStarted;
   }
}
