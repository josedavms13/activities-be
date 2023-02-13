import {IReq} from "../controllers.types";
import {IActivityAttributes} from "../../DB/models/Activity";
import {Response} from "express";
import {activityValidation} from "./requestValidation";
import {createActivity} from "./operations/acitivities.post.operations";
import {getLogger} from "../../../helpers/logger";

const logger = getLogger("Activities | Controller");
export async function createActivityControl(
   req: IReq<IActivityAttributes>, res: Response) {
   const valid = activityValidation(req.body);
   if (!valid.error) {
      await createActivity(valid.value, res);
   } else {
      res.status(400).json({
         message: "Bad Request",
         errors: valid,
      });
   }
}
