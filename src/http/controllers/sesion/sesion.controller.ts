import {Session} from "../../../domain/Session/Session";
import {httpServer} from "../../../index";
import {
   getActivityById,
} from "../activities/operations/activities.get.operationts";


let session: Session | null = null;
export async function startControl(req: any, res: any) {
   const activity = await getActivityById(1);
   if (activity.success) {
      if (!session) {
         session = new Session(httpServer, activity.dbData);
      }
      const sessionStarted = session.join();
      if (sessionStarted) {
         res.status(201).json("Session started");
      } else {
         res.status(200).json("There is an open session");
      }
   } else {
      res.status(404).json("Not activity found");
   }
}
