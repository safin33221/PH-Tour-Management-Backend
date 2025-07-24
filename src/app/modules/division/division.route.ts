import { Router } from "express";
import { divisionController } from "./division.controller";

const router = Router()


router.get('/', divisionController.getAllDivision)
router.post('/create', divisionController.createDivision)

export const divisionRoute = router
