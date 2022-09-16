import {Router} from "express"
import { login,
    logout,
    refreshToken,
    register,
    confirmarOtp
} from "../controllers/auth.controller.js"

import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";

import {
    loginValidator,
    registerValidator,
    tokenCookieValidator,    
} from "../middlewares/validatorManager.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/confirmarOtp", confirmarOtp);
router.post("/login", loginValidator, login);
router.get("/refresh", tokenCookieValidator, requireRefreshToken, refreshToken);
router.get("/logout", logout);

export default router;