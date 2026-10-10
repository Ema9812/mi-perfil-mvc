import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(dataUri: string): Promise<string> {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'perfiles',
    resource_type: 'image',
  });
  return result.secure_url;
}