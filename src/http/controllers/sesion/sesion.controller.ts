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
import {Activity} from "../../DB/models/Activity";
import {tDBOperationOutput} from "../controllers.types";

const logger = getLogger("Session | Controller");

let session: Session | null = null;
let sessionJoined: boolean = false;
let sessionId: number | null = null;
let activity: tDBOperationOutput<Activity> | null = null;

export async function loadActivity(req: any, res: any) {
   const id = req.query.id;
   if (!id) {
      return res.status(400).json({error: "id is required"});
   }
   if (activity === null) {
      activity = await getActivityById(id);
      if (activity.success) {
         sessionId = id;
         if (!session) {
            session = new Session(httpServer, activity.dbData);
         }
         sessionJoined = session.join();
         if (sessionJoined) res.status(200).json(`Activity ${ id } loaded`);
         else {
            res.status(404).json({
               error:
                  "Error at loading activity, Server instance failed to load",
            });
         }
      } else {
         res.status(404).json("Not activity found");
      }
   } else {
      res.status(200).json({message: "There is an active activity"});
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

export function closeSession() {
   session = null;
   sessionJoined = false;
   sessionId = null;
   activity = null;
   logger.log({session});
   logger.log({sessionJoined});
   logger.log({sessionId});
   logger.log({activity});
   logger.success("Session closed");
}


