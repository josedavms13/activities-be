import {getLogger} from "../../../../helpers/logger";
import {tDBOperationOutput} from "../../controllers.types";
import {Activity} from "../../../DB/models/Activity";
import {Response} from "express";


const logger = getLogger("Activities | Operations| Puts");


export async function markActivityAsStarted(id: number, res?: Response)
   : Promise<tDBOperationOutput<Activity>> {
   logger.log("Marking activity " + id + " as started");
   try {
      const activity = await Activity.update({
         hasOpenSession: true,
      }, {
         where: {
            id,
         },
      });
      if (activity) {
         res?.status(200).json(activity);
         return {
            success: true,
            resStatus: 200,
            dbData: activity,
         };
      } else {
         res?.status(404).json(`Activity ${ id } not found`);
         return {
            success: false,
            resStatus: 404,
            dbData: null,
            message: `Activity ${ id } not found`,
         };
      }
   } catch (e) {
      res?.status(500).json(e);
      return {
         success: false,
         resStatus: 500,
         dbData: e,
         message: "Error while marking activity as started",
      };
   }
}

export async function stopActivityDB(
   id: number,
   pendingSeconds: number)
   : Promise<tDBOperationOutput<Activity>> {
   logger.log("Stopping activity " + id);
   const updatedActivity = await Activity.update({
      hasOpenSession: false,
      missingSeconds: pendingSeconds,
   }, {
      where: {
         id: id,
      },
   });
   if (updatedActivity) {
      logger.success("Activity " + id + " stopped");
      return {
         success: true,
         resStatus: 200,
         dbData: updatedActivity,
      };
   } else {
      logger.error("Activity " + id + " not found");
      return {
         success: false,
         resStatus: 404,
         message: "Activity " + id + " not found",
      };
   }
}

export async function closeActivityDB(
   id: number,
   isCompleted: boolean,
   res?: Response): Promise<tDBOperationOutput<Activity>> {
   logger.log("Closing activity " + id);
   const activity = await Activity.findOne({
      where: {id},
   });
   try {
      if (activity) {
         activity.completedCount =
            isCompleted ? activity.completedCount + 1 : 0;
         activity.failsCount = !isCompleted ? activity.failsCount + 1 : 0;
         activity.hasOpenSession = false;
         activity.missingSeconds = 0;
         const updatedActivity = await activity.save();
         logger.success("Activity " + id + " closed");
         return {
            success: true,
            resStatus: 200,
            dbData: updatedActivity,
         };
      } else {
         logger.error("Activity " + id + " not found");
         return {
            success: false,
            resStatus: 404,
            message: "Activity " + id + " not found",
         };
      }
   } catch (e) {
      res?.status(500).json(e);
      return {
         success: false,
         resStatus: 500,
         dbData: e,
         message: "Error while closing activity",
      };
   }
}

export async function modifyActivityDuration(
   id: number, hours: number, minutes: number, res?: Response)
   : Promise<tDBOperationOutput<Activity>> {
   logger.log("Modifying activity " + id);
   try {
      const updatedActivity = await Activity.update({
         hours,
         minutes,
      }, {
         where: {
            id,
         },
         returning: true,
      });
      logger.success("Activity " + id + " modified");
      res?.status(200).json(updatedActivity);
      return {
         success: true,
         resStatus: 200,
         dbData: updatedActivity,
      };
   } catch (e) {
      logger.error("Activity " + id + " not found", e);
      res?.status(404).json(e);
      return {
         success: false,
         resStatus: 404,
         message: "Activity " + id + " not found",
      };
   }
}
