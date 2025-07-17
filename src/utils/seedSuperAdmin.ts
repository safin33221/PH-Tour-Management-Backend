import { IProviders, IUser, Role } from "../app/modules/user/user.interface"
import { User } from "../app/modules/user/user.model"
import { envVars } from "../config/env"
import bcryptjs from "bcryptjs"
export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        if (isSuperAdminExist) {
            console.log('Super admin already exists');
            return

        }
        console.log('trying to crate super admin ..... ');
        const hashPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SAULT_ROUND))
        const authProvider: IProviders = {
            provider: 'credential',
            providerId: envVars.SUPER_ADMIN_EMAIL
        }
        const payload: IUser = {
            name: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            auth: [authProvider],
            isVerified: true,
            role: Role.SUPER_ADMIN

        }
        const superAdmin = await User.create(payload)
        console.log("super admin created successfully  \n", superAdmin);

    } catch (error) {
        console.log(error);
    }
}