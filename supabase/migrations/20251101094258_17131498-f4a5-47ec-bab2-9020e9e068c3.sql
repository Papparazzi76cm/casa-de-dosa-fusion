-- Create a storage bucket for menu dish images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true);

-- Create policy to allow anyone to view menu images
CREATE POLICY "Menu images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'menu-images');

-- Create policy to allow authenticated users to upload menu images
-- (for future admin functionality)
CREATE POLICY "Authenticated users can upload menu images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update menu images
CREATE POLICY "Authenticated users can update menu images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete menu images
CREATE POLICY "Authenticated users can delete menu images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');