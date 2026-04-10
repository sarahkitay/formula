-- Run in Supabase SQL Editor if portal signup returns 500 on profile/player inserts.
-- No DROP statements: safe to run in the editor without "destructive query" warnings.
-- Idempotent: skips CREATE if the policy name already exists.
--
-- If you ever need to change a policy definition, drop it manually in the Dashboard
-- (Authentication → Policies) or run: drop policy "name" on public.tablename;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_insert_service'
  ) THEN
    CREATE POLICY "profiles_insert_service"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_update_service'
  ) THEN
    CREATE POLICY "profiles_update_service"
      ON public.profiles FOR UPDATE
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'players' AND policyname = 'players_insert_service'
  ) THEN
    CREATE POLICY "players_insert_service"
      ON public.players FOR INSERT
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'parent_players' AND policyname = 'parent_players_insert_service'
  ) THEN
    CREATE POLICY "parent_players_insert_service"
      ON public.parent_players FOR INSERT
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;
