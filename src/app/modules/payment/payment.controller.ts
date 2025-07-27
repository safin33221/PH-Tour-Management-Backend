/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { envVars } from "../../config/env";

import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import { catchAsync } from "../../utils/CatchAsync";

const initPayment = catchAsync(async (req: Request, res: Response) => {

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: '',
    });

});
const successPayment = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: '',
    });
});
const failPayment = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: '',
    });
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: '',
    });
});

export const PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};