import {Session} from "../../../domain/Session/Session";
import {httpServer} from "../../../index";
import {getActivityById}
   from "../activities/operations/activities.get.operationts";
import {getValuesFromDBOperations}
   from "../../../helpers/utils/SequelizeDataUtils";
import {getLogger}
   from "../../../helpers/logger";
import {markActivityAsStarted}
   from "../activities/operations/activities.put.operations";

const logger = getLogger("Session | Controller");

let session: Session | null = null;
let sessionJoined: boolean = false;
let sessionId: number | null = null;

export async function loadActivity(req: any, res: any) {
   const id = req.query.id;
   if (!id) {
      return res.status(400).json({error: "id is required"});
   }
   const activity = await getActivityById(id);
   if (activity.success) {
      sessionId = id;
      if (!session) {
         session = new Session(httpServer, activity.dbData);
      }
      sessionJoined = session.join();
      if (sessionJoined) res.status(200).json(`Activity ${ id } loaded`);
      else {
         res.status(404).json({
            error: "Error at loading activity, Server instance failed to load",
         });
      }
   } else {
      res.status(404).json("Not activity found");
   }
}

export async function startActivity(req: any, res: any) {
   if (!sessionId) {
      return res.status(400).json({error: "Session is not loaded"});
   }
   const activity = getValuesFromDBOperations(
      await getActivityById(sessionId!),
   )![0];
   if (session!.isSessionStarted) {
      // activity.hasOpenSession = true;
      // const savedActivity = await activity.save();
      const savedActivity = await markActivityAsStarted(activity.id);
      res.status(201).json({
         message: "Session started",
         activity: getValuesFromDBOperations(savedActivity),
      });
      logger.success("Session started in DB");
   } else {
      res.status(200).json("There is an open session");
   }
}
