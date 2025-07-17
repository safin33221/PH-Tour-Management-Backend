/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../../errorHelpers/AppError"
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { generateToken, verifyToken } from "../../../utils/jwt"
import { envVars } from "../../../config/env"
import { createToken } from "../../../utils/userTokens"
import { JwtPayload } from "jsonwebtoken"



const credentialLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "email does not exist")
    }
    const isPasswordMatch = await bcryptjs.compare(password as string, user?.password as string)
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const userToken = createToken(user)
    const { password: pass, ...userIfo } = user.toObject()
    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: userIfo
    }

}

const getNewAccessToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload
    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "email does not exist")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `Use is ${isUserExist.isActive}`)
    }

    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_EXPIRES_TIME)
    return { accessToken }
}
export const authServices = {
    credentialLogin,
    getNewAccessToken
}