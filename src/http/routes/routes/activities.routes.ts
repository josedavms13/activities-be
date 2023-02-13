import {Router} from "express";
import {
   createActivityControl,
   getAllActivityControl,
} from "../../controllers/activities/activities.controller";

// eslint-disable-next-line new-cap
const router = Router();
router.get("/", getAllActivityControl);
router.post("/create", createActivityControl);

export default router;
