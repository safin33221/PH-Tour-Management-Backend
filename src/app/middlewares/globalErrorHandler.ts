/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/AppError"


export const globalErrorhandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    let statusCode = 500
    let message = `something went wrong !!`

    if (err.code === 11000) {
        const matchArray = err.message.match(/"([^"]*)"/)

        statusCode = 400;
        message = `${matchArray[1]} already exist`

    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}