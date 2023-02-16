import {getLogger} from "../../../../helpers/logger";
import {Response} from "express";
import {tDBOperationOutput} from "../../controllers.types";
import {Activity} from "../../../DB/models/Activity";


const logger = getLogger("Activities | Operations | Gets");

export async function getAllActivities(res?: Response)
   : Promise<tDBOperationOutput<Activity[]>> {
   logger.log("Getting all activities");
   try {
      const activities = await Activity.findAll({
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
      });
      if (activity) {
         res?.status(200).json(activity);
         return {
            resStatus: 200,
            dbData: activity,
            success: true,
         };
      } else {
         logger.error(`Activity with id ${ id } does not exist`);
         res?.status(404).json({
            message: `Activity with id ${ id } does not exist`,
         });
         return {
            resStatus: 404,
            dbData: null,
            success: false,
            message: `Activity with id ${ id } does not exist`,
         };
      }
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

