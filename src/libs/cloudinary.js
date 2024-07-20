import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export const uploadImage = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'avatar' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(fileBuffer);
    });
};