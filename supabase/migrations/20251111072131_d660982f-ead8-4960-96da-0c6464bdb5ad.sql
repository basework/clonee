-- Add receipt upload support to instant_activation_payments (top-ups)
ALTER TABLE instant_activation_payments 
ADD COLUMN IF NOT EXISTS has_receipt BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS receipt_count INTEGER DEFAULT 0;

-- Create topup_receipts table for storing receipt metadata
CREATE TABLE IF NOT EXISTS public.topup_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topup_id UUID NOT NULL REFERENCES instant_activation_payments(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on topup_receipts
ALTER TABLE public.topup_receipts ENABLE ROW LEVEL SECURITY;

-- Users can insert their own receipts
CREATE POLICY "Users can insert own receipts"
ON public.topup_receipts
FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

-- Users can view their own receipts
CREATE POLICY "Users can view own receipts"
ON public.topup_receipts
FOR SELECT
USING (
  auth.uid() = uploaded_by
  OR auth.uid() IN (
    SELECT user_id FROM instant_activation_payments WHERE id = topup_id
  )
);

-- Create storage bucket for receipts (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for receipts bucket
CREATE POLICY "Users can upload own receipts"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own receipts"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own receipts"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);