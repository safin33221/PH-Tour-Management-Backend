/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"

import httpStatus from 'http-status-codes'

import { authServices } from "./auth.service"

import { JwtPayload } from "jsonwebtoken"

import passport from "passport"
import { catchAsync } from "../../utils/CatchAsync"
import AppError from "../../errorHelpers/AppError"

import { createToken } from "../../utils/userTokens"
import { setAuthCookie } from "../../utils/setCookie"
import { sendResponse } from "../../utils/sendResponse"
import { envVars } from "../../config/env"

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authServices.credentialLogin(req.body)
    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError(401, err))
        }
        if (!user) {
            return next(new AppError(401, info.message))
        }
        const userToken = await createToken(user)
        setAuthCookie(res, userToken)

        const { password: pass, ...rest } = user.toObject()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'user Login successfully',
            data: {
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                user: rest
            },

        })
    })(req, res, next)


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
        message: 'New access token reterive successfully',
        data: tokenInfo,

    })
})
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'user logout successfully',
        data: null,

    })
})
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload

    await authServices.resetPassword(req.body, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password Reset  successfully',
        data: null,

    })
})
//http://localhost:5173/reset-password?id=687b7d0b5b40728dc6f01580&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdiN2QwYjViNDA3MjhkYzZmMDE1ODAiLCJlbWFpbCI6InNhZmF5ZXQ2OTcwQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzU0NzQwMzc2LCJleHAiOjE3NTQ3NDA5NzZ9.0YEw6P5igm3MMO32W-6CMSB0aXfTapC9w1XadSj_4AQ
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword
    await authServices.changePassword(oldPassword, newPassword, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'password Changed successfully',
        data: null,

    })
})
const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload
    const { password } = req.body
    await authServices.setPassword(decodedToken.userId, password)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password set successfully',
        data: null,

    })
})
const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const { email } = req.body
    await authServices.forgotPassword(email)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password forgot email send successfully',
        data: null,

    })
})


const googleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)

    }
    const user = req.user
    // console.log("User>>>>>>>>>", user);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found ")
    }
    const tokenInfo = await createToken(user)
    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})



export const authControllers = {
    credentialLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallback,
    changePassword,
    setPassword,
    forgotPassword
}