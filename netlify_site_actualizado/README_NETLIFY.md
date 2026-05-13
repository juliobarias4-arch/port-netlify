# Portal remoto en Netlify

Este proyecto convierte el portal de contabilidad en una web remota con persistencia.

## Qué hace

- `POST /api/sync`: recibe el snapshot enviado por la app principal.
- `POST /api/data`: devuelve el snapshot si las dos contraseñas son correctas.
- `GET /api/status`: muestra si ya hay datos sincronizados.
- Netlify Blobs guarda el último snapshot.

## Despliegue en Netlify

1. Sube la carpeta `netlify_site` a un repositorio de GitHub.
2. En Netlify, crea un sitio nuevo desde ese repositorio.
3. Configura:
   - Base directory: `netlify_site`
   - Build command: `npm run build`
   - Publish directory: `public`
4. En Netlify, abre `Site configuration > Environment variables`.
5. Crea esta variable:
   - `ACCOUNTING_SYNC_TOKEN`
6. El valor debe ser exactamente el contenido del archivo local:
   - `../.sync_token`

## Conectar la app local

Después de publicar en Netlify:

1. Ejecuta `configurar_netlify_sync.bat`.
2. Pega esta URL cambiando `TU-SITIO`:
   - `https://TU-SITIO.netlify.app/api/sync`
3. Ejecuta `probar_sync_netlify.bat`.

Si responde `OK=True`, la web ya está recibiendo datos.
