import {getLogger} from "../../../../helpers/logger";
import {Response} from "express";
import {tDBOperationOutput} from "../../controllers.types";
import {ITaskAttributes, Task} from "../../../DB/models/Task";
import {
   getValuesFromDBOperations,
} from "../../../../helpers/utils/SequelizeDataUtils";
import {
   getActivityById,
} from "../../activities/operations/activities.get.operationts";

const logger = getLogger("Task | Operations | Post");

export async function createTask(
   attributes: ITaskAttributes, res?: Response,
): Promise<tDBOperationOutput<Task>> {
   logger.log("Creating task");
   const existActivity = getValuesFromDBOperations(
      await getActivityById(attributes.activityId),
   )![0];
   if (existActivity) {
      try {
         const createdTask = await Task.create({
            name: attributes.name,
            description: attributes.description,
            taskPoints: attributes.taskPoints,
            activityId: existActivity.id,
         });
         logger.success("Task created successfully");
         res?.status(201).json(createdTask);
         return {
            success: true,
            resStatus: 201,
            dbData: createdTask,
         };
      } catch (e) {
         logger.warn("Bad request");
         res?.status(500).json(e);
         return {
            success: false,
            resStatus: 500,
            message: "Error creating task",
            dbData: e,
         };
      }
   } else {
      logger.warn("Bad request");
      res?.status(404).json("Activity not found");
      return {
         success: false,
         resStatus: 404,
         message: "Activity not found",
      };
   }
}

