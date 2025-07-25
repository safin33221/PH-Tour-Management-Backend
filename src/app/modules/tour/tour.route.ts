import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()





router.get('/', tourController.getAllTour)

router.post('/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    tourController.createTour
)

router.patch('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    tourController.updateTour
)


router.delete('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    tourController.deleteTour
)

export const tourRoute = router;