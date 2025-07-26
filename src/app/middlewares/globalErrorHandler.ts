/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"

import mongoose, { TreatAsPrimitives } from "mongoose"
import { envVars } from "../config/env";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { IErrorSource } from "../interfaces/error.type";
import { handleValidationError } from "../helpers/handleValidationError";
import AppError from "../errorHelpers/AppError";


export const globalErrorhandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {

        console.log(err);
    }
    let errorSources: IErrorSource[] = []
    let statusCode = 500
    let message = `something went wrong !!`



    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message

    }
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)

        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as IErrorSource[]

    }
    else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as IErrorSource[]
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
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}