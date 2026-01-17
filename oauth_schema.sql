create table if not exists oauth_clients (
  id uuid default gen_random_uuid() primary key,
  client_id text unique not null,
  name text not null,
  redirect_uris text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert some default clients (AyScroll)
insert into oauth_clients (client_id, name, redirect_uris)
values 
  ('ayscroll', 'AyScroll', ARRAY['http://localhost:3000', 'http://localhost:5173', 'https://ayscroll.com', 'https://ayush-auth.vercel.app'])
on conflict (client_id) do nothing;

-- Enable RLS
alter table oauth_clients enable row level security;

-- Allow public read access (since login page needs to verify clients)
-- In a stricter environment, this might be restricted, but for the auth portal it needs to know valid clients.
create policy "Allow public read access to oauth_clients"
  on oauth_clients for select
  using (true);
