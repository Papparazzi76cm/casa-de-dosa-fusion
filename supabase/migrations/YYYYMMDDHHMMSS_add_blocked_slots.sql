-- Crear tabla para almacenar los bloqueos de sesiones
CREATE TABLE public.blocked_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  session TEXT NOT NULL CHECK (session IN ('morning', 'evening')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_blocked_slot UNIQUE (date, session) -- Asegura que no se bloquee la misma sesión dos veces
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
-- Permitir lectura pública de los bloqueos (necesario para el frontend de reservas)
CREATE POLICY "Public can read blocked slots"
ON public.blocked_slots
FOR SELECT
USING (true);

-- Asumimos que existe un rol 'admin' o usaremos un ID específico
-- Reemplaza 'authenticated' por tu rol de admin si lo tienes, o ajusta la condición user_id
-- Política para permitir a los administradores insertar bloqueos
CREATE POLICY "Admins can insert blocked slots"
ON public.blocked_slots
FOR INSERT
-- Ejemplo con rol 'admin': TO admin
-- Ejemplo con ID específico (reemplaza 'ADMIN_USER_ID'): WITH CHECK (auth.uid() = 'ADMIN_USER_ID')
TO authenticated -- Simplificación: Por ahora permite a cualquier autenticado. ¡AJUSTAR EN PRODUCCIÓN!
WITH CHECK (true);

-- Política para permitir a los administradores eliminar bloqueos
CREATE POLICY "Admins can delete blocked slots"
ON public.blocked_slots
FOR DELETE
-- Ejemplo con rol 'admin': USING (true) WITH CHECK (role = 'admin')
-- Ejemplo con ID específico: USING (auth.uid() = 'ADMIN_USER_ID')
TO authenticated -- Simplificación: Por ahora permite a cualquier autenticado. ¡AJUSTAR EN PRODUCCIÓN!
USING (true);

-- Crear índice para consultas rápidas por fecha y sesión
CREATE INDEX idx_blocked_slots_date_session ON public.blocked_slots(date, session);
