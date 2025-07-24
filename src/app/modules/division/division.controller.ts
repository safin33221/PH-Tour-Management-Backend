/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/CatchAsync";
import { divisionService } from "./division.service";
import httpStatus from 'http-status-codes'
import { sendResponse } from "../../../utils/sendResponse";

const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await divisionService.createDivision(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'division created successfully',
        data: division,

    })
})

const getAllDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await divisionService.getAllDivision()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Get all division data",
        data: result.data,
        meta: result.meta

    })
})




export const divisionController = {
    createDivision,
    getAllDivision
}