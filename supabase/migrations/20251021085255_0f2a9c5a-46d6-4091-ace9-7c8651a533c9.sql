-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 10),
  session TEXT NOT NULL CHECK (session IN ('morning', 'evening')),
  requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert reservations
CREATE POLICY "Anyone can create reservations"
ON public.reservations
FOR INSERT
WITH CHECK (true);

-- Create policy for public to read their own reservations
CREATE POLICY "Users can view reservations"
ON public.reservations
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for querying by date and session
CREATE INDEX idx_reservations_date_session ON public.reservations(date, session) WHERE status != 'cancelled';