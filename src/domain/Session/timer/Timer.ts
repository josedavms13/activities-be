export class Timer {
   private _hour: number;
   private _minutes: number;
   private _seconds: number;
   private interval: NodeJS.Timer | undefined;
   private _isPaused: boolean = false;
   private _isStopped: boolean = false;
   private _started: boolean = false;
   private readonly _secondCallback: (() => void) | undefined;

   constructor(
      hour: number, minutes: number, seconds: number, callback?: () => void) {
      this._hour = hour > 0 ? hour - 1 : 0;
      this._minutes = minutes > 0 ? minutes - 1 : 59;
      this._seconds = seconds > 0 ? seconds - 1 : 59;
      this._secondCallback = callback;
   }

   public start() {
      if (!this._started && !this._isStopped) this._started = true;
      this._isStopped = false;
      this.interval = setInterval(() => {
         this.secondPassed();
      }, 1000);
   }

   public resume() {
      if (!this._isStopped) {
         this._isPaused = false;
         this.start();
      }
   }

   public pause(): void {
      this._isPaused = true;
      clearInterval(this.interval);
   }

   public stop() {
      this._isStopped = true;
      clearInterval(this.interval);
   }

   private secondPassed(): void {
      if (this._seconds - 1 >= 0) {
         this._seconds -= 1;
      } else {
         this._seconds = 59;
         this.minutePassed();
      }
      if (this._secondCallback) this._secondCallback();
   }

   private minutePassed(): void {
      if (this._minutes - 1 > 0) {
         this._minutes -= 1;
      } else {
         this._minutes = 59;
         this.hourPassed();
      }
   }

   private hourPassed(): void {
      if (this._hour - 1 > 0) {
         this._hour -= 1;
      } else {
         this.stop();
      }
   }

   get isStopped(): boolean {
      return this._isStopped;
   }

   get isPaused(): boolean {
      return this._isPaused;
   }

   get isStarted(): boolean {
      return this._started;
   }

   get timer(): string {
      return `${ this._hour }:${ this._minutes }:${ this._seconds }`;
   }
}
