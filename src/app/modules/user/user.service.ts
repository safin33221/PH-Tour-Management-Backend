/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../../errorHelpers/AppError";
import { IProviders, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs';
import { envVars } from "../../../config/env";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload

    const isUserExist = User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist")
    }

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
    getUser
}