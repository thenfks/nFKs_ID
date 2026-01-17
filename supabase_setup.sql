-- Create a table for public user profiles
create table if not exists user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  profession text,
  height text,
  weight text,
  recovery_email text,
  recovery_phone text,
  languages text,
  home_address text,
  work_address text,
  phone text,
  birthday text,
  gender text,
  updated_at timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table user_profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on user_profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on user_profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on user_profiles for update
  using ( auth.uid() = id );

-- Create a storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up storage policies for avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update their own avatar."
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'avatars' );


-- ---------------------------------------------------------
-- LOGIC FOR DELETING OLD AVATARS AFTER 1 WEEK
-- ---------------------------------------------------------

-- 1. Create a queue table to track avatars scheduled for deletion
create table if not exists avatar_cleanup_queue (
  id uuid default gen_random_uuid() primary key,
  avatar_path text not null,
  scheduled_deletion_time timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

alter table avatar_cleanup_queue enable row level security;

-- 2. Create a function to extract path and add to queue
create or replace function queue_old_avatar_for_deletion()
returns trigger as $$
declare
  old_path text;
begin
  -- Check if avatar_url has changed and was not null
  if (OLD.avatar_url is distinct from NEW.avatar_url) and (OLD.avatar_url is not null) then
    -- Extract the storage path from the public URL
    -- Assumes URL format: .../avatars/USER_ID/TIMESTAMP.ext
    -- We split by '/avatars/' and get the second part
    begin
        old_path := split_part(OLD.avatar_url, '/avatars/', 2);
        
        if old_path != '' then
            insert into avatar_cleanup_queue (avatar_path, scheduled_deletion_time)
            values (old_path, now() + interval '1 week');
        end if;
    exception when others then
        -- Ignore errors in extraction to prevent blocking the update
        raise warning 'Failed to queue avatar deletion: %', SQLERRM;
    end;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- 3. Create the trigger on user_profiles
drop trigger if exists on_avatar_update on user_profiles;
create trigger on_avatar_update
  before update on user_profiles
  for each row
  execute function queue_old_avatar_for_deletion();

-- 4. Create a function to process the queue (perform the deletions)
-- This function can be scheduled via pg_cron or called periodically via RPC/Edge Function
create or replace function process_avatar_cleanup()
returns void as $$
declare
  r record;
begin
  -- Loop through expired items
  for r in select * from avatar_cleanup_queue where scheduled_deletion_time <= now() loop
    -- Delete from Supabase Storage (storage.objects table)
    -- This requires appropriate permissions or security definer
    delete from storage.objects
    where bucket_id = 'avatars' and name = r.avatar_path;
    
    -- Remove from queue
    delete from avatar_cleanup_queue where id = r.id;
  end loop;
end;
$$ language plpgsql security definer;

-- Optional: If pg_cron is available, schedule the cleanup daily
-- create extension if not exists pg_cron;
-- select cron.schedule('cleanup-avatars-daily', '0 0 * * *', 'select process_avatar_cleanup()');
