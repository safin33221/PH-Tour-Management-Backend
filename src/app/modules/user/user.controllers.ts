/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { userServices } from "./user.service";
import { catchAsync } from "../../../utils/CatchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { IUser, Role } from "./user.interface";
import AppError from "../../../errorHelpers/AppError";
import bcryptjs from 'bcryptjs'
import { envVars } from "../../../config/env";
import { User } from "./user.model";

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


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {


    const userExist = await User.findById(userId)
    if (!userExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }



    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")
        }
        if (decodedToken.role === Role.SUPER_ADMIN || decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")

        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SAULT_ROUND)
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    return newUpdateUser
}

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
    getAllUsers,
    updateUser
}