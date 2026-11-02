-- ==========================================================
-- STUDIKA: ADD LEARNER PROFILE FIELDS
-- ==========================================================

-- 1. Add birth_date, institution, and education_level to profiles table
alter table public.profiles
  add column if not exists birth_date date,
  add column if not exists institution text,
  add column if not exists education_level text default 'Pelajar';

-- 2. Update handle_new_user() to populate these fields from raw_user_meta_data
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    full_name,
    avatar_path,
    birth_date,
    institution,
    education_level,
    nim,
    program_studi,
    semester
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_path', new.raw_user_meta_data->>'avatar_url', null),
    (new.raw_user_meta_data->>'birth_date')::date,
    coalesce(new.raw_user_meta_data->>'institution', null),
    coalesce(new.raw_user_meta_data->>'education_level', 'Pelajar'),
    coalesce(new.raw_user_meta_data->>'nim', null),
    coalesce(new.raw_user_meta_data->>'program_studi', null),
    coalesce((new.raw_user_meta_data->>'semester')::integer, 1)
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    birth_date = coalesce(excluded.birth_date, public.profiles.birth_date),
    institution = coalesce(excluded.institution, public.profiles.institution),
    education_level = coalesce(excluded.education_level, public.profiles.education_level);
  return new;
end;
$$ language plpgsql security definer;
