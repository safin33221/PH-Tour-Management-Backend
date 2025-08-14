import { Booking } from "../booking/booking.model"
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
    return {

    }
}

const getPaymentStats = async () => {

    return
}






export const StatsService = {
    getBookingStats,
    getPaymentStats,
    getTourStats,
    getUserStats
}