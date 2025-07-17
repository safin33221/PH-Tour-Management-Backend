/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../../utils/CatchAsync"
import httpStatus from 'http-status-codes'
import { sendResponse } from "../../../utils/sendResponse"
import { User } from "../user/user.model"
import { authServices } from "./auth.service"
import AppError from "../../../errorHelpers/AppError"
import { setAuthCookie } from "../../../utils/setCookie"

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credentialLogin(req.body)
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    setAuthCookie(res, loginInfo)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'user Login successfully',
        data: loginInfo,

    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Refresh token received from cookies")
    }
    const tokenInfo = await authServices.getNewAccessToken(refreshToken as string)
    setAuthCookie(res, tokenInfo)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'user Login successfully',
        data: tokenInfo,

    })
})

export const authControllers = {
    credentialLogin,
    getNewAccessToken
}