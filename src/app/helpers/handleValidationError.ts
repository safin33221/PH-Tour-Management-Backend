/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose"
import { IErrorSource, TGenericErrorResponse } from "../interfaces/error.type"

export const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const errorSources: IErrorSource[] = []

    const errors = Object.values(err.errors)

    errors.forEach((errorObject: any) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message
    }))

    return {

        statusCode: 400,
        message: "validation Error",
        errorSources
    }

}