import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { divisionRoute } from "../modules/division/division.route";
import { tourRoute } from "../modules/tour/tour.route";

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
    , {
        path: "/tour",
        route: tourRoute
    }
]

modulesRoutes.forEach((route) => {
    router.use(route.path, route.route)
})