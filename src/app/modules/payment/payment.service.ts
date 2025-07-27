/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";


const initPayment = async (bookingId: string) => {
    return {}
};
const successPayment = async (query: Record<string, string>) => {
    return {}

};
const failPayment = async (query: Record<string, string>) => {

    return {}
};
const cancelPayment = async (query: Record<string, string>) => {

    return {}
};


export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};