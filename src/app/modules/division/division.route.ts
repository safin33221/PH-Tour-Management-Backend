import { Router } from "express";
import { divisionController } from "./division.controller";

const router = Router()


router.post('/create', divisionController.createDivision)

export const divisionRoute = router
