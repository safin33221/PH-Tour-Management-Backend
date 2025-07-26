import { NextFunction, Request, Response } from "express"
import { JwtPayload } from "jsonwebtoken"
import { User } from "../modules/user/user.model"
import httpStatus from 'http-status-codes'
import { IsActive } from "../modules/user/user.interface"
import AppError from "../errorHelpers/AppError"
import { verifyToken } from "../utils/jwt"
import { envVars } from "../config/env"
export const checkAuth = (...authRole: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {

        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new AppError(403, "No Token Received")
        }


        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
        req.user = verifiedToken

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "email does not exist")
        }
        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `Use is ${isUserExist.isActive}`)
        }

        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        }

        if (!authRole.includes(verifiedToken.role)) {
            throw new AppError(403, "You'r not permitted to view this route")
        }

        next()
    } catch (error) {
        next(error)
    }
}