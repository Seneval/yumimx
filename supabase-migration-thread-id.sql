-- ============================================
-- Migration: Add thread_id to dreams table
-- ============================================
-- Fecha: 2025-11-17
-- Propósito: Agregar soporte para OpenAI Assistants API threads

-- Agregar columna thread_id a la tabla dreams
ALTER TABLE dreams
ADD COLUMN thread_id TEXT;

-- Crear índice para búsquedas rápidas por thread_id
CREATE INDEX idx_dreams_thread_id ON dreams(thread_id);

-- Verificar que se agregó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'dreams' AND column_name = 'thread_id';

-- La columna debe mostrar:
-- column_name | data_type | is_nullable
-- thread_id   | text      | YES
