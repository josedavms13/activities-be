import {tDBOperationOutput} from "../../controllers.types";
import {Activity, IActivityAttributes} from "../../../DB/models/Activity";
import {getLogger} from "../../../../helpers/logger";
import {Response} from "express";

const logger = getLogger("Activities | Operations | Gets");

export async function createActivity(
   attributes: IActivityAttributes, res?: Response,
): Promise<tDBOperationOutput<Activity>> {
   logger.log("Creating activity");
   try {
      const createdActivity = await Activity.create({
         name: attributes.name,
         description: attributes.description,
         hours: attributes.hours,
         minutes: attributes.minutes,
         allowedPauses: attributes.allowedPauses,
      });
      logger.success("Activity created successfully");
      res?.status(201).json(createdActivity);
      return {
         success: true,
         resStatus: 201,
         dbData: createdActivity,
      };
   } catch (e) {
      logger.warn("Bad request");
      return {
         success: false,
         resStatus: 500,
         message: "Error creating activity",
         dbData: e,
      };
   }
}

