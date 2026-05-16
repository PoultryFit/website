
-- ============ ROLES ============
create type public.app_role as enum ('seeker', 'owner', 'admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins read all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============ PROFILE TABLES ============
create table public.space_seekers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  national_id text not null,
  created_at timestamptz not null default now(),
  last_login timestamptz
);
alter table public.space_seekers enable row level security;

create policy "Seekers read own profile" on public.space_seekers
  for select to authenticated using (auth.uid() = id);
create policy "Seekers update own profile" on public.space_seekers
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Seekers insert own profile" on public.space_seekers
  for insert to authenticated with check (auth.uid() = id);
create policy "Admins read all seekers" on public.space_seekers
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.space_owners (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  national_id text not null,
  business_description text not null,
  created_at timestamptz not null default now(),
  last_login timestamptz,
  verification_status text not null default 'unverified',
  plan_type text not null default 'free'
);
alter table public.space_owners enable row level security;

create policy "Owners read own profile" on public.space_owners
  for select to authenticated using (auth.uid() = id);
create policy "Owners update own profile" on public.space_owners
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Owners insert own profile" on public.space_owners
  for insert to authenticated with check (auth.uid() = id);
create policy "Anyone reads owner contact for active spaces" on public.space_owners
  for select to authenticated using (true);
create policy "Admins read all owners" on public.space_owners
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ============ SPACES ============
create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.space_owners(id) on delete cascade,
  title text not null,
  description text not null,
  space_type text not null,
  listing_type text not null check (listing_type in ('rent','sale')),
  county text not null,
  town text not null,
  estate text,
  price numeric not null,
  price_negotiable boolean not null default false,
  size_sqft numeric,
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  latitude double precision,
  longitude double precision,
  status text not null default 'active' check (status in ('active','inactive')),
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.spaces enable row level security;

create index spaces_county_idx on public.spaces(county);
create index spaces_town_idx on public.spaces(town);
create index spaces_type_idx on public.spaces(space_type);
create index spaces_listing_idx on public.spaces(listing_type);
create index spaces_price_idx on public.spaces(price);
create index spaces_status_idx on public.spaces(status);
create index spaces_owner_idx on public.spaces(owner_id);

create policy "Anyone reads active spaces" on public.spaces
  for select to authenticated using (status = 'active' or owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Owners insert own spaces" on public.spaces
  for insert to authenticated with check (owner_id = auth.uid());
create policy "Owners update own spaces" on public.spaces
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Owners delete own spaces" on public.spaces
  for delete to authenticated using (owner_id = auth.uid());
create policy "Admins manage all spaces" on public.spaces
  for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger spaces_touch before update on public.spaces
  for each row execute function public.touch_updated_at();

-- ============ SAVED ============
create table public.saved_spaces (
  id uuid primary key default gen_random_uuid(),
  seeker_id uuid not null references public.space_seekers(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (seeker_id, space_id)
);
alter table public.saved_spaces enable row level security;

create policy "Seekers manage own saves" on public.saved_spaces
  for all to authenticated
  using (seeker_id = auth.uid())
  with check (seeker_id = auth.uid());
create policy "Admins read all saves" on public.saved_spaces
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ============ FEEDBACK ============
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_role text not null,
  message text not null,
  rating integer check (rating between 1 and 5),
  created_at timestamptz not null default now()
);
alter table public.feedback enable row level security;

create policy "Users insert own feedback" on public.feedback
  for insert to authenticated with check (user_id = auth.uid());
create policy "Users read own feedback" on public.feedback
  for select to authenticated using (user_id = auth.uid());
create policy "Admins read all feedback" on public.feedback
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete feedback" on public.feedback
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ============ SUPPORT MESSAGES ============
create table public.support_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
alter table public.support_messages enable row level security;

create policy "Anyone submits support" on public.support_messages
  for insert to anon, authenticated with check (true);
create policy "Admins read support" on public.support_messages
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete support" on public.support_messages
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ============ WAITLIST ============
create table public.space_waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);
alter table public.space_waitlist enable row level security;
create policy "Anyone joins waitlist" on public.space_waitlist
  for insert to anon, authenticated with check (true);
create policy "Admins read waitlist" on public.space_waitlist
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ============ ROLE ASSIGNMENT TRIGGER ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role', 'seeker');
begin
  if v_role = 'seeker' then
    insert into public.user_roles (user_id, role) values (new.id, 'seeker') on conflict do nothing;
    insert into public.space_seekers (id, full_name, email, phone, national_id)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      new.email,
      coalesce(new.raw_user_meta_data->>'phone', ''),
      coalesce(new.raw_user_meta_data->>'national_id', '')
    ) on conflict (id) do nothing;
  elsif v_role = 'owner' then
    insert into public.user_roles (user_id, role) values (new.id, 'owner') on conflict do nothing;
    insert into public.space_owners (id, full_name, email, phone, national_id, business_description)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      new.email,
      coalesce(new.raw_user_meta_data->>'phone', ''),
      coalesce(new.raw_user_meta_data->>'national_id', ''),
      coalesce(new.raw_user_meta_data->>'business_description', '')
    ) on conflict (id) do nothing;
  end if;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ VIEW INCREMENT ============
create or replace function public.increment_space_views(_space_id uuid)
returns void language sql security definer set search_path = public
as $$
  update public.spaces set views = views + 1 where id = _space_id;
$$;

-- ============ STORAGE BUCKET ============
insert into storage.buckets (id, name, public)
values ('space-images', 'space-images', true)
on conflict (id) do nothing;

create policy "Public read space images" on storage.objects
  for select using (bucket_id = 'space-images');
create policy "Owners upload space images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'space-images' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Owners update own space images" on storage.objects
  for update to authenticated
  using (bucket_id = 'space-images' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Owners delete own space images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'space-images' and auth.uid()::text = (storage.foldername(name))[1]);
