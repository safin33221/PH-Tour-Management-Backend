/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { UserControllers } from "./user.controllers";

import { createUserSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

import { Role } from "./user.interface";

import { checkAuth } from "../../middlewares/checkAuth";




const router = Router()
router.post("/register",
     validateRequest(createUserSchema),
     UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)


export const userRoutes = router    