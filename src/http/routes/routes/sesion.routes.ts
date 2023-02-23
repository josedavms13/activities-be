import {Router} from "express";
import {isActiveSession, loadActivity, startActivity}
   from "../../controllers/sesion/sesion.controller";

// eslint-disable-next-line new-cap
const router = Router();
router.get("/load", loadActivity);
router.get("/start", startActivity);
router.get("/active-session", isActiveSession);

export default router;
