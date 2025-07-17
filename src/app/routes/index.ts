import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";

export const router = Router()
const modulesRoutes = [
    {
        path: "/user",
        route: userRoutes
    }, {
        path: "/auth",
        route: authRoute
    }
]

modulesRoutes.forEach((route) => {
    router.use(route.path, route.route)
})