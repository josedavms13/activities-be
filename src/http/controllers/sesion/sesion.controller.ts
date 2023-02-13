import {Session} from "../../../domain/Session/Session";
import {httpServer} from "../../../index";
import {
   getActivityById,
} from "../activities/operations/activities.get.operationts";


export async function startControl(req: any, res: any) {
   const activity = await getActivityById(1);
   if (activity.success) {
      const session = new Session(httpServer, activity.dbData);
      session.start();
      res.end();
   } else {
      res.status(404).json("Not activity found");
   }
}
