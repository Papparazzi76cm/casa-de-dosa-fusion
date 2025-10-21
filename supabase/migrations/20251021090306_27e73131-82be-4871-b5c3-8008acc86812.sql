-- Add token fields to reservations table for secure cancellation/editing
ALTER TABLE public.reservations 
ADD COLUMN edit_token TEXT UNIQUE,
ADD COLUMN token_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for token lookups
CREATE INDEX idx_reservations_edit_token ON public.reservations(edit_token) WHERE edit_token IS NOT NULL;