/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IProviders, IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'

import { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHelpers/AppError"
import { crateNewAccessTokenWithRefreshToken, createToken } from "../../utils/userTokens"
import { envVars } from "../../config/env"
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../utils/sendEmail"


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
const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id != decodedToken.userId) {
        throw new AppError(401, "you can not reset your password")
    }

    const user = await User.findById(decodedToken.userId)
    if (!user) {
        throw new AppError(401, "user does not exist")
    }
    const hashPassword = await bcryptjs.hash(payload.newPassword, Number(envVars.BCRYPT_SAULT_ROUND))
    user.password = hashPassword

    await user.save()
    return []
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

const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "email does not exist")
    }
    if (!user.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")

    }
    if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {


        throw new AppError(httpStatus.BAD_REQUEST, `Use is ${user.isActive}`)
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const JwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const resetToken = jwt.sign(JwtPayload, envVars.JWT_ACCESS_SECRET, { expiresIn: "10m" })
    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`

    //http://localhost:5173/reset-password?id=687b7d0b5b40728dc6f01580&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdiN2QwYjViNDA3MjhkYzZmMDE1ODAiLCJlbWFpbCI6InNhZmF5ZXQ2OTcwQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzU0NzM5NDg3LCJleHAiOjE3NTQ3NDAwODd9.xZASgJjxjTqKzOhZ423BSTK8Mhvbe5O4voJgLQHqhrU

    sendEmail({
        to: user.email,
        subject: "Password Reset",
        templateName: "forgotPassword",
        templateData: {
            name: user.name,
            resetUILink
        }

    })

    return {}
}

export const authServices = {
    credentialLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    forgotPassword,
    setPassword
}