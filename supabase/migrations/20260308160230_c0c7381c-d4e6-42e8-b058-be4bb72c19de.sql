-- Fix 1: Remove subscription UPDATE policy (prevent self-upgrade)
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;

-- Fix 2: Tighten cookie_consent SELECT policy
DROP POLICY IF EXISTS "Users can view own consent" ON public.cookie_consent;
CREATE POLICY "Users can view own consent" ON public.cookie_consent
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Fix 3: Profile UPDATE with WITH CHECK
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fix 4: Fix cookie consent INSERT for anon users
DROP POLICY IF EXISTS "Authenticated users can insert consent" ON public.cookie_consent;
CREATE POLICY "Anyone can insert consent" ON public.cookie_consent
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL AND session_id IS NOT NULL)
  );