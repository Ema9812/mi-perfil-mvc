import Profile from '../models/profile';
import { uploadImage } from '../services/cloudinary';

class ProfileController {
  // POST /profile
  public static async createProfile(
    name: string,
    bio: string,
    imageDataUri: string
  ): Promise<Profile> {
    // 1. Validaciones
    if (!name || !bio || !imageDataUri) {
      throw new Error('Name, bio and image are required.');
    }

    // 2. Subir imagen a Cloudinary
    const imageUrl = await uploadImage(imageDataUri);

    // 3. Guardar en DB solo la URL
    const newProfile = await Profile.create({ name, bio, imageUrl });

    return newProfile;
  }

  // GET /profile
  public static async getProfile(): Promise<Profile | null> {
    const profile = await Profile.findOne({
      order: [['createdAt', 'DESC']],
    });
    return profile;
  }
}

export default ProfileController;