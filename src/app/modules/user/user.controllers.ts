/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { userServices } from "./user.service";
import { catchAsync } from "../../../utils/CatchAsync";
import { sendResponse } from "../../../utils/sendResponse";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.createUser(req.body)
    // res.status(httpStatus.CREATED).json({
    //     message: 'user created successfully',
    //     user
    // })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'user created successfully',
        data: users,

    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await userServices.getUser()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All users retrive  successfully',
        data: result.data,
        meta: result.meta

    })

})


export const UserControllers = {
    createUser,
    getAllUsers
}