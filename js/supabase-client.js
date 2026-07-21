// Capa de acceso a datos: guarda y lee el estado de aprobación de cada post.
//
// Si supabase-config.js todavía tiene los valores de ejemplo (o el script de
// Supabase no cargó), cae a un modo demo con localStorage: funciona igual en
// pantalla, pero el estado no se comparte entre dispositivos.

(function () {
  const cfg = window.CST_SUPABASE_CONFIG || {};
  const isConfigured =
    !!cfg.url &&
    !!cfg.anonKey &&
    !cfg.url.includes("TU-PROYECTO") &&
    typeof window.supabase !== "undefined";

  const client = isConfigured
    ? window.supabase.createClient(cfg.url, cfg.anonKey)
    : null;

  const LOCAL_KEY = "cst_rrss_status_v1";

  function localGetAll() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function localSet(postId, status, note) {
    const all = localGetAll();
    all[postId] = {
      post_id: postId,
      status,
      note: note || null,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
    return all[postId];
  }

  window.CST_DATA = {
    isConfigured,

    // Devuelve { [post_id]: { post_id, status, note, updated_at } }
    async fetchStatuses() {
      if (client) {
        const { data, error } = await client
          .from("cst_post_status")
          .select("*");
        if (error) {
          console.error("Error leyendo estados de Supabase:", error);
          return {};
        }
        const map = {};
        (data || []).forEach((row) => {
          map[row.post_id] = row;
        });
        return map;
      }
      return localGetAll();
    },

    async setStatus(postId, status, note) {
      if (client) {
        const { data, error } = await client
          .from("cst_post_status")
          .update({
            status,
            note: note ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("post_id", postId)
          .select()
          .single();
        if (error) {
          console.error("Error guardando estado en Supabase:", error);
          throw error;
        }
        return data;
      }
      return localSet(postId, status, note);
    },

    // onChange(row) se llama cada vez que cambia una fila (en cualquier
    // navegador). Devuelve una función para cancelar la suscripción.
    subscribeToChanges(onChange) {
      if (!client) return () => {};
      const channel = client
        .channel("cst_post_status_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "cst_post_status" },
          (payload) => onChange(payload.new || payload.old)
        )
        .subscribe();
      return () => client.removeChannel(channel);
    },
  };
})();
