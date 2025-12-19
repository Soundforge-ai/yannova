-- Maak de sites tabel aan
create table if not exists public.sites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content jsonb default '{}'::jsonb,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Maak een index aan voor snellere queries op user_id
create index if not exists sites_user_id_idx on public.sites(user_id);

-- Maak een index aan voor snellere queries op is_published
create index if not exists sites_is_published_idx on public.sites(is_published);

-- Enable Row Level Security
alter table public.sites enable row level security;

-- Policy: gebruikers kunnen alleen hun eigen sites zien
create policy "Users can view their own sites"
  on public.sites
  for select
  using (auth.uid() = user_id);

-- Policy: gebruikers kunnen alleen hun eigen sites aanmaken
create policy "Users can insert their own sites"
  on public.sites
  for insert
  with check (auth.uid() = user_id);

-- Policy: gebruikers kunnen alleen hun eigen sites updaten
create policy "Users can update their own sites"
  on public.sites
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: gebruikers kunnen alleen hun eigen sites verwijderen
create policy "Users can delete their own sites"
  on public.sites
  for delete
  using (auth.uid() = user_id);

-- Functie om updated_at automatisch bij te werken
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger om updated_at automatisch bij te werken bij updates
create trigger set_updated_at
  before update on public.sites
  for each row
  execute function public.handle_updated_at();

