import Joi, {ValidationResult} from "joi";
import {ITaskAttributes} from "../../DB/models/Task";

export function taskValidation(data: any)
   : ValidationResult<ITaskAttributes> {
   const activitySchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      taskPoints: Joi.number().required().min(0).max(10),
      activityId: Joi.number().required(),
   });
   return activitySchema.validate(data);
}
