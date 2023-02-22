import {IReq} from "../controllers.types";
import {IActivityAttributes} from "../../DB/models/Activity";
import {Response} from "express";
import {activityValidation, updateActivityDurationValidation} from "./requestValidation";
import {createActivity} from "./operations/acitivities.post.operations";
import {getLogger} from "../../../helpers/logger";
import {
   getActivityById,
   getAllActivities, getOpenActivities,
} from "./operations/activities.get.operationts";
import Joi from "joi";
import {modifyActivityDuration} from "./operations/activities.put.operations";

const logger = getLogger("Activities | Controller");

export async function createActivityControl(
   req: IReq<IActivityAttributes>, res: Response) {
   const valid = activityValidation(req.body);
   if (!valid.error) {
      await createActivity(valid.value, res);
   } else {
      logger.warn("Bad Request: " + valid.error);
      res.status(400).json({
         message: "Bad Request",
         errors: valid,
      });
   }
}

export async function getAllActivityControl(req: any, res: Response) {
   const {id} = req.query;
   const valid = Joi.number().optional().validate(id);
   if (!valid.error) {
      if (id) {
         await getActivityById(id, res);
         return;
      }
      await getAllActivities(res);
   } else {
      logger.warn("Bad Request: " + valid.error);
      res.status(400).json({
         message: "Bad Request",
         errors: valid,
      });
   }
}

export async function getOpenActivitiesControl(req: any, res: Response) {
   try {
      await getOpenActivities(res);
   } catch (err) {
      logger.error(err);
      res.status(500).json({
         message: "Internal Server Error",
      });
   }
}

export async function modifyActivityDurationControl(req: any, res: Response) {
   const valid = updateActivityDurationValidation(req.body);
   if (!valid.error) {
      try {
         const {id, hours, minutes} = valid.value;
         await modifyActivityDuration(id, hours, minutes, res);
      } catch (err) {
         logger.error(err);
         res.status(500).json({
            message: "Internal Server Error",
            data: err,
         });
      }
   } else {
      logger.warn("Bad Request: " + valid.error);
      res.status(400).json({
         message: "Bad Request",
         errors: valid,
      });
   }
}
