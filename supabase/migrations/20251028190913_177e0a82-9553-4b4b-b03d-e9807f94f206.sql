-- Add withdrawal_activation_payments table to track the ₦6,650 activation fee
CREATE TABLE public.withdrawal_activation_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 6650.00,
  status TEXT NOT NULL DEFAULT 'pending',
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.withdrawal_activation_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own activation payments"
  ON public.withdrawal_activation_payments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activation payments"
  ON public.withdrawal_activation_payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add withdrawal_count to profiles table to track completed withdrawals
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS withdrawal_count INTEGER DEFAULT 0;

-- Add activation_paid flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS activation_paid BOOLEAN DEFAULT false;