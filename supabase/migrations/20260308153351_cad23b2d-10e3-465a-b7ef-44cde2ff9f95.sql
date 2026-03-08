-- Fix overly permissive policy on cookie_consent
DROP POLICY "Anyone can insert cookie consent" ON public.cookie_consent;

-- More restrictive: allow authenticated users or anonymous with session_id
CREATE POLICY "Authenticated users can insert consent" ON public.cookie_consent 
  FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) 
    OR (auth.uid() IS NULL AND user_id IS NULL AND session_id IS NOT NULL)
  );