-- 그래프 블라인드 결정 · Supabase 설정
-- Supabase › SQL Editor › New query 에 이 내용을 통째로 붙여 넣고 Run 을 누르세요. 한 번만 하면 돼요.

-- 1. 라운드 기록: 분석 모둠 한 줄에 분석 결과와 짝 모둠의 복원 결과가 함께 저장돼요.
create table if not exists public.rounds (
  class_code     text    not null,
  round_no       int     not null,
  analyst_group  int     not null,
  recon_group    int     not null,
  case_id        text    not null,
  stage          text    default 'analyzing',
  coef_ok        boolean default false,
  roots_ok       boolean default false,
  sent_cards     int[]   default '{}',
  card_reasons   jsonb   default '{}'::jsonb,
  exact          boolean,
  an_score       int     default 0,
  recon_stage    text,
  extra_card     int,
  eliminated     text[]  default '{}',
  chosen         text,
  answer         text,
  why            text,
  graph_ok       boolean,
  ans_ok         boolean,
  gr_score       int     default 0,
  updated_at     timestamptz default now(),
  primary key (class_code, round_no, analyst_group)
);

-- 2. 올린 사진과 개형 그림
create table if not exists public.uploads (
  id          bigint generated always as identity primary key,
  class_code  text not null,
  round_no    int  not null,
  group_no    int  not null,
  kind        text not null,
  url         text not null,
  created_at  timestamptz default now()
);

-- 3. 로그인 없는 수업용 접근 허용 (학생 이름 같은 개인정보는 저장하지 않아요)
alter table public.rounds  enable row level security;
alter table public.uploads enable row level security;
drop policy if exists "class rounds"  on public.rounds;
drop policy if exists "class uploads" on public.uploads;
create policy "class rounds"  on public.rounds  for all to anon using (true) with check (true);
create policy "class uploads" on public.uploads for all to anon using (true) with check (true);

-- 4. 사진 저장 공간
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true)
on conflict (id) do nothing;
drop policy if exists "class upload files" on storage.objects;
drop policy if exists "class read files"   on storage.objects;
create policy "class upload files" on storage.objects for insert to anon with check (bucket_id = 'uploads');
create policy "class read files"   on storage.objects for select to anon using (bucket_id = 'uploads');
