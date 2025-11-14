-- Fix reservations table RLS policies for proper data protection

-- Drop the overly permissive SELECT policy that allows anyone to view all customer data
DROP POLICY IF EXISTS "Users can view reservations" ON reservations;

-- Create a new policy that only allows admins to view reservations
CREATE POLICY "Only admins can view reservations"
ON reservations FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add explicit UPDATE policy for admins only
-- (Service role key bypasses RLS for edge functions)
CREATE POLICY "Only admins can update reservations"
ON reservations FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add explicit DELETE policy - prevent all deletions
-- Reservations should be cancelled via status change, never deleted
CREATE POLICY "No deletions allowed"
ON reservations FOR DELETE
USING (false);