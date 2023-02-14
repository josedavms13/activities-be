import {Router} from "express";
import {
   createTaskControl,
   getAllTaskControl,
} from "../../controllers/task/task.controller";

// eslint-disable-next-line new-cap
const router = Router();
router.get("/", getAllTaskControl);
router.post("/create", createTaskControl);

export default router;
