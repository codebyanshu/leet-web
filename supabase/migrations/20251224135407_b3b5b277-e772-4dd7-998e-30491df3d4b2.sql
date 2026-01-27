-- Allow authenticated users to update member stats (for refresh functionality)
CREATE POLICY "Authenticated users can update members" 
ON public.members 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);