/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import { tourService } from "./tour.service";

import httpStatus from 'http-status-codes'
import { catchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";

const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload: ITour = {
        ...req.body,
        Images: (req.files as Express.Multer.File[])?.map(file => file.path)
    }
    const tour = await tourService.createTour(payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "tour Post successfully",
        data: tour


    })
})

const getAllTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query
    const result = await tourService.getAllTour(query as Record<string, string>)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "tour gets successfully",
        data: result.data,
        meta: result.meta


    })

})
const getSingleTour = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug
    const result = await tourService.getSingleTour(slug);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour retrieved successfully',
        data: result.data,
    });
});

const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id


    const payload: ITour = {
        ...req.body,
        Images: (req.files as Express.Multer.File[])?.map(file => file.path)
    }
    const result = await tourService.updateTour(id, payload)

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





const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await tourService.getSingleTourType(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type retrieved successfully',
        data: result,
    });
});


const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await tourService.getAllTourTypes(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
});


const createTourType = catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await tourService.createTourType(name);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await tourService.updateTourType(id, name);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
});
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await tourService.deleteTourType(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
});

export const tourController = {
    createTour,
    getAllTour,
    getSingleTour,
    updateTour,
    deleteTour,
    getSingleTourType,
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType
}