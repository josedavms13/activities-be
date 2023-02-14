export function getSeconds(
   hours: number | null,
   minutes: number | null,
   seconds: number | null): number {
   const h = hours || 0;
   const m = minutes || 0;
   const s = seconds || 0;
   return (h * 3600) + (m * 60) + s;
}

export function getTimeFromSeconds(seconds: number): [number, number, number] {
   const h = Math.floor(seconds / 3600);
   const m = Math.floor((seconds % 3600) / 60);
   const s = Math.floor(seconds % 60);
   return [h, m, s];
}
