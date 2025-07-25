/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/CatchAsync";
import { tourService } from "./tour.service";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from 'http-status-codes'

const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourService.createTour(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "tour Post successfully",
        data: tour


    })
})


export const tourController = {
    createTour
}