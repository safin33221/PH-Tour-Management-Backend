/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { startSession } from "mongoose";
import { Booking } from "../booking/booking.model";
import { Payment } from "./payment.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { ISLLCommerz } from "../sslCommerz/SLLCommerz.interface";
import { SLLService } from "../sslCommerz/sslCommerz.service";


const initPayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId })
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found . Your have not booked this tour")
    }


    const booking = await Booking.findById(payment.booking)
        .populate("user", "name email phone address")


    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISLLCommerz = {
        name: userName,
        email: userEmail,
        address: userAddress,
        phoneNumber: userPhoneNumber,
        amount: payment.amount,
        transactionId: payment.transactionId
    }
    const sslPayment = await SLLService.SSLCommerzInit(sslPayload)

    return {
        paymentURL: sslPayment.GatewayPageURL
    }
};
const successPayment = async (query: Record<string, string>) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {



        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            status: PAYMENT_STATUS.PAID,


        }, { new: true, runValidators: true, session })
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETED },
                { runValidators: true, session }
            )


        await session.commitTransaction()
        session.endSession()
        return {
            success: true,
            message: "Payment completed successfully"
        }
    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }

};
const failPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession()
    session.startTransaction()

    try {



        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            status: PAYMENT_STATUS.FAILED,


        }, { new: true, runValidators: true, session })
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                { runValidators: true, session }
            )


        await session.commitTransaction()

        session.endSession()
        return {
            success: false,
            message: "Payment failed"
        }
    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
};
const cancelPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession()
    session.startTransaction()

    try {



        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            status: PAYMENT_STATUS.CANCEL,


        }, { new: true, runValidators: true, session })
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                { runValidators: true, session }
            )


        await session.commitTransaction()
        session.endSession()
        return {
            success: false,
            message: "Payment Cancel"
        }
    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
};


export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};