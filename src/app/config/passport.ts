/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { envVars } from "./env";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from 'bcryptjs';
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done: any) => {
        try {
            const user = await User.findOne({ email })
            if (!user) {
                return done(null, false, { message: "User does not exist" })
            }
            if (!user.isVerified) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
                return done(null, false, { message: "User is not verified" })

            }
            if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {
                // throw new AppError(httpStatus.BAD_REQUEST, `Use is ${user.isActive}`)
                return done(null, false, { message: `User is ${user.isActive}` })
            }

            if (user.isDeleted) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
                return done(null, false, { message: "User is deleted" })
            }

            const isGoogleAuthenticate = user.auth.some(providerObjects => providerObjects.provider === "google")
            if (isGoogleAuthenticate && !user.password) {
                return done(null, false, { message: "You have authenticate thought google.If you want to login with google credential , then at first login with google and set a new password for this email and then  you can login with email and password" })
            }
            const isPasswordMatch = await bcryptjs.compare(password as string, user?.password as string)
            if (!isPasswordMatch) {
                return done(null, false, { message: "Incorrect Password" })
            }
            return done(null, user)
        } catch (error: any) {
            throw new AppError(500, error.message)
        }
    })
)

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL,
            // proxy: true
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value
                if (!email) {
                    return done(null, false, { message: "NO email found" })
                }
                let user = await User.findOne({ email })

                if (user && !user.isVerified) {
                    // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
                    return done(null, false, { message: "User is not verified" })

                }
                if (user && (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE)) {
                    // throw new AppError(httpStatus.BAD_REQUEST, `Use is ${user.isActive}`)

                    return done(null, false, { message: `Use is ${user.isActive}` })
                }

                if (user && user.isDeleted) {
                    // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
                    return done(null, false, { message: "User is deleted" })
                }
                if (!user) {
                    user = await User.create({
                        email,
                        name: profile?.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auth: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                }
                return done(null, user)

            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error)
            }
        }
    )
)

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user.id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }

})