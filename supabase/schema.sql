-- ============================================
-- FRUITLY DATABASE SCHEMA
-- Ejecutar completo en Supabase SQL Editor
-- ============================================

-- 1. EXTENSIONES
create extension if not exists "uuid-ossp";

-- ============================================
-- 2. TABLAS
-- ============================================

-- Profiles (extiende auth.users de Supabase)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  nombre      text not null,
  email       text not null,
  role        text not null check (role in ('trabajador', 'administrador')),
  activo      boolean default true,
  created_at  timestamptz default now()
);

-- Productos
create table public.productos (
  id          uuid default uuid_generate_v4() primary key,
  nombre      text not null,
  unidad      text not null check (unidad in ('kg', 'unidad', 'caja')),
  activo      boolean default true,
  created_at  timestamptz default now()
);

-- Clientes
create table public.clientes (
  id          uuid default uuid_generate_v4() primary key,
  nombre      text not null,
  email       text not null,
  nif         text not null,
  direccion   text,
  telefono    text,
  created_at  timestamptz default now()
);

-- Compras (registradas por el trabajador)
create table public.compras (
  id              uuid default uuid_generate_v4() primary key,
  trabajador_id   uuid references public.profiles(id) not null,
  producto_id     uuid references public.productos(id) not null,
  cantidad_kg     numeric(10,2) not null,
  precio_compra   numeric(10,2) not null,
  estado          text not null default 'pendiente'
                  check (estado in ('pendiente', 'completada', 'cancelada')),
  notas           text,
  created_at      timestamptz default now()
);

-- Ventas (completadas por el administrador)
create table public.ventas (
  id                uuid default uuid_generate_v4() primary key,
  compra_id         uuid references public.compras(id) not null,
  cliente_id        uuid references public.clientes(id) not null,
  pvp               numeric(10,2) not null,
  tipo_iva          numeric(4,2) not null check (tipo_iva in (4, 10, 21)),
  total_con_iva     numeric(10,2) generated always as
                    (pvp + (pvp * tipo_iva / 100)) stored,
  factura_pdf_url   text,
  enviada           boolean default false,
  created_at        timestamptz default now()
);

-- ============================================
-- 3. TRIGGER: auto-crear profile al registrar usuario
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nombre, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', 'Sin nombre'),
    coalesce(new.raw_user_meta_data->>'role', 'trabajador')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.profiles  enable row level security;
alter table public.productos  enable row level security;
alter table public.clientes   enable row level security;
alter table public.compras    enable row level security;
alter table public.ventas     enable row level security;

-- PROFILES
create policy "Usuario ve su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admin ve todos los perfiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrador'
    )
  );

-- PRODUCTOS (todos los autenticados pueden leer)
create policy "Autenticados ven productos"
  on public.productos for select
  using (auth.role() = 'authenticated');

create policy "Solo admin gestiona productos"
  on public.productos for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrador'
    )
  );

-- CLIENTES (solo admin)
create policy "Solo admin gestiona clientes"
  on public.clientes for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrador'
    )
  );

-- COMPRAS
create policy "Trabajador ve sus propias compras"
  on public.compras for select
  using (trabajador_id = auth.uid());

create policy "Trabajador crea compras"
  on public.compras for insert
  with check (trabajador_id = auth.uid());

create policy "Admin ve todas las compras"
  on public.compras for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrador'
    )
  );

-- VENTAS (solo admin)
create policy "Solo admin gestiona ventas"
  on public.ventas for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'administrador'
    )
  );

-- ============================================
-- 5. REALTIME
-- ============================================

alter publication supabase_realtime add table public.compras;
alter publication supabase_realtime add table public.ventas;

-- ============================================
-- 6. DATOS INICIALES (productos de ejemplo)
-- ============================================

insert into public.productos (nombre, unidad) values
  ('Manzana Golden', 'kg'),
  ('Naranja Valencia', 'kg'),
  ('Tomate Rama', 'kg'),
  ('Lechuga Romana', 'unidad'),
  ('Pimiento Rojo', 'kg'),
  ('Plátano de Canarias', 'kg'),
  ('Pera Conferencia', 'kg'),
  ('Calabacín', 'kg');
