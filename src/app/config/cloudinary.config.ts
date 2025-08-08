/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary'
import { envVars } from './env'
import AppError from '../errorHelpers/AppError';

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUD_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUD_API_SECRET
})


export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex)

        if (match && match[1]) {
            const public_id = match[1]
            await cloudinary.uploader.destroy(public_id)

            console.log(`File ${public_id} is deleted from cloudinary`);
        }
    } catch (error: any) {
        console.log(error);
        throw new AppError(401, "Cloudinary image deletion Failed", error.message)

    }
}

export const cloudinaryUpload = cloudinary 