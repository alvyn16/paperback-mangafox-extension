# MangaFox Extension for Paperback

Esta es una extensión para Paperback que permite acceder al contenido de MangaFox, adaptada del código de la extensión de Tachiyomi.

## Características

- Búsqueda de manga por título
- Filtrado por géneros
- Secciones de inicio (Popular y Últimas actualizaciones)
- Lectura de capítulos
- Soporte para imágenes de alta calidad

## Instalación

1. Descarga el archivo `MangaFoxPaperback.js`
2. Abre Paperback en tu dispositivo iOS
3. Ve a Configuración > Extensiones > Repositorios
4. Agrega un nuevo repositorio personalizado
5. Sube el archivo de la extensión

## Uso

Una vez instalada la extensión:

1. Ve a la sección "Fuentes" en Paperback
2. Busca "MangaFox" en la lista de extensiones
3. Toca para activarla
4. Ahora puedes buscar y leer manga desde MangaFox

## Funcionalidades implementadas

### Búsqueda
- Búsqueda por título
- Filtros por género (incluir/excluir)
- Paginación de resultados

### Detalles del manga
- Título, autor, artista
- Descripción
- Estado (En curso/Completado)
- Géneros
- Imagen de portada

### Capítulos
- Lista completa de capítulos
- Numeración automática
- Fechas de publicación
- Orden cronológico

### Lectura
- Carga de páginas desde el dominio móvil
- Soporte para múltiples formatos de imagen
- Navegación fluida entre páginas

## Estructura del código

La extensión está basada en la arquitectura de Paperback y adaptada del código de Tachiyomi:

- `getMangaDetails()`: Obtiene información detallada del manga
- `getChapters()`: Lista los capítulos disponibles
- `getChapterDetails()`: Carga las páginas de un capítulo
- `getSearchResults()`: Realiza búsquedas
- `getHomePageSections()`: Carga las secciones de inicio
- `getSearchTags()`: Proporciona los filtros de género

## Limitaciones conocidas

- Requiere bypass de Cloudflare (marcado en la extensión)
- Limitado a 1 solicitud por segundo para evitar bloqueos
- Algunos manga pueden no estar disponibles debido a restricciones regionales

## Créditos

- Código original de Tachiyomi: [tachiyomi-extensions-archive](https://github.com/timschneeb/tachiyomi-extensions-archive)
- Adaptado para Paperback por: TachiyomiExtensionAdapter
- Fuente: MangaFox (fanfox.net)

## Licencia

MIT License - Ver archivo LICENSE para más detalles.

## Soporte

Si encuentras algún problema con la extensión, por favor:

1. Verifica que tengas la última versión de Paperback
2. Asegúrate de que la extensión esté correctamente instalada
3. Revisa que tu conexión a internet sea estable
4. Si el problema persiste, reporta el issue con detalles específicos

## Descargo de responsabilidad

Esta extensión es solo para uso educativo y personal. El desarrollador no tiene afiliación con MangaFox ni con el contenido disponible a través de esta extensión. Respeta los derechos de autor y las políticas de uso de la fuente original.

