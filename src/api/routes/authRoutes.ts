import {Router} from "express";
import {loginViaEmail, loginViaOIDC, registerViaEmail} from "../controllers/auth.ts";


const router = Router();

router.get("/login/google", loginViaOIDC);
router.post("/register/email", registerViaEmail);
router.post("/login/email", loginViaEmail);

export default router;