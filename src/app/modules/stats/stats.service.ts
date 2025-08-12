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
    return {}
}

const getBookingStats = async () => {
    return {}
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