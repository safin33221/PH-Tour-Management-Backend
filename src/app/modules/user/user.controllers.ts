/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { userServices } from "./user.service";

import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.createUser(req.body)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'user created successfully',
        data: users,

    })
})


const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const payload = req.body
    const verifiedToken = req.user as JwtPayload
    const users = await userServices.updateUser(userId, payload, verifiedToken)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'user Updated successfully',
        data: users,

    })
})




const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await userServices.getUser()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All users receive  successfully',
        data: result.data,
        meta: result.meta

    })

})



export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,


}