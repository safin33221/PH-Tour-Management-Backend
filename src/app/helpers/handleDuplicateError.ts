/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.type"

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const matchArray = err.message.match(/"([^"]*)"/)
    return {

        statusCode: 400,
        message: `${matchArray[1]} already exist`
    }
}