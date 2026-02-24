# Cómo publicar y compartir la app

La app es un **diseñador de escaparates** (Node + Express + React). Para publicarla en internet y compartir el enlace necesitas **construirla** y **subirla** a un servicio de hosting.

---

## 1. Construir la app para producción

En la raíz del proyecto:

```bash
npm run build
```

Esto genera:
- **Cliente** (React) en `dist/public/`
- **Servidor** (Express) en `dist/index.cjs`

---

## 2. Probar en local como producción

```bash
npm start
```

Abre en el navegador la URL que indique (por defecto `http://localhost:5000`). Es la misma forma en que se ejecutará en el servidor.

---

## 3. Dónde publicar (hosting)

Necesitas un servicio que ejecute **Node.js** y sirva la app en un puerto (por ejemplo 5000). Algunas opciones gratuitas o con plan gratuito:

| Servicio | Plan gratuito | Qué hacer |
|----------|----------------|-----------|
| **Railway** | Sí | Conectar el repo de GitHub, definir `npm run build` y `npm start`, y asignar variable `PORT` si la piden. |
| **Render** | Sí | Crear un "Web Service", conectar el repo, build: `npm run build`, start: `npm start`. |
| **Fly.io** | Sí | Instalar CLI, `fly launch` en el proyecto y configurar el comando de inicio. |
| **Cyclic** | Sí | Conectar GitHub y desplegar; suele detectar Node y el script `start`. |

### Ejemplo: Render

1. Entra en [render.com](https://render.com) y crea cuenta (o inicia sesión).
2. **New → Web Service**.
3. Conecta tu repositorio de GitHub (donde esté este proyecto).
4. Configuración:
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Root Directory:** deja el que tenga la carpeta del proyecto (por ejemplo `Window-Display-Designer` si el repo tiene esa carpeta).
5. Clic en **Create Web Service**.
6. Cuando termine el deploy, Render te dará una URL tipo `https://tu-app.onrender.com`. **Esa es la URL para compartir.**

### Ejemplo: Railway

1. Entra en [railway.app](https://railway.app) y conecta GitHub.
2. **New Project → Deploy from GitHub repo** y elige este proyecto.
3. En **Settings** del servicio:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** la carpeta donde está el `package.json` (por ejemplo `Window-Display-Designer`).
4. Railway asigna una URL pública; puedes verla en **Settings → Domains**. Esa URL es la que compartes.

---

## 4. Compartir el enlace

Una vez publicada:

- La **URL de la app** (ej. `https://tu-app.onrender.com`) es el enlace que puedes enviar por WhatsApp, correo, etc.
- Dentro de la app hay un botón **"Compartir"** que copia la URL actual al portapapeles; así quien use la app puede compartir el mismo enlace con un clic.

---

## 5. Variables de entorno (opcional)

Si en el futuro usas base de datos u otras APIs:

- En **Render**: **Environment** en el panel del servicio.
- En **Railway**: **Variables** en el proyecto.
- En **Fly.io**: `fly secrets set NOMBRE=valor`.

Para la app tal como está (con progreso en `localStorage`), no hace falta configurar ninguna variable para un primer deploy.

---

## Resumen rápido

1. `npm run build` → genera `dist/`.
2. Sube el proyecto a GitHub (si aún no está).
3. Conecta el repo en Render, Railway o similar.
4. Build: `npm run build`, Start: `npm start`.
5. Usa la URL que te den como enlace para compartir la app.
