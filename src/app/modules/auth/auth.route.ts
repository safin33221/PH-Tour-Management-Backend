/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router()
router.post('/login', authControllers.credentialLogin)
router.post('/refresh-token', authControllers.getNewAccessToken)
router.post('/logout', authControllers.logout)
router.post('/set-password', checkAuth(...Object.values(Role)), authControllers.setPassword)
router.post('/change-password', checkAuth(...Object.values(Role)), authControllers.changePassword)
router.post('/forgot-password', authControllers.forgotPassword)
router.post('/reset-password', checkAuth(...Object.values(Role)), authControllers.resetPassword)

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)

})

router.get('/google/callback', passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issus with your account. Please contact with our support team.` }), authControllers.googleCallback)

export const authRoute = router