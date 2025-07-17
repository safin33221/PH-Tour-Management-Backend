/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../../errorHelpers/AppError"
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { generateToken, verifyToken } from "../../../utils/jwt"
import { envVars } from "../../../config/env"
import { crateNewAccessTokenWithRefreshToken, createToken } from "../../../utils/userTokens"
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

    const newAccessToken = await crateNewAccessTokenWithRefreshToken(refreshToken)

    return { accessToken: newAccessToken }
}
export const authServices = {
    credentialLogin,
    getNewAccessToken
}