# RRSS CST — Parrilla de revisión de posts

Página interna (grid tipo Instagram) para que tu encargado vea los posts propuestos y los apruebe/rechace con un clic, sin tener que mandártelos por WhatsApp.

## Estructura

```txt
RRSS CST/
├── index.html
├── README.md
├── css/styles.css
├── js/
│   ├── data.js              # catálogo de posts (título, imágenes, caption)
│   ├── supabase-config.js   # URL + anon key de tu proyecto Supabase (pública)
│   ├── supabase-client.js   # guarda/lee el estado (aprobado/rechazado)
│   └── script.js            # grid, modal/carrusel, filtros
├── assets/posts/<post>/1.png, 2.png, ...
└── supabase/schema.sql      # tabla + RLS (idempotente)
```

## Cómo funciona ahora mismo (sin configurar nada)

Abre `index.html` en el navegador y ya ves la parrilla con los 5 posts que hay en `CST IBERICA`. Los botones **Aprobar/Rechazar** funcionan, pero mientras no configures Supabase (paso siguiente) el estado se guarda solo en el navegador de quien hace clic — si tú y tu encargado lo abren cada uno en su móvil, no van a ver el mismo estado. Verás un aviso amarillo arriba recordándotelo.

## Activar el estado compartido (Supabase)

Esto te permite compartir un solo link: tu encargado aprueba/rechaza desde su móvil y tú lo ves reflejado al instante (sin recargar, vía Supabase Realtime).

1. Crea un proyecto en [supabase.com](https://supabase.com) (o reutiliza uno que ya tengas — el de "Desarrollo Homi" también sirve, es una tabla nueva e independiente).
2. `Project Settings > API`: copia el **Project URL** y la **anon public key**.
3. `SQL Editor > New query`: pega y ejecuta todo el contenido de [`supabase/schema.sql`](supabase/schema.sql). Crea la tabla `cst_post_status`, activa Row Level Security con lectura/escritura pública (pensado para un link interno sin login) y siembra una fila `pendiente` por cada post.
4. Edita [`js/supabase-config.js`](js/supabase-config.js):
   ```js
   window.CST_SUPABASE_CONFIG = {
     url: "https://tu-proyecto.supabase.co",
     anonKey: "tu-anon-public-key",
   };
   ```
5. Recarga la página: el aviso amarillo desaparece y ya está compartido.

## Publicar un link (para que tu encargado no necesite el archivo)

La forma más simple, igual que en `Desarrollo-Homi`: sube esta carpeta a un repo de GitHub y activa **Settings > Pages** (rama `main`, carpeta raíz). En un par de minutos tienes una URL pública que le puedes pasar por WhatsApp una sola vez (o por donde prefieras) — a partir de ahí, todo el ida y vuelta de aprobación pasa por la página, no por el chat.

## Añadir o editar posts

- **Cambiar texto**: edita el campo `caption` de cada post en `js/data.js`. Los textos actuales son un borrador generado a partir de los nombres de archivo — revísalos.
- **Añadir un post nuevo**:
  1. Crea `assets/posts/tu-post/` con las imágenes `1.png`, `2.png`, ...
  2. Añade un objeto en `js/data.js` con un `id` único.
  3. Añade ese mismo `id` en el `insert` de `supabase/schema.sql` y vuelve a ejecutarlo (es seguro, no duplica).
- **Video pesado**: el video final de "Mantenimiento de motor" (`Mantenimiento Motor.mp4`, 109 MB) no se copió aquí por tamaño — el post usa 3 fotos del proceso para aprobar la idea. Si quieres, puedes recortar/comprimir el video y subirlo aparte, o mandarlo directo una vez aprobado el concepto.

## Origen de las imágenes

Las imágenes se copiaron desde `Alin- MKT/RRSS/CST IBERICA/` (carpetas `INSTALACIONES`, `JULIO`, `Montaje Motor`, `REPARACIONES`). Para `REPARACIONES` se usó la carpeta `POST` (versión ya editada), no `ORIGINALES`.
