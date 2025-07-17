/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../../utils/CatchAsync"
import httpStatus from 'http-status-codes'
import { sendResponse } from "../../../utils/sendResponse"
import { User } from "../user/user.model"
import { authServices } from "./auth.service"

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tokenInfo = await authServices.credentialLogin(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'user Login successfully',
        data: tokenInfo,

    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers.authorization
    const loginInfo = await authServices.getNewAccessToken(refreshToken as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'user Login successfully',
        data: loginInfo,

    })
})

export const authControllers = {
    credentialLogin,
    getNewAccessToken
}