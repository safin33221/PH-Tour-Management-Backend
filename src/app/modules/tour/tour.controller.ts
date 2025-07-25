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

const getAllTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await tourService.getAllTour()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "tour gets successfully",
        data: result.tours,
        meta: result.meta


    })

})

const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const result = await tourService.updateTour(id, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "tour updated successfully",
        data: result


    })
})
const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id
    const result = await tourService.deleteTour(id)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "tour deleted successfully",
        data: result


    })
})


export const tourController = {
    createTour,
    getAllTour,
    updateTour,
    deleteTour
}