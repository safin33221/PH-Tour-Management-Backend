/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";

import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { SLLService } from "../sslCommerz/sslCommerz.service";
import { ISLLCommerz } from "../sslCommerz/SLLCommerz.interface";
import { getTransactionId } from "../../utils/getTransactionId";





const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId()

    const session = await Booking.startSession()
    session.startTransaction()
    try {
        const user = await User.findById(userId)
        if (!user?.phone || !user?.address) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please Update your profile to book a tour")
        }

        const tour = await Tour.findById(payload.tour).select("costFrom")
        if (!tour?.costFrom) {
            throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found")
        }
        const amount = Number(tour.costFrom) * (Number(payload.guestCount) as number)
        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }], { session })

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId,
            amount,

        }], { session })
        const updatedBooking = await Booking
            .findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session }
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment")
        const userAddress = (updatedBooking?.user as any).address
        const userEmail = (updatedBooking?.user as any).email
        const userPhoneNumber = (updatedBooking?.user as any).phone
        const userName = (updatedBooking?.user as any).name

        const sslPayload: ISLLCommerz = {
            name: userName,
            email: userEmail,
            address: userAddress,
            phoneNumber: userPhoneNumber,
            amount: amount,
            transactionId: transactionId
        }
        const sslPayment = await SLLService.SSLCommerzInit(sslPayload)
      
        await session.commitTransaction()
        session.endSession()
        return {
            paymentURL: sslPayment.GatewayPageURL,
            booking: updatedBooking
        }
    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }


};

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)

const getUserBookings = async () => {

    return {}
};

const getBookingById = async () => {
    return {}
};

const updateBookingStatus = async (

) => {

    return {}
};

const getAllBookings = async () => {

    return {}
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};