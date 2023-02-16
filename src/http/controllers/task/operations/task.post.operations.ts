import {getLogger} from "../../../../helpers/logger";
import {Response} from "express";
import {tDBOperationOutput} from "../../controllers.types";
import {ITaskAttributes, Task} from "../../../DB/models/Task";
import {getActivityById}
   from "../../activities/operations/activities.get.operationts";

const logger = getLogger("Task | Operations | Post");

export async function createTask(
   attributes: ITaskAttributes, res?: Response,
): Promise<tDBOperationOutput<Task>> {
   logger.log("Creating task");
   const existingActivity = await getActivityById(attributes.activityId);
   if (existingActivity.success) {
      try {
         const createdTask = await Task.create({
            name: attributes.name,
            description: attributes.description,
            taskPoints: attributes.taskPoints,
            activityId: attributes.activityId,
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
      res?.status(404).json(existingActivity.message);
      return {
         success: false,
         resStatus: 404,
         message: "Activity  found",
      };
   }
}

