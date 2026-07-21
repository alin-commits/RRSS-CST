// Posts de ejemplo / catálogo de la parrilla.
//
// Esto NO guarda el estado de aprobación (eso vive en Supabase o, si no está
// configurado, en localStorage). Este archivo solo describe QUÉ posts existen:
// título, carpeta de imágenes y texto (caption) propuesto.
//
// Los textos (caption) son un BORRADOR generado a partir de los nombres de
// archivo — revísalos y edítalos aquí antes de compartir el link con tu
// encargado.
//
// Para añadir un post nuevo:
// 1. Crea una carpeta en assets/posts/tu-post/ con las imágenes 1.png, 2.png, ...
// 2. Añade un objeto aquí con un "id" único (en minúsculas, sin espacios).
// 3. Añade ese mismo "id" en supabase/schema.sql (insert ... on conflict do nothing)
//    para que tenga una fila de estado desde el arranque.

window.CST_POSTS = [
  {
    id: "instalacion-aire-comprimido",
    title: "Instalación de aire comprimido",
    type: "carousel",
    folder: "assets/posts/instalacion-aire-comprimido",
    images: ["1.png", "2.png", "3.png", "4.png"],
    caption:
      "Así dejamos esta instalación de aire comprimido 💨🔧 Otro proyecto entregado por el equipo de CST Ibérica.",
  },
  {
    id: "presentacion-larga",
    title: "Presentación CST Ibérica — versión larga",
    type: "carousel",
    folder: "assets/posts/presentacion-larga",
    images: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png"],
    caption:
      "Conoce quiénes somos 👋 Versión larga (7 slides) del post de presentación de CST Ibérica.",
  },
  {
    id: "presentacion-corta",
    title: "Presentación CST Ibérica — versión corta",
    type: "carousel",
    folder: "assets/posts/presentacion-corta",
    images: ["1.png", "2.png", "3.png", "4.png"],
    caption:
      "Conoce quiénes somos 👋 Versión corta (4 slides) del post de presentación de CST Ibérica.",
  },
  {
    id: "mantenimiento-motor",
    title: "Mantenimiento de motor eléctrico",
    type: "video-pending",
    folder: "assets/posts/mantenimiento-motor",
    images: ["1.jpeg", "2.jpeg", "3.jpeg"],
    caption:
      "Mantenimiento y montaje de motor eléctrico 🛠️⚡ Proceso completo documentado por el equipo.",
    videoNote:
      'El video final "Mantenimiento Motor.mp4" (109 MB) es demasiado pesado para esta web — se queda en la carpeta original. Estas fotos son del proceso, para aprobar la idea del post antes de montar el video definitivo.',
  },
  {
    id: "reparacion-repuestos",
    title: "Reparación de repuestos",
    type: "carousel",
    folder: "assets/posts/reparacion-repuestos",
    images: [
      "1.png",
      "2.png",
      "3.png",
      "4.png",
      "5.png",
      "6.png",
      "7.png",
      "8.png",
      "9.png",
      "10.png",
    ],
    caption:
      "Así entregamos este repuesto reparado y listo para funcionar 🔩 Antes y después del trabajo del taller.",
  },
];
