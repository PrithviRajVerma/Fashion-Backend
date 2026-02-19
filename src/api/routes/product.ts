import {Router} from "express";
import {authenticate} from "../middlewares/jwtMiddleware.ts";
import {requiredRole} from "../middlewares/authMiddleware.ts";

import {addProduct} from "../controllers/admin/product.ts";



const router = Router();

router.post("/add",authenticate,requiredRole(["ADMIN"]),addProduct);

export default router;