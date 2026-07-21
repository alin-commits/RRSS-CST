// Configuración pública de Supabase.
//
// Rellena estos dos valores con los de tu proyecto:
// Supabase Dashboard > Project Settings > API
//   - Project URL          -> url
//   - anon / public key    -> anonKey
//
// IMPORTANTE: la "anon key" está pensada para ser pública (va en el
// navegador de cualquier visitante que abra el link). La seguridad real la
// da Row Level Security (RLS), definida en supabase/schema.sql, no el hecho
// de ocultar esta clave.
//
// Mientras estos valores sigan siendo los de ejemplo, la página funciona en
// modo demo local: los clics en Aprobar/Rechazar se guardan solo en el
// navegador de quien los hace (localStorage), no se comparten entre
// dispositivos. Ver README.md para activar el estado compartido real.

window.CST_SUPABASE_CONFIG = {
  url: "https://TU-PROYECTO.supabase.co",
  anonKey: "TU-ANON-KEY",
};
