import {Router} from "express";
import {googleCallback, loginViaEmail, loginViaOIDC, registerViaEmail} from "../controllers/auth.ts";


const router = Router();

router.get("/login/google", loginViaOIDC);
router.get("/google/callback", googleCallback);
router.post("/register/email", registerViaEmail);
router.post("/login/email", loginViaEmail);

export default router;