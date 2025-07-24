/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../../errorHelpers/AppError";
import { IProviders, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs';
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload

    const isUserExist = User.findOne({ email })
    // if (!isUserExist) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User already exist")
    // }

    const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SAULT_ROUND))

    // const isPasswordMatch = await bcryptjs.compare(password as string, hashPassword)
    const authProvider: IProviders = { provider: "credential", providerId: email as string }

    const user = await User.create({
        email,
        password: hashPassword,
        auth: [authProvider],
        ...rest
    })

    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {


    const userExist = await User.findById(userId)
    if (!userExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }



    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")
        }
        if (decodedToken.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")

        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "your are not authorized")
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SAULT_ROUND)
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    return newUpdateUser
}

const getUser = async () => {
    const users = await User.find({})
    const totalUser = await User.countDocuments()

    return {
        data: users,
        meta: {
            total: totalUser
        }
    }
}
export const userServices = {
    createUser,
    getUser,
    updateUser
}