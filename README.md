# RRSS CST — Parrilla visual

Galería tipo Instagram para ver los posts propuestos. Solo visual: clic en un post para ver el carrusel completo y el caption.

## Estructura

```txt
RRSS CST/
├── index.html
├── README.md
├── css/styles.css
├── js/
│   ├── data.js    # catálogo de posts (título, imágenes, caption)
│   └── script.js  # grid + modal/carrusel
└── assets/posts/<post>/1.png, 2.png, ...
```

Abre `index.html` en el navegador para verla.

## Añadir o editar posts

- **Cambiar texto**: edita el campo `caption` de cada post en `js/data.js`.
- **Añadir un post nuevo**:
  1. Crea `assets/posts/tu-post/` con las imágenes `1.png`, `2.png`, ...
  2. Añade un objeto en `js/data.js` con un `id` único.

## Publicar un link

Sube esta carpeta a un repo de GitHub y activa **Settings > Pages** (rama `main`, carpeta raíz) para tener una URL pública que compartir.
