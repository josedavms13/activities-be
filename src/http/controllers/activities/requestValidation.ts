import Joi, {ValidationResult} from "joi";
import {IActivityAttributes} from "../../DB/models/Activity";

export function activityValidation(data: any)
   : ValidationResult<IActivityAttributes> {
   const activitySchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      hours: Joi.number().required(),
      minutes: Joi.number().required(),
      allowedPauses: Joi.number().required(),
   });
   return activitySchema.validate(data);
}

export function updateActivityDurationValidation(data: any)
   : ValidationResult<IActivityUpdateAttributes> {
   const activitySchema = Joi.object({
      id: Joi.number().required(),
      hours: Joi.number().required(),
      minutes: Joi.number().required(),
   });
   return activitySchema.validate(data);
}
export interface IActivityUpdateAttributes {
   id: number,
   hours: number,
   minutes: number,
}
