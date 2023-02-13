import {Request, Response, Router} from "express";
import {getLogger} from "../../../helpers/logger";
import activitiesRoutes from "./activities.routes";

const logger = getLogger("ROUTES");

// eslint-disable-next-line new-cap
const router = Router();


router.use("/activities", activitiesRoutes);


// Out of Idle
router.get("/", (req: Request, res: Response) => {
   // Todo  Change when config file is ready
   // if (getEnvironment() === Environments.development) {
   logger.log("UNIDLE");
   res.status(200);
   res.end();
});

export default router;
