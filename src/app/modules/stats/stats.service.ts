/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model"
import { PAYMENT_STATUS } from "../payment/payment.interface"
import { Payment } from "../payment/payment.model"
import { Tour } from "../tour/tour.model"
import { IsActive } from "../user/user.interface"
import { User } from "../user/user.model"

const now = new Date()
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30)

const getUserStats = async () => {
    const totalUserPromise = User.countDocuments()
    const activeUserPromise = User.countDocuments({ isActive: IsActive.ACTIVE })
    const inActiveUserPromise = User.countDocuments({ isActive: IsActive.INACTIVE })
    const blockedUserPromise = User.countDocuments({ isActive: IsActive.BLOCKED })

    const newUserInLastSevenDaysPromise = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const newUserInLastThirtyDaysPromise = User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })

    const userByRolePromise = User.aggregate([
        //stage 1 : Grouping User role and count total user in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }

    ])

    const [
        totalUser,
        activeUser,
        inActiveUser,
        blockedUser,
        newUserInLastSevenDays,
        newUserInLastThirtyDays,
        userByRole

    ] = await Promise.all([

        totalUserPromise,
        activeUserPromise,
        inActiveUserPromise,
        blockedUserPromise,
        newUserInLastSevenDaysPromise,
        newUserInLastThirtyDaysPromise,
        userByRolePromise
    ])
    return {
        totalUser,
        activeUser,
        inActiveUser,
        blockedUser,
        newUserInLastSevenDays,
        newUserInLastThirtyDays,
        userByRole
    }
}

const getTourStats = async () => {
    const totalTourPromise = Tour.countDocuments()
    const totalTourTypePromise = Tour.aggregate([
        //connect tour type model - lookup stage;
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"

            }
        },
        {
            $unwind: "$type"
        },
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 }
            }
        }
    ])
    const avgTourCostPromise = Tour.aggregate([
        //stage 1: group the cost from and average the sum
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costFrom" }
            }
        }
    ])

    const totalTourByDivisionPromise = Tour.aggregate([
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division"
            }
        },
        {
            $unwind: "$division"
        },
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 }
            }
        }
    ])

    const totalHeightBookedTourPromise = Booking.aggregate([
        //stage-1 Group the tour
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        //state-2 : sorting the tour
        {
            $sort: { bookingCount: -1 }
        },
        // stage - 3: set the limit
        {
            $limit: 5
        },
        //lookup the tour
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] }
                        }
                    }
                ],
                as: "tour"
            }
        },
        //Unwind stage
        { $unwind: "$tour" },
        //Project 
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    const [
        totalTour,
        totalTourTypes,
        avgCostFrom,
        totalTourByDivision,
        totalHeightBookedTour

    ] = await Promise.all([
        totalTourPromise,
        totalTourTypePromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        totalHeightBookedTourPromise
    ])
    return {
        totalTour,
        totalTourTypes,
        avgCostFrom,
        totalTourByDivision,
        totalHeightBookedTour
    }
}

const getBookingStats = async () => {
    const totalBookingPromise = Booking.countDocuments()

    const totalBookingByStatusPromise = Booking.aggregate([
        //stage1: group the booking 
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    const bookingPerTourPromise = Booking.aggregate([
        //state 1 : group by tour
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        //sort stage;
        {
            $sort: { bookingCount: -1 }
        },

        //limit stage 
        {
            $limit: 10
        },
        // stage 4 - lookup stage

        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },
        //stage 5 : unwind
        {
            $unwind: "$tour"
        },

        // stage : 6
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    const avgGuestCountPerBookingPromise = Booking.aggregate([
        // group by guest count
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ])


    const bookingLastSevenDaysPromise = Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const bookingLastThirtyDaysPromise = Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })

    const totalBookingByUniqueUserPromise = Booking.distinct("user").then((user: any) => user.length)

    const [
        totalBooking,
        totalBookingByStatus,
        bookingPerTour,
        avgGuestCountPerBooking,
        bookingLastSevenDays,
        bookingLastThirtyDays,
        totalBookingByUniqueUser
    ] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingLastSevenDaysPromise,
        bookingLastThirtyDaysPromise,
        totalBookingByUniqueUserPromise


    ])
    return {
        totalBooking,
        totalBookingByStatus,
        bookingPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        bookingLastSevenDays,
        bookingLastThirtyDays,
        totalBookingByUniqueUser
    }
}

const getPaymentStats = async () => {
    const totalPaymentPromise = Payment.countDocuments()
    const totalRevenuePromise = Payment.aggregate([
        //stage 1 - grouping by status
        {
            $match: { status: PAYMENT_STATUS.PAID }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ])

    const totalPaymentPaidStatusPromise = Payment.aggregate([
        // grouping

        {
            $group: {
                _id: "$status",
                total: { $sum: 1 }
            }
        }
    ])


    const avgPaymentAmountPromise = Payment.aggregate([
        //stage 1 - grouping by status

        {
            $group: {
                _id: null,
                avgPaymentAmount: { $avg: "$amount" }
            }
        }
    ])

    const paymentGatewayDataPromise = Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ])


    const [
        totalPayment,
        totalRevenue,
        totalPaymentPaidStatus,
        avgPaymentAmount,
        paymentGatewayData

    ] = await Promise.all([
        totalPaymentPromise,
        totalRevenuePromise,
        totalPaymentPaidStatusPromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise


    ])


    return {
        totalPayment,
        totalRevenue,
        totalPaymentPaidStatus,
        avgPaymentAmount,
        paymentGatewayData
    }
}






export const StatsService = {
    getBookingStats,
    getPaymentStats,
    getTourStats,
    getUserStats
}