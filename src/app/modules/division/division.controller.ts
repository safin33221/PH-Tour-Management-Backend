/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import { divisionService } from "./division.service";
import httpStatus from 'http-status-codes'
import { catchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from "./division.interface";


const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const division = await divisionService.createDivision(payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'division created successfully',
        data: division,

    })
})

const getAllDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await divisionService.getAllDivision(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Get all division data",
        data: result.data,
        meta: result.meta

    })
})
const getSingleDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug
    const result = await divisionService.getSingleDivision(slug)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Get all division data",
        data: result.data,


    })
})

const updateDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const updatedDivision = await divisionService.updateDivision(id, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "update division data Successfully",
        data: updatedDivision



    })
})

const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const result = await divisionService.deleteDivision(id)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Delete division  Successfully",
        data: null



    })
})




export const divisionController = {
    createDivision,
    getAllDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision
}