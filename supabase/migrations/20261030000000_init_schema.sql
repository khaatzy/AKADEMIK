-- ==========================================================
-- STUDIKA ACADEMIC COMPANION - SUPABASE INITIAL SCHEMA MIGRATION
-- ==========================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS & HELPERS
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 3. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Mahasiswa Studika',
  avatar_path text,
  nim text,
  program_studi text default 'Teknik Informatika',
  semester integer default 4,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profiles trigger for updated_at
create or replace trigger update_profiles_modtime
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 4. COURSES TABLE
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  code text not null,
  lecturer text,
  color text default '#D97706',
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_user_id on public.courses(user_id);

-- 5. FILES (VAULT) TABLE
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  name text not null,
  storage_path text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  kind text not null default 'document' check (kind in ('image', 'document', 'summary', 'formula')),
  created_at timestamptz not null default now()
);

create index if not exists idx_files_user_id on public.files(user_id);
create index if not exists idx_files_course_id on public.files(course_id);

-- 6. SCHEDULES TABLE
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  day_of_week text not null, -- 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
  start_time text not null,  -- e.g. '08:00'
  end_time text not null,    -- e.g. '10:30'
  room text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_schedules_user_id on public.schedules(user_id);
create index if not exists idx_schedules_day on public.schedules(day_of_week);

-- 7. TASKS TABLE
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  description text,
  due_at timestamptz not null default (now() + interval '3 days'),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_due_at on public.tasks(due_at);
create index if not exists idx_tasks_is_done on public.tasks(is_done);

-- 8. EXAMS TABLE
create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  scheduled_at timestamptz not null,
  room text,
  countdown_label text,
  created_at timestamptz not null default now()
);

create index if not exists idx_exams_user_id on public.exams(user_id);

-- 9. CHAT SESSIONS & MESSAGES
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null default 'Diskusi Baru',
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_sessions_user_id on public.chat_sessions(user_id);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  attachment_file_id uuid references public.files(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_session on public.chat_messages(session_id);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.files enable row level security;
alter table public.schedules enable row level security;
alter table public.tasks enable row level security;
alter table public.exams enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- PROFILES policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- COURSES policies
create policy "Users can CRUD own courses"
  on public.courses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- FILES policies
create policy "Users can CRUD own files"
  on public.files for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- SCHEDULES policies
create policy "Users can CRUD own schedules"
  on public.schedules for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- TASKS policies
create policy "Users can CRUD own tasks"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- EXAMS policies
create policy "Users can CRUD own exams"
  on public.exams for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- CHAT SESSIONS policies
create policy "Users can CRUD own chat sessions"
  on public.chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- CHAT MESSAGES policies
create policy "Users can CRUD own chat messages"
  on public.chat_messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==========================================================
-- AUTH TRIGGER: AUTO-CREATE PROFILE ON SIGNUP
-- ==========================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    full_name,
    avatar_path,
    nim,
    program_studi,
    semester
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_path', null),
    coalesce(new.raw_user_meta_data->>'nim', '220411100042'),
    coalesce(new.raw_user_meta_data->>'program_studi', 'Teknik Informatika'),
    coalesce((new.raw_user_meta_data->>'semester')::integer, 4)
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==========================================================
-- STORAGE BUCKETS & STORAGE POLICIES
-- ==========================================================

-- Insert storage buckets if not exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'avatars',
    'avatars',
    true,
    2097152, -- 2 MB
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'vault',
    'vault',
    false,
    26214400, -- 25 MB
    array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS on storage.objects

-- 1. Avatars policy: public read, authenticated user write own folder
create policy "Public can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 2. Vault policy: authenticated user can only access own folder (user_id/...)
create policy "Users can select own vault files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'vault' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can upload to own vault folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'vault' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own vault files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'vault' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own vault files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'vault' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
