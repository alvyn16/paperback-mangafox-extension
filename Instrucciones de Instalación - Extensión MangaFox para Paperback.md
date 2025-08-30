# Instrucciones de Instalación - Extensión MangaFox para Paperback

## Requisitos Previos

1. **Paperback App**: Debes tener instalada la aplicación Paperback en tu dispositivo iOS
   - Versión mínima requerida: iOS 13.4+
   - Descarga desde: [App Store](https://apps.apple.com/app/paperback-a-komga-client/id1626613373) o instalación alternativa

2. **Conexión a Internet**: Necesaria para descargar manga y capítulos

## Método 1: Instalación via Repositorio (Recomendado)

### Paso 1: Preparar los archivos
1. Descarga todos los archivos de la extensión:
   - `MangaFoxPaperback.js`
   - `versioning.json`
   - `icon.png` (reemplazar con icono real)

### Paso 2: Crear un repositorio web
1. Sube los archivos a un servicio de hosting web (GitHub Pages, Netlify, etc.)
2. Asegúrate de que los archivos sean accesibles via HTTPS
3. La estructura debe ser:
   ```
   tu-repositorio/
   ├── versioning.json
   ├── MangaFoxPaperback.js
   └── icon.png
   ```

### Paso 3: Agregar el repositorio en Paperback
1. Abre Paperback en tu dispositivo iOS
2. Ve a **Configuración** (Settings)
3. Selecciona **Extensiones** (Extensions)
4. Toca **Repositorios** (Repositories)
5. Toca el botón **+** para agregar un nuevo repositorio
6. Ingresa la URL de tu repositorio (ej: `https://tu-usuario.github.io/tu-repositorio/`)
7. Toca **Agregar** (Add)

### Paso 4: Instalar la extensión
1. Ve a la sección **Extensiones** en Paperback
2. Busca "MangaFox" en la lista
3. Toca **Instalar** (Install)
4. Espera a que se complete la descarga
5. La extensión aparecerá en tu lista de fuentes

## Método 2: Instalación Manual (Avanzado)

### Para desarrolladores o usuarios avanzados:

1. **Compilar la extensión**:
   ```bash
   npm install
   npm run build
   ```

2. **Crear un servidor local**:
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # O usando Node.js
   npx http-server
   ```

3. **Agregar repositorio local**:
   - URL: `http://localhost:8000`
   - Seguir pasos del Método 1

## Verificación de la Instalación

1. Ve a **Fuentes** (Sources) en Paperback
2. Deberías ver "MangaFox" en la lista
3. Toca en MangaFox para acceder al contenido
4. Prueba buscar un manga para verificar que funciona

## Configuración Inicial

### Configurar bypass de Cloudflare (si es necesario)
1. Ve a Configuración de la extensión MangaFox
2. Activa "Cloudflare Bypass" si está disponible
3. Sigue las instrucciones para completar el bypass

### Ajustar configuraciones de red
1. **Tiempo de espera**: 20 segundos (por defecto)
2. **Solicitudes por segundo**: 1 (para evitar bloqueos)
3. **User Agent**: Se usa el predeterminado de Paperback

## Solución de Problemas

### La extensión no aparece en la lista
- Verifica que la URL del repositorio sea correcta
- Asegúrate de que el archivo `versioning.json` sea accesible
- Revisa que no haya errores de CORS

### Error al cargar manga
- Verifica tu conexión a internet
- Comprueba si MangaFox está disponible en tu región
- Intenta activar el bypass de Cloudflare

### Imágenes no cargan
- Verifica que el dominio móvil (`m.fanfox.net`) sea accesible
- Comprueba la configuración de red de Paperback
- Intenta cambiar de red (WiFi/datos móviles)

### Error de "Too Many Requests"
- La extensión está limitada a 1 solicitud por segundo
- Espera unos minutos antes de intentar de nuevo
- Evita hacer múltiples búsquedas simultáneas

## Actualización de la Extensión

1. Ve a **Configuración** > **Extensiones** > **Repositorios**
2. Encuentra tu repositorio y toca **Actualizar**
3. Si hay una nueva versión disponible, aparecerá en la lista de extensiones
4. Toca **Actualizar** junto a MangaFox

## Desinstalación

1. Ve a **Configuración** > **Extensiones**
2. Encuentra "MangaFox" en la lista
3. Toca **Desinstalar** (Uninstall)
4. Confirma la acción

## Soporte Técnico

Si encuentras problemas durante la instalación:

1. **Verifica los requisitos**: iOS 13.4+, Paperback actualizado
2. **Revisa la conexión**: Internet estable, sin restricciones de red
3. **Consulta los logs**: Ve a Configuración > Logs en Paperback
4. **Reporta issues**: Con detalles específicos del error

## Notas Importantes

- Esta extensión requiere bypass de Cloudflare
- Respeta los términos de uso de MangaFox
- La extensión es solo para uso personal y educativo
- No garantizamos la disponibilidad continua del servicio

## Archivos Necesarios

Asegúrate de tener todos estos archivos para la instalación:

- ✅ `MangaFoxPaperback.js` - Código principal de la extensión
- ✅ `versioning.json` - Información de la extensión
- ✅ `icon.png` - Icono de la extensión (64x64px)
- ✅ `README.md` - Documentación
- ✅ `INSTALL.md` - Este archivo de instalación

