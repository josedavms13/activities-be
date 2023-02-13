import {Router} from "express";
import {startControl} from "../../controllers/sesion/sesion.controller";

// eslint-disable-next-line new-cap
const router = Router();
router.get("/start", startControl);

export default router;
