import {Router} from "express";
import {
   createActivityControl,
   getAllActivityControl, getOpenActivitiesControl, modifyActivityDurationControl,
} from "../../controllers/activities/activities.controller";

// eslint-disable-next-line new-cap
const router = Router();
router.get("/", getAllActivityControl);
router.get("/openSession", getOpenActivitiesControl);
router.post("/create", createActivityControl);
router.put("/duration", modifyActivityDurationControl);

export default router;
