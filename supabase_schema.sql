-- ============================================
-- PLAYLIO — Schema complet baza de date
-- Ruleaza in Supabase > SQL Editor
-- ============================================

-- PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null unique,
  full_name text,
  role text not null default 'child' check (role in ('child', 'parent')),
  parent_id uuid references public.profiles(id) on delete set null,
  coins integer not null default 0,
  level integer not null default 1,
  xp integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AVATARS
create table if not exists public.avatars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  hair_color text not null default '#8B4513',
  hair_style text not null default 'short',
  skin_tone text not null default '#FDBCB4',
  eye_color text not null default '#4A90D9',
  outfit_style text not null default 'casual',
  outfit_color text not null default '#4FC3F7',
  accessories jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- PROGRESS
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  world text not null,
  level integer not null default 1,
  xp integer not null default 0,
  quests_completed integer not null default 0,
  time_played_seconds integer not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id, world)
);

-- LEARNING PROGRESS
create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  game_type text not null,
  item_id text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  mastered boolean not null default false,
  last_seen timestamptz not null default now(),
  unique(user_id, game_type, item_id)
);

-- QUESTS
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  world text not null,
  zone text,
  title text not null,
  description text,
  difficulty text not null default 'easy' check (difficulty in ('easy', 'medium', 'hard', 'special')),
  reward_coins integer not null default 10,
  reward_item text,
  is_daily boolean not null default false,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- QUEST COMPLETIONS
create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  quest_id uuid references public.quests(id) on delete cascade not null,
  completed_at timestamptz not null default now(),
  unique(user_id, quest_id)
);

-- INVENTORY
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_id text not null,
  item_type text not null check (item_type in ('furniture', 'decoration', 'wallpaper', 'avatar_item', 'special')),
  acquired_at timestamptz not null default now(),
  unique(user_id, item_id)
);

-- BUILDER STATE
create table if not exists public.builder_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  room_data jsonb not null default '{}',
  unlocked_rooms text[] not null default '{"bedroom"}',
  updated_at timestamptz not null default now()
);

-- COIN TRANSACTIONS
create table if not exists public.coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount integer not null,
  reason text not null,
  world text,
  created_at timestamptz not null default now()
);

-- DAILY REWARDS
create table if not exists public.daily_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  reward_date date not null default current_date,
  day_streak integer not null default 1,
  coins_earned integer not null default 10,
  unique(user_id, reward_date)
);

-- JUMP SCORES
create table if not exists public.jump_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  level_id text not null,
  score integer not null default 0,
  stars integer not null default 0,
  time_ms integer,
  created_at timestamptz not null default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.avatars enable row level security;
alter table public.progress enable row level security;
alter table public.learning_progress enable row level security;
alter table public.quests enable row level security;
alter table public.quest_completions enable row level security;
alter table public.inventory enable row level security;
alter table public.builder_state enable row level security;
alter table public.coin_transactions enable row level security;
alter table public.daily_rewards enable row level security;
alter table public.jump_scores enable row level security;

-- Profiles: fiecare vede profilul sau + copiii sai
create policy "profiles_select" on public.profiles for select
  using (auth.uid() = id or auth.uid() = parent_id);
create policy "profiles_insert" on public.profiles for insert
  with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update
  using (auth.uid() = id);

-- Avatars
create policy "avatars_all" on public.avatars for all
  using (auth.uid() = user_id);

-- Progress
create policy "progress_all" on public.progress for all
  using (auth.uid() = user_id);

-- Learning progress
create policy "learning_progress_all" on public.learning_progress for all
  using (auth.uid() = user_id);

-- Quests: toata lumea vede, nimeni nu modifica direct
create policy "quests_select" on public.quests for select
  using (is_active = true);

-- Quest completions
create policy "quest_completions_all" on public.quest_completions for all
  using (auth.uid() = user_id);

-- Inventory
create policy "inventory_all" on public.inventory for all
  using (auth.uid() = user_id);

-- Builder state
create policy "builder_state_all" on public.builder_state for all
  using (auth.uid() = user_id);

-- Coin transactions
create policy "coin_transactions_all" on public.coin_transactions for all
  using (auth.uid() = user_id);

-- Daily rewards
create policy "daily_rewards_all" on public.daily_rewards for all
  using (auth.uid() = user_id);

-- Jump scores
create policy "jump_scores_all" on public.jump_scores for all
  using (auth.uid() = user_id);

-- ============================================
-- FUNCTII
-- ============================================

-- Creeaza automat profilul la inregistrare
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'parent')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Adauga monede cu tranzactie
create or replace function public.add_coins(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_world text default null
)
returns void language plpgsql security definer as $$
begin
  update public.profiles
  set coins = coins + p_amount, updated_at = now()
  where id = p_user_id;

  insert into public.coin_transactions (user_id, amount, reason, world)
  values (p_user_id, p_amount, p_reason, p_world);
end;
$$;

-- Inregistreaza progres educational
create or replace function public.record_learning(
  p_user_id uuid,
  p_game_type text,
  p_item_id text,
  p_correct boolean
)
returns void language plpgsql security definer as $$
begin
  insert into public.learning_progress (user_id, game_type, item_id, attempts, correct, mastered, last_seen)
  values (p_user_id, p_game_type, p_item_id, 1, case when p_correct then 1 else 0 end, false, now())
  on conflict (user_id, game_type, item_id) do update set
    attempts = learning_progress.attempts + 1,
    correct = learning_progress.correct + case when p_correct then 1 else 0 end,
    mastered = (learning_progress.correct + case when p_correct then 1 else 0 end) >= 5,
    last_seen = now();
end;
$$;

-- ============================================
-- DATE INITIALE — Quests de baza
-- ============================================

insert into public.quests (world, zone, title, description, difficulty, reward_coins, order_index) values
('adventure', 'forest', 'Prima padure', 'Exploreaza padurea fermecata', 'easy', 15, 1),
('adventure', 'forest', 'Culegator de fructe', 'Gaseste 5 fructe in padure', 'easy', 20, 2),
('adventure', 'mountain', 'Urca muntele', 'Ajunge la varful muntelui', 'medium', 30, 3),
('learning', 'letters', 'ABC-ul magic', 'Invata primele 5 litere', 'easy', 25, 1),
('learning', 'letters', 'Vocale vesele', 'Gaseste toate vocalele', 'easy', 25, 2),
('learning', 'numbers', 'Sa numaram', 'Numara de la 1 la 10', 'easy', 20, 1),
('learning', 'numbers', 'Adunare simpla', 'Rezolva 5 adunari simple', 'medium', 30, 2),
('jump', null, 'Salt de incepator', 'Termina primul nivel', 'easy', 15, 1),
('jump', null, 'Colector de stele', 'Obtine 3 stele pe un nivel', 'medium', 35, 2),
('builder', null, 'Primul tau camin', 'Plaseaza 5 obiecte in camera', 'easy', 20, 1),
('builder', null, 'Designer talentat', 'Decoreaza camera cu 10 obiecte', 'medium', 40, 2)
on conflict do nothing;
