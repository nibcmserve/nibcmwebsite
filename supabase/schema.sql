-- =============================================
-- NIBCM 국제선교회 웹 플랫폼 DB 스키마
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. profiles (사용자 프로필 - auth.users 확장)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'missionary'
    check (role in ('super_admin', 'admin', 'staff', 'missionary', 'board')),
  language text default 'ko',
  created_at timestamptz default now()
);

-- 2. missionaries (선교사)
create table if not exists public.missionaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  korean_name text not null,
  english_name text,
  country text,
  city text,
  ministry_type text,
  status text default '사역 중'
    check (status in ('사역 중', '안식년', '안식월', '귀국', '대기')),
  bio_ko text,
  bio_en text,
  profile_image_url text,
  started_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. applications (신청)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  missionary_id uuid references public.missionaries(id) on delete cascade,
  application_type text not null
    check (application_type in ('휴가', '안식년', '안식월', '항공권 지원', '건강지원', '가족여행', '선교관', '차량')),
  title text not null,
  content text,
  status text default 'pending'
    check (status in ('pending', 'reviewing', 'approved', 'rejected', 'cancelled')),
  admin_comment text,
  submitted_at timestamptz default now(),
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. documents (문서)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  file_url text not null,
  owner_id uuid references public.profiles(id) on delete set null,
  missionary_id uuid references public.missionaries(id) on delete set null,
  application_id uuid references public.applications(id) on delete set null,
  visibility text default 'private'
    check (visibility in ('private', 'staff', 'admin', 'public')),
  created_at timestamptz default now()
);

-- 5. reports (보고서)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  missionary_id uuid references public.missionaries(id) on delete cascade,
  title text not null,
  content text,
  report_type text
    check (report_type in ('monthly', 'quarterly', 'annual')),
  period_start date,
  period_end date,
  status text default 'draft'
    check (status in ('draft', 'submitted', 'reviewed', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. donations (후원)
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  missionary_id uuid references public.missionaries(id) on delete set null,
  donor_name text,
  amount numeric not null check (amount > 0),
  currency text default 'KRW',
  donated_at date not null,
  memo text,
  created_at timestamptz default now()
);

-- 7. news (뉴스/소식)
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title_ko text not null,
  title_en text,
  content_ko text,
  content_en text,
  slug text unique,
  category text default 'news',
  thumbnail_url text,
  status text default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now()
);

-- 8. testimonies (간증/사역보고)
create table if not exists public.testimonies (
  id uuid primary key default gen_random_uuid(),
  title_ko text not null,
  title_en text,
  content_ko text,
  content_en text,
  missionary_id uuid references public.missionaries(id) on delete set null,
  image_url text,
  status text default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now()
);

-- 9. contacts (문의)
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  status text default 'new'
    check (status in ('new', 'read', 'replied')),
  created_at timestamptz default now()
);

-- =============================================
-- RLS (Row Level Security) 정책
-- =============================================

alter table public.profiles enable row level security;
alter table public.missionaries enable row level security;
alter table public.applications enable row level security;
alter table public.documents enable row level security;
alter table public.reports enable row level security;
alter table public.donations enable row level security;
alter table public.news enable row level security;
alter table public.testimonies enable row level security;
alter table public.contacts enable row level security;

-- profiles: 자신의 프로필만 조회/수정 가능, admin은 전체 조회
create policy "profiles: 자신 조회" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: 자신 수정" on public.profiles
  for update using (auth.uid() = id);

-- missionaries: 공개 데이터는 누구나 조회 (사역 중인 선교사)
create policy "missionaries: 공개 조회" on public.missionaries
  for select using (status = '사역 중');

create policy "missionaries: 인증 사용자 전체 조회" on public.missionaries
  for select using (auth.uid() is not null);

create policy "missionaries: admin만 생성/수정/삭제" on public.missionaries
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('super_admin', 'admin', 'staff')
    )
  );

-- applications: 본인 신청 조회, admin은 전체
create policy "applications: 본인 조회" on public.applications
  for select using (
    missionary_id in (
      select id from public.missionaries where user_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin', 'staff')
    )
  );

create policy "applications: 본인 생성" on public.applications
  for insert with check (auth.uid() is not null);

create policy "applications: admin 수정" on public.applications
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin', 'staff')
    )
  );

-- news: 공개된 것은 누구나 조회
create policy "news: 공개 조회" on public.news
  for select using (status = 'published');

create policy "news: admin 전체 관리" on public.news
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin', 'staff')
    )
  );

-- testimonies: 공개된 것은 누구나 조회
create policy "testimonies: 공개 조회" on public.testimonies
  for select using (status = 'published');

create policy "testimonies: admin 전체 관리" on public.testimonies
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin', 'staff')
    )
  );

-- contacts: 누구나 생성, admin만 조회
create policy "contacts: 누구나 생성" on public.contacts
  for insert with check (true);

create policy "contacts: admin 조회" on public.contacts
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin', 'staff')
    )
  );

-- donations: admin만 관리
create policy "donations: admin 관리" on public.donations
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin', 'board')
    )
  );

-- documents: visibility 기반 접근
create policy "documents: 공개 문서 조회" on public.documents
  for select using (visibility = 'public');

create policy "documents: 인증 사용자 staff급 문서" on public.documents
  for select using (
    auth.uid() is not null and visibility in ('public', 'staff')
  );

create policy "documents: admin 전체 관리" on public.documents
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

-- reports: 선교사는 본인 것, admin은 전체
create policy "reports: 본인 조회" on public.reports
  for select using (
    missionary_id in (
      select id from public.missionaries where user_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('super_admin', 'admin', 'staff', 'board')
    )
  );

create policy "reports: 본인 생성/수정" on public.reports
  for insert with check (auth.uid() is not null);

-- =============================================
-- 자동 프로필 생성 트리거 (회원가입 시 자동 실행)
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'missionary')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
