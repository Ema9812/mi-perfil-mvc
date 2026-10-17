import { algoliasearch } from 'algoliasearch';
import dotenv from 'dotenv';
import Pet from '../models/Pet';

dotenv.config();

// Cliente de Algolia (usa auto-discovery por defecto)
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);

const INDEX_NAME = 'pets';

// 1. Sincronizar una mascota con Algolia (crear o actualizar)
export async function syncPetToAlgolia(pet: Pet): Promise<void> {
  const record: any = {
    objectID: pet.id.toString(),
    name: pet.name,
    status: pet.status,
    location: pet.location,
    imageUrl: pet.imageUrl || null,
    reporterId: pet.reporterId,
  };

  // Solo agregar _geoloc si hay coordenadas
  if (pet.lat != null && pet.lng != null) {
    record._geoloc = {
      lat: pet.lat,
      lng: pet.lng,
    };
  }

  await client.saveObject({
    indexName: INDEX_NAME,
    body: record,
  });
}

// 2. Eliminar una mascota del índice
export async function deletePetFromAlgolia(petId: number): Promise<void> {
  await client.deleteObject({
    indexName: INDEX_NAME,
    objectID: petId.toString(),
  });
}

// 3. Buscar mascotas por ubicación
export async function searchPetsByLocation(
  lat: number,
  lng: number,
  radius: number = 5000
): Promise<any[]> {
  const result = await client.search({
    requests: [
      {
        indexName: INDEX_NAME,
        aroundLatLng: `${lat},${lng}`,
        aroundRadius: radius,
        hitsPerPage: 50,
      },
    ],
  });

  // TypeScript no reconoce bien los tipos del SDK v5
  // Por eso hacemos un cast explícito
  const firstResult = result.results[0] as any;
  return firstResult.hits;
}

// 4. Indexar TODAS las mascotas (para inicializar)
export async function indexAllPets(): Promise<void> {
  const pets = await Pet.findAll();

  const records = pets.map((pet) => {
    const record: any = {
      objectID: pet.id.toString(),
      name: pet.name,
      status: pet.status,
      location: pet.location,
      imageUrl: pet.imageUrl || null,
      reporterId: pet.reporterId,
    };
    if (pet.lat != null && pet.lng != null) {
      record._geoloc = { lat: pet.lat, lng: pet.lng };
    }
    return record;
  });

  if (records.length > 0) {
    await client.saveObjects({
      indexName: INDEX_NAME,
      objects: records,
    });
  }

  console.log(`✅ ${records.length} mascotas indexadas en Algolia`);
}