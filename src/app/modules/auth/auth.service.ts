/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../../errorHelpers/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { generateToken } from "../../../utils/jwt"
import { envVars } from "../../../config/env"
import { userInfo } from "os"
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
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    // const accessToken = jwt.sign(jwtPayload, "secret", {
    //     expiresIn: "1d"
    // })
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_EXPIRES_TIME)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRED)

    const { password: pass, ...userIfo } = user.toObject()
    return {
        accessToken,
        refreshToken,
        user: userIfo
    }

}

export const authServices = {
    credentialLogin
}