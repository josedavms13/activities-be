import {Router} from "express";
import {loadActivity, startActivity}
   from "../../controllers/sesion/sesion.controller";

// eslint-disable-next-line new-cap
const router = Router();
router.get("/load", loadActivity);
router.get("/start", startActivity);

export default router;
