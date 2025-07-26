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

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}



const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const user = await User.findById(userId)

    if (!user?.phone || !user?.address) {
        throw new AppError(httpStatus.BAD_REQUEST, "Please Update your profile to book a tour")
    }
    const transactionId = getTransactionId()

    const tour = await Tour.findById(payload.tour).select("costFrom")
    if (!tour?.costFrom) {
        throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found")
    }
    const amount = Number(tour.costFrom) * (Number(payload.guestCount) as number)
    const booking = await Booking.create({
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    })

    const payment = await Payment.create({
        booking: booking._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId,
        amount,

    })
    const updatedBooking = await Booking
        .findByIdAndUpdate(
            booking._id,
            { payment: payment._id },
            { new: true, runValidators: true }
        ).populate("user", "name email phone address")
        .populate("tour", "title costFrom")
        .populate("payment")
    return updatedBooking
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