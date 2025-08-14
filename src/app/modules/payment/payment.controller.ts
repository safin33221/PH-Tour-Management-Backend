/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { envVars } from "../../config/env";

import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import { catchAsync } from "../../utils/CatchAsync";
import httpStatus from "http-status-codes";
import { SLLService } from "../sslCommerz/sslCommerz.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId
    const result = await PaymentService.initPayment(bookingId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Payment successfully',
        data: result,

    })

});
const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.successPayment(query as Record<string, string>)
    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`)
    }

});
const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.failPayment(query as Record<string, string>)
    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`)
    }

});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.cancelPayment(query as Record<string, string>)
    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`)
    }

});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
    console.log('ssl- commerze ipn:', req.body);

    const result = await SLLService.validatedPayment(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Payment validated successfully',
        data: null,

    })

});

export const PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    validatePayment
};