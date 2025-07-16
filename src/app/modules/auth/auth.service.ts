import AppError from "../../../errorHelpers/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { generateToken } from "../../../utils/jwt"
import { envVars } from "../../../config/env"
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


    return {
        accessToken
    }

}

export const authServices = {
    credentialLogin
}