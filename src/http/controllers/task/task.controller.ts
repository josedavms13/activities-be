import {IReq} from "../controllers.types";
import {Response} from "express";
import {taskValidation} from "./requestValidation";
import {createTask} from "./operations/task.post.operations";
import {getLogger} from "../../../helpers/logger";
import Joi from "joi";
import {getAllTask, getTaskById} from "./operations/task.get.operationts";
import {ITaskAttributes} from "../../DB/models/Task";

const logger = getLogger("Activities | Controller");

export async function createTaskControl(
   req: IReq<ITaskAttributes>, res: Response) {
   const valid = taskValidation(req.body);
   if (!valid.error) {
      await createTask(valid.value, res);
   } else {
      logger.warn("Bad Request: " + valid.error);
      res.status(400).json({
         message: "Bad Request",
         errors: valid,
      });
   }
}

export async function getAllTaskControl(req: any, res: Response) {
   const {id} = req.query;
   const valid = Joi.number().optional().validate(id);
   if (!valid.error) {
      if (id) {
         await getTaskById(id, res);
         return;
      }
      await getAllTask(res);
   } else {
      logger.warn("Bad Request: " + valid.error);
      res.status(400).json({
         message: "Bad Request",
         errors: valid,
      });
   }
}

