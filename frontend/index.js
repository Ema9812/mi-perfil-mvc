// ============================================
// CONFIGURACIÓN
// ============================================
const API_URL = 'http://localhost:3000';
let imageDataUri = ''; // Acá guardamos el dataURI de la imagen

// ============================================
// 1. CARGAR EL PERFIL EXISTENTE (GET /profile)
// ============================================
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(`${API_URL}/profile`);
    const profile = await res.json();

    if (profile) {
      document.getElementById('name').value = profile.name;
      document.getElementById('bio').value = profile.bio;

      // Mostrar la imagen actual en el preview
      const preview = document.getElementById('preview');
      preview.src = profile.imageUrl;
      document.getElementById('preview-container').style.display = 'block';

      // Guardamos la URL actual por si el usuario no cambia la foto
      imageDataUri = profile.imageUrl;
    }
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
  }
});

// ============================================
// 2. CONFIGURAR DROPZONE
// ============================================
Dropzone.autoDiscover = false;

const dropzone = new Dropzone('#dropzone', {
  url: '#', // No subimos desde acá, solo capturamos el archivo
  autoProcessQueue: false, // No subir automáticamente
  maxFiles: 1, // Solo una imagen
  acceptedFiles: 'image/*', // Solo imágenes
  addRemoveLinks: false,
  dictDefaultMessage: '', // Vacío porque ya tenemos texto en el HTML
  init() {
    // Cuando se agrega un archivo, lo convertimos a dataURI
    this.on('addedfile', (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageDataUri = e.target.result; // dataURI completo
        const preview = document.getElementById('preview');
        preview.src = imageDataUri;
        document.getElementById('preview-container').style.display = 'block';
      };
      reader.readAsDataURL(file);
    });

    // Si el usuario agrega otra imagen, reemplazamos la anterior
    this.on('maxfilesexceeded', (file) => {
      this.removeAllFiles();
      this.addFile(file);
    });
  },
});

// ============================================
// 3. ENVIAR EL FORMULARIO (POST /profile)
// ============================================
document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const bio = document.getElementById('bio').value.trim();
  const status = document.getElementById('status');
  const submitBtn = document.getElementById('submit-btn');

  // Validación básica
  if (!name || !bio || !imageDataUri) {
    status.textContent = '⚠️ Completá todos los campos y subí una foto.';
    status.className = 'error';
    return;
  }

  // Deshabilitar botón mientras se envía
  submitBtn.disabled = true;
  status.textContent = '⏳ Guardando...';
  status.className = '';

  try {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        bio,
        image: imageDataUri,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const data = await res.json();
    console.log('Perfil guardado:', data);

    status.textContent = '✅ ¡Perfil guardado con éxito!';
    status.className = 'success';
  } catch (error) {
    console.error('Error al guardar:', error);
    status.textContent = `❌ Error: ${error.message}`;
    status.className = 'error';
  } finally {
    submitBtn.disabled = false;
  }
});