import { Router } from "express";
import {login, register, addToHistory, getUserHistory} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js"; 

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(verifyToken, addToHistory)
router.route("/get_all_activity").get(verifyToken, getUserHistory)

export default router;  
