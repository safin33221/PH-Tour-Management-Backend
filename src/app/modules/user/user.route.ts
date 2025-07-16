/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import z, { AnyZodObject, object } from "zod";
import { createUserSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from "../../../errorHelpers/AppError";
import { Role } from "./user.interface";
import { verifyToken } from "../../../utils/jwt";
import { envVars } from "../../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";



const router = Router()
router.post("/register", validateRequest(createUserSchema), UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN,Role.SUPER_ADMIN), UserControllers.getAllUsers)

export const userRoutes = router  