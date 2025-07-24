import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { divisionRoute } from "../modules/division/division.route";

export const router = Router()
const modulesRoutes = [
    {
        path: "/user",
        route: userRoutes
    }, {
        path: "/auth",
        route: authRoute
    }
    , {
        path: "/division",
        route: divisionRoute
    }
]

modulesRoutes.forEach((route) => {
    router.use(route.path, route.route)
})