/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"
import { catchAsync } from "../../utils/CatchAsync"
import httpStatus from 'http-status-codes';
import { otpService } from "./otp.service";

const sendOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body
    await otpService.sendOtp(email, name)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP send successfully",
        data: null,


    })
})

const verifyOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body
    await otpService.verifyOtp(email, otp)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP verified",
        data: null


    })
})

export const otpController = {
    sendOtp,
    verifyOtp
}
