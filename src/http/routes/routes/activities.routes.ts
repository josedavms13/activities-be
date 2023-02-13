import {Router} from "express";
import {createActivityControl}
   from "../../controllers/activities/activities.controller";

// eslint-disable-next-line new-cap
const router = Router();
router.post("/create", createActivityControl);

export default router;
