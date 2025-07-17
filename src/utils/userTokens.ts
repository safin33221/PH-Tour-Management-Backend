import { IUser } from "../app/modules/user/user.interface";
import { envVars } from "../config/env";
import { generateToken } from "./jwt";

export const createToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_EXPIRES_TIME)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRED)
    return {
        accessToken,
        refreshToken
    }
}