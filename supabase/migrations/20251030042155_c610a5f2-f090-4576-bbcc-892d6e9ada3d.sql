-- Add activation tracking fields to withdrawals table
ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS activation_payment_amount numeric,
ADD COLUMN IF NOT EXISTS activation_receipt_url text,
ADD COLUMN IF NOT EXISTS activation_submitted_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS activation_reviewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS activation_reviewed_by text,
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS type text DEFAULT 'standard';

-- Add standard activation unlock flag to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS standard_activation_unlocked boolean DEFAULT false;

-- Update existing withdrawals to have type 'standard'
UPDATE public.withdrawals SET type = 'standard' WHERE type IS NULL;