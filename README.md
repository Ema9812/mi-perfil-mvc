# 👤 Mi Perfil - MVC + Cloudinary

Aplicación web full-stack para gestionar un perfil de usuario (nombre, bio y foto), construida con una arquitectura **MVC en capas** en el backend, subida de imágenes a **Cloudinary** y persistencia en **PostgreSQL**.

---

## 🎯 Características

- 📝 Formulario web para editar el perfil con **Nombre**, **Bio** y **Foto de perfil**.
- 📤 Carga de imágenes con **Dropzone** (drag & drop o click para elegir).
- 🔄 Conversión de imagen a **dataURI** para enviar junto al JSON.
- ☁️ Subida automática de imágenes a **Cloudinary**.
- 💾 Persistencia en **PostgreSQL** (solo se guarda la URL de la imagen, no el dataURI).
- 🔁 Precarga del formulario con los últimos datos guardados.
- 🏗️ Arquitectura **MVC** en el backend con **separación de responsabilidades**.
- ✅ Tipado fuerte con **TypeScript**.

---

## 🛠️ Tecnologías usadas

### Backend
- **Node.js** + **Express** — Servidor HTTP y endpoints.
- **TypeScript** — Tipado estático.
- **Sequelize** — ORM para PostgreSQL.
- **PostgreSQL** — Base de datos relacional.
- **Cloudinary** — Hosting y CDN de imágenes.
- **dotenv** — Manejo de variables de entorno.
- **cors** — Habilitación de CORS para el frontend.

### Frontend
- **HTML5** + **CSS3** — Estructura y estilos.
- **Dropzone.js** — Carga de archivos con drag & drop.
- **Fetch API** — Comunicación con el backend.
- **FileReader API** — Conversión de imagen a dataURI.

---

## 📁 Estructura del proyecto

```
mi-perfil-MVC/
├── backend/
│   └── src/
│       ├── controllers/       # Lógica de negocio (capa C de MVC)
│       │   └── profile.ts
│       ├── db/                # Configuración de Sequelize
│       │   └── sequelize.ts
│       ├── models/            # Modelos de datos (capa M de MVC)
│       │   └── profile.ts
│       ├── services/          # Servicios externos (Cloudinary)
│       │   └── cloudinary.ts
│       ├── views/             # Endpoints HTTP (capa V de MVC)
│       │   └── profile.ts
│       └── index.ts           # Punto de entrada del servidor
├── frontend/
│   ├── index.html             # Formulario con Dropzone
│   └── index.js               # Lógica del cliente
├── .env                       # Variables de entorno (NO subir a Git)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏗️ Arquitectura MVC en capas

El backend sigue el patrón **Modelo-Vista-Controlador (MVC)** aplicado a APIs:

```
Cliente → Endpoints (Vista) → Controllers → Modelos → PostgreSQL
```

| Capa | Archivo | Responsabilidad |
|---|---|---|
| **Modelo** | `models/profile.ts` | Definir estructura y comunicación con la DB |
| **Vista** | `views/profile.ts` | Manejar HTTP (req/res), sin lógica de negocio |
| **Controller** | `controllers/profile.ts` | Lógica de negocio, validación, orquestación |
| **Servicio** | `services/cloudinary.ts` | Comunicación con Cloudinary |

### ✨ Reglas aplicadas en los controllers
- ✅ Reciben y devuelven **datos puros** (no `req`/`res`).
- ✅ Están **tipados** con TypeScript.
- ✅ Contienen **toda la lógica de negocio**.
- ✅ Son **reutilizables** desde cualquier contexto (endpoints, scripts, cronjobs).

---

## 🔌 Endpoints de la API

### `POST /profile`
Recibe los 3 datos del perfil, sube la imagen a Cloudinary y guarda todo en la base de datos.

**Body (JSON):**
```json
{
  "name": "Juan Perez",
  "bio": "Desarrollador full stack",
  "image": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Respuesta exitosa (201):**
```json
{
  "id": 1,
  "name": "Juan Perez",
  "bio": "Desarrollador full stack",
  "imageUrl": "https://res.cloudinary.com/.../perfiles/xxxxx.png",
  "createdAt": "2026-10-10T16:43:47.738Z",
  "updatedAt": "2026-10-10T16:43:47.738Z"
}
```

### `GET /profile`
Devuelve el **último perfil guardado**, útil para precargar el formulario.

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "name": "Juan Perez",
  "bio": "Desarrollador full stack",
  "imageUrl": "https://res.cloudinary.com/.../perfiles/xxxxx.png"
}
```

---

## 🚀 Instalación y uso

### Requisitos previos
- **Node.js** (v18 o superior)
- **PostgreSQL** (v14 o superior)
- Cuenta gratuita en **Cloudinary** → [Registrate acá](https://cloudinary.com/users/register_free)

### 1. Clonar el repositorio
```bash
git clone <tu-repo-url>
cd mi-perfil-MVC
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear la base de datos
```bash
psql -U postgres -c "CREATE DATABASE perfil_db;"
```

### 4. Configurar el archivo `.env`
Creá un archivo `.env` en la raíz con:

```env
PORT=3000

# Base de datos PostgreSQL
DB_NAME=perfil_db
DB_USER=postgres
DB_PASS=tu_password_de_postgres
DB_HOST=localhost

# Cloudinary (obtené las credenciales en https://console.cloudinary.com/settings/api-keys)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 5. Levantar el backend
```bash
npm run dev
```

Deberías ver:
```
🚀 Server en http://localhost:3000
```

### 6. Abrir el frontend
Abrí `frontend/index.html` en el navegador, o servilo con:

```bash
cd frontend
npx http-server -p 8080
```

Y entrá a `http://localhost:8080`.

---

## 🧪 Cómo probarlo

1. **Abrí el formulario** → verás los últimos datos guardados (si existen).
2. **Arrastrá una imagen** al Dropzone o hacé click para elegirla.
3. **Editá Nombre y Bio** si querés.
4. **Click en "Guardar"** → mensaje verde de éxito.
5. **Recargá la página** → los datos nuevos persisten. ✅

Para verificar en la base de datos:
```bash
psql -U postgres -d perfil_db -c "SELECT * FROM profiles;"
```

---

## 🔐 Seguridad

- Las credenciales sensibles (DB y Cloudinary) viven en `.env`, **nunca en el código**.
- El `.env` está en `.gitignore` para evitar subirlo al repo.
- El `API Secret` de Cloudinary **nunca** se expone al frontend.
- La imagen se sube al backend en formato dataURI, y desde el backend a Cloudinary (firmado con el secret).

---

## 📚 Conceptos aplicados

- **MVC en capas** — Separación clara Modelo / Vista / Controller.
- **Servicios externos** — Cloudinary aislado en `services/`.
- **DataURI** — Imagen codificada en base64 para viajar junto al JSON.
- **Persistencia inteligente** — Solo se guarda la URL, no el dataURI gigante.
- **Tipado estricto** — Todo el backend en TypeScript.
- **Validación en el controller** — Antes de tocar la DB o Cloudinary.
- **DRY (Don't Repeat Yourself)** — Lógica centralizada y reutilizable.

---

## 🎓 Autor

Desafío desarrollado como práctica de:
- Arquitectura MVC en APIs.
- Separación de responsabilidades.
- Integración con servicios externos (Cloudinary).
- Full-stack con Node.js + TypeScript + PostgreSQL.

---

## 📄 Licencia

Este proyecto es de uso educativo.