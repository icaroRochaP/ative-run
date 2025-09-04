-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true);

-- Set up RLS policies for progress-photos bucket
CREATE POLICY "Users can upload their own progress photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own progress photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view progress photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'progress-photos');

-- Update RLS to allow all for now (we'll handle auth in application)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
