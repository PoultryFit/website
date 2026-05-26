-- Unique view tracking: 1 registered user = 1 view regardless of revisits
CREATE TABLE IF NOT EXISTS public.space_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID NOT NULL,
  viewer_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (space_id, viewer_id)
);

GRANT SELECT, INSERT ON public.space_views TO authenticated;
GRANT ALL ON public.space_views TO service_role;

ALTER TABLE public.space_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Viewers insert own view" ON public.space_views
  FOR INSERT TO authenticated
  WITH CHECK (viewer_id = auth.uid());

CREATE POLICY "Owners read views for their spaces" ON public.space_views
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.spaces s WHERE s.id = space_id AND s.owner_id = auth.uid()));

CREATE POLICY "Admins read all views" ON public.space_views
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.increment_space_views(_space_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_inserted int := 0;
BEGIN
  IF v_uid IS NULL THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM public.spaces WHERE id = _space_id AND owner_id = v_uid) THEN RETURN; END IF;
  INSERT INTO public.space_views (space_id, viewer_id) VALUES (_space_id, v_uid)
  ON CONFLICT (space_id, viewer_id) DO NOTHING;
  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  IF v_inserted > 0 THEN
    UPDATE public.spaces SET views = views + 1 WHERE id = _space_id;
  END IF;
END;
$function$;
