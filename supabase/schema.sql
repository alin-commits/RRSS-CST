-- Estado de aprobación de cada post de la parrilla RRSS CST.
-- Seguro volver a pegar y ejecutar: usa "if not exists" / "on conflict".

create table if not exists public.cst_post_status (
  post_id text primary key,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'aprobado', 'rechazado')),
  note text,
  updated_at timestamptz not null default now()
);

alter table public.cst_post_status enable row level security;

-- Lectura pública: cualquiera con el link ve el estado, sin login.
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'cst_post_status'
      and policyname = 'cst_post_status_select_public'
  ) then
    create policy cst_post_status_select_public
      on public.cst_post_status for select
      using (true);
  end if;
end $$;

-- Escritura pública: cualquiera con el link puede aprobar/rechazar.
-- No hay login de por medio a propósito (es una herramienta interna de baja
-- sensibilidad); si en el futuro quieres restringirlo a un usuario
-- autenticado, cambia "using (true)" por una condición sobre auth.uid().
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'cst_post_status'
      and policyname = 'cst_post_status_update_public'
  ) then
    create policy cst_post_status_update_public
      on public.cst_post_status for update
      using (true)
      with check (status in ('pendiente', 'aprobado', 'rechazado'));
  end if;
end $$;

grant select on public.cst_post_status to anon;
grant update (status, note, updated_at) on public.cst_post_status to anon;

-- Una fila por cada post definido en js/data.js.
-- Si añades un post nuevo ahí, añade su id aquí también.
insert into public.cst_post_status (post_id) values
  ('instalacion-aire-comprimido'),
  ('presentacion-larga'),
  ('presentacion-corta'),
  ('mantenimiento-motor'),
  ('reparacion-repuestos')
on conflict (post_id) do nothing;
