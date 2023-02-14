import {getLogger} from "../../../../helpers/logger";
import {Response} from "express";
import {tDBOperationOutput} from "../../controllers.types";
import {Activity} from "../../../DB/models/Activity";
import {Task} from "../../../DB/models/Task";


const logger = getLogger("Activities | Operations | Gets");

export async function getAllActivities(res?: Response)
   : Promise<tDBOperationOutput<Activity[]>> {
   logger.log("Getting all activities");
   try {
      const activities = await Activity.findAll({
         include: [{
            model: Task,
         }],
      });
      res?.status(200).json(activities);
      return {
         resStatus: 200,
         dbData: activities,
         success: true,
      };
   } catch (err) {
      logger.error(err);
      res?.status(500).json(err);
      return {
         resStatus: 500,
         dbData: err,
         success: false,
         message: "Error occurred while getting all activities",
      };
   }
}

export async function getActivityById(id: number, res?: Response)
   : Promise<tDBOperationOutput<Activity>> {
   logger.log("Getting activity by id " + id);
   try {
      const activity = await Activity.findByPk(id, {
         include: [{model: Task}],
      });
      res?.status(200).json(activity);
      return {
         resStatus: 200,
         dbData: activity,
         success: true,
      };
   } catch (err) {
      logger.error(err);
      res?.status(500).json(err);
      return {
         resStatus: 500,
         dbData: err,
         success: false,
         message: "Error occurred while getting activity by id",
      };
   }
}

export async function existActivityById(id: number, res?: Response)
   : Promise<tDBOperationOutput<boolean>> {
   logger.log("Checking if activity exists by id " + id);
   try {
      const activity = await Activity.findOne({
         where: {id: id},
      });
      if (activity) {
         res?.status(200).json(true);
         return {
            resStatus: 200,
            dbData: true,
            success: true,
         };
      } else {
         res?.status(200).json(false);
         return {
            resStatus: 200,
            dbData: false,
            success: true,
         };
      }
   } catch (err) {
      logger.error(err);
      res?.status(500).json(err);
      return {
         resStatus: 500,
         dbData: err,
         success: false,
         message: "Error occurred while checking if activity exists by id",
      };
   }
}

