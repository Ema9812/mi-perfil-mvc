import { Pet } from '../models';
import { uploadImage } from '../services/cloudinary';
import {
  syncPetToAlgolia,
  deletePetFromAlgolia,
  searchPetsByLocation,
} from '../services/algolia';

class PetController {
  // POST /pets
  public static async createPet(
    name: string,
    status: 'lost' | 'found',
    location: string,
    imageDataUri: string | undefined,
    reporterId: number,
    lat?: number,
    lng?: number
  ): Promise<Pet> {
    // 1. Validaciones
    if (!name || !status || !location) {
      throw new Error('Name, status and location are required.');
    }

    if (status !== 'lost' && status !== 'found') {
      throw new Error('Status must be "lost" or "found".');
    }

    // 2. Subir imagen si viene
    let imageUrl: string | undefined;
    if (imageDataUri) {
      imageUrl = await uploadImage(imageDataUri);
    }

    // 3. Crear la mascota
    const pet = await Pet.create({
      name,
      status,
      location,
      imageUrl,
      reporterId,
      lat,
      lng,
    });

    // 4. Sincronizar con Algolia
    await syncPetToAlgolia(pet);

    return pet;
  }

  // GET /pets
  public static async getAllPets(): Promise<Pet[]> {
    return Pet.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  // GET /pets/:id
  public static async getPetById(id: number): Promise<Pet> {
    const pet = await Pet.findByPk(id);
    if (!pet) {
      throw new Error('Pet not found.');
    }
    return pet;
  }

  // PUT /pets/:id
  public static async updatePet(
    id: number,
    userId: number,
    name?: string,
    status?: 'lost' | 'found',
    location?: string,
    imageDataUri?: string,
    lat?: number,
    lng?: number
  ): Promise<Pet> {
    // 1. Buscar la mascota
    const pet = await Pet.findByPk(id);
    if (!pet) {
      throw new Error('Pet not found.');
    }

    // 2. Verificar que el usuario sea el dueño
    if (pet.reporterId !== userId) {
      throw new Error('You are not allowed to update this pet.');
    }

    // 3. Validar que al menos un campo venga
    if (
      !name &&
      !status &&
      !location &&
      !imageDataUri &&
      lat == null &&
      lng == null
    ) {
      throw new Error('At least one field is required.');
    }

    // 4. Construir updates
    const updates: Partial<{
      name: string;
      status: 'lost' | 'found';
      location: string;
      imageUrl: string;
      lat: number;
      lng: number;
    }> = {};

    if (name) updates.name = name;
    if (status) updates.status = status;
    if (location) updates.location = location;
    if (lat != null) updates.lat = lat;
    if (lng != null) updates.lng = lng;

    if (imageDataUri) {
      updates.imageUrl = imageDataUri.startsWith('data:image/')
        ? await uploadImage(imageDataUri)
        : imageDataUri;
    }

    // 5. Aplicar
    await pet.update(updates);

    // 6. Sincronizar con Algolia
    await syncPetToAlgolia(pet);

    return pet;
  }

  // DELETE /pets/:id
  public static async deletePet(id: number, userId: number): Promise<void> {
    const pet = await Pet.findByPk(id);
    if (!pet) {
      throw new Error('Pet not found.');
    }

    if (pet.reporterId !== userId) {
      throw new Error('You are not allowed to delete this pet.');
    }

    await pet.destroy();

    // Eliminar de Algolia
    await deletePetFromAlgolia(id);
  }

  // GET /pets/search?lat=...&lng=...&radius=...
  public static async searchPets(
    lat: number,
    lng: number,
    radius?: number
  ): Promise<any[]> {
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
      throw new Error('Valid lat and lng are required.');
    }

    return searchPetsByLocation(lat, lng, radius);
  }
}

export default PetController;