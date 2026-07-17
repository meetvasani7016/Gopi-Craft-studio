-- Supabase Storage Buckets Configuration for Gopi Craft-Studio

-- 1. Create media bucket (enables public read access)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable public read access for the media bucket objects
CREATE POLICY "Public Read Access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

-- 3. Restrict write/insert access to authenticated admins only
CREATE POLICY "Admin Insert Objects" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'media' AND 
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
  )
);

-- 4. Restrict update access to authenticated admins only
CREATE POLICY "Admin Update Objects" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'media' AND 
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
  )
) 
WITH CHECK (
  bucket_id = 'media' AND 
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
  )
);

-- 5. Restrict delete access to authenticated admins only
CREATE POLICY "Admin Delete Objects" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'media' AND 
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
  )
);
