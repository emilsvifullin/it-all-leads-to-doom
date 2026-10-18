-- Applied to the Supabase project "padel-id" (xnxhlfuncxyzdfdmqlkb) as migration doom_watchlist_sync.
-- Isolated storage for "It all leads to Doom" watchlist sync; unrelated to padel-id tables.
-- The table lives in a non-exposed schema; the only way in is public.doom_sync() with a 20-char secret code.
create schema if not exists doom;
revoke all on schema doom from public, anon, authenticated;

create table if not exists doom.lists (
  code       text primary key check (code ~ '^[A-Z0-9]{20}$'),
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table doom.lists enable row level security;
revoke all on doom.lists from public, anon, authenticated;

-- Merge a patch of {key: {..., u: <ms timestamp>}} into the list: newest "u" wins per key.
-- An empty patch just returns the current data.
create or replace function public.doom_sync(p_code text, p_patch jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  cur jsonb;
  k   text;
  v   jsonb;
begin
  if p_code is null or p_code !~ '^[A-Z0-9]{20}$' then
    raise exception 'invalid sync code';
  end if;
  p_patch := coalesce(p_patch, '{}'::jsonb);
  if jsonb_typeof(p_patch) <> 'object' or pg_column_size(p_patch) > 262144 then
    raise exception 'invalid patch';
  end if;

  insert into doom.lists(code) values (p_code) on conflict (code) do nothing;
  select data into cur from doom.lists where code = p_code for update;

  if p_patch = '{}'::jsonb then
    return cur;
  end if;

  for k, v in select * from jsonb_each(p_patch) loop
    continue when jsonb_typeof(v) <> 'object' or length(k) > 120;
    if not (cur ? k)
       or coalesce((cur -> k ->> 'u')::numeric, 0) < coalesce((v ->> 'u')::numeric, 0) then
      cur := jsonb_set(cur, array[k], v, true);
    end if;
  end loop;

  if (select count(*) from jsonb_object_keys(cur)) > 2000 then
    raise exception 'too many keys';
  end if;

  update doom.lists set data = cur, updated_at = now() where code = p_code;
  return cur;
end;
$$;

revoke all on function public.doom_sync(text, jsonb) from public, authenticated;
grant execute on function public.doom_sync(text, jsonb) to anon;
