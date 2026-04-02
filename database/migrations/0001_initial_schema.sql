create table if not exists users (
  id uuid primary key,
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz not null default timezone('utc', now())
);

create table if not exists social_accounts (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  provider text not null,
  provider_user_id text not null,
  username text,
  status text not null default 'active',
  access_token text not null,
  token_expires_at timestamptz,
  permissions_json jsonb,
  metadata_json jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists social_accounts_user_id_idx on social_accounts(user_id);
create index if not exists social_accounts_provider_provider_user_id_idx on social_accounts(provider, provider_user_id);

create table if not exists scheduled_posts (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  social_account_id uuid not null references social_accounts(id) on delete cascade,
  provider text not null,
  post_type text not null default 'image',
  caption text not null,
  media_url text not null,
  scheduled_for timestamptz not null,
  status text not null default 'scheduled',
  provider_post_id text,
  last_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz
);

create index if not exists scheduled_posts_user_id_idx on scheduled_posts(user_id);
create index if not exists scheduled_posts_status_scheduled_for_idx on scheduled_posts(status, scheduled_for);

create table if not exists post_executions (
  id uuid primary key,
  scheduled_post_id uuid not null references scheduled_posts(id) on delete cascade,
  attempt_no integer not null,
  status text not null,
  request_payload jsonb,
  response_payload jsonb,
  error_message text,
  created_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz
);

create index if not exists post_executions_scheduled_post_id_idx on post_executions(scheduled_post_id);
