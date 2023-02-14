import {getLogger} from "../../../../helpers/logger";
import {Response} from "express";
import {tDBOperationOutput} from "../../controllers.types";
import {Activity} from "../../../DB/models/Activity";
import {Task} from "../../../DB/models/Task";


const logger = getLogger("Activities | Operations | Gets");

export async function getAllTask(res?: Response)
   : Promise<tDBOperationOutput<Activity[]>> {
   logger.log("Getting all activities");
   try {
      const activities = await Task.findAll();
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

export async function getTaskById(id: number, res?: Response)
   : Promise<tDBOperationOutput<Activity>> {
   logger.log("Getting activity by id " + id);
   try {
      const activity = await Task.findByPk(id);
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

