/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import z, { AnyZodObject } from "zod";
import { createUserSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from "../../../errorHelpers/AppError";
import { Role } from "./user.interface";


const router = Router()
router.post("/register", validateRequest(createUserSchema), UserControllers.createUser)
router.get("/all-users", async (req: Request, res: Response, next: NextFunction) => {

    try {

        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new AppError(403, "No Token Received")
        }
        const verifyToken = jwt.verify(accessToken, "secret")

        if (!verifyToken) {

            throw new AppError(403, "You'r are not authorized")
        }
        if ((verifyToken as JwtPayload).role !== Role.ADMIN ) {
            throw new AppError(403, "You'r not permitted to view this route")
        }

        next()
    } catch (error) {
        next(error)
    }
}, UserControllers.getAllUsers)

export const userRoutes = router  