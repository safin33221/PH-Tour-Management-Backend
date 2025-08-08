/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IProviders, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'

import { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHelpers/AppError"
import { crateNewAccessTokenWithRefreshToken, createToken } from "../../utils/userTokens"
import { envVars } from "../../config/env"



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
const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does Not match")
    }
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SAULT_ROUND))
    user!.save()

}
const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does Not match")
    }
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SAULT_ROUND))
    user!.save()

}
const setPassword = async (userId: string, plainPassword: string) => {

    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(404, "User not found")
    }
    if (user.password && user.auth.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set your password. Now you can change the password from your profile password update")
    }

    const hashPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SAULT_ROUND))

    const auth: IProviders[] = [...user.auth, { provider: "credential", providerId: user.email }]
    user.password = hashPassword
    user.auth = auth

    await user.save()




}

export const authServices = {
    credentialLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword
}