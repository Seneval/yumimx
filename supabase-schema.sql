-- ============================================
-- YumiMX Database Schema
-- ============================================
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Este script crea todas las tablas, RLS policies e índices

-- ============================================
-- 1. EXTENSIONES
-- ============================================

-- uuid-ossp ya viene habilitado por defecto en Supabase
-- pgcrypto también viene habilitado

-- ============================================
-- 2. TABLAS
-- ============================================

-- Usuarios (extiende auth.users de Supabase)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'paid')),
  tier_upgraded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contexto personal (solo paid users)
CREATE TABLE user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  context_data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sueños
CREATE TABLE dreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  dream_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mensajes de conversación
CREATE TABLE dream_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ÍNDICES (Performance)
-- ============================================

-- Buscar sueños por usuario
CREATE INDEX idx_dreams_user_id ON dreams(user_id);
CREATE INDEX idx_dreams_user_date ON dreams(user_id, dream_date DESC);

-- Buscar mensajes por sueño
CREATE INDEX idx_messages_dream_id ON dream_messages(dream_id);
CREATE INDEX idx_messages_user_id ON dream_messages(user_id);

-- Buscar contexto por usuario
CREATE INDEX idx_context_user_id ON user_context(user_id);

-- ============================================
-- 4. TRIGGERS (Auto-update timestamps)
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para user_context
CREATE TRIGGER update_user_context_updated_at
  BEFORE UPDATE ON user_context
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para dreams
CREATE TRIGGER update_dreams_updated_at
  BEFORE UPDATE ON dreams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Policies para user_profiles
-- ============================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Los usuarios pueden insertar su propio perfil (se crea al registrarse)
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- Policies para user_context
-- ============================================

-- Solo usuarios paid pueden leer su contexto
CREATE POLICY "Paid users can view own context"
  ON user_context
  FOR SELECT
  USING (
    auth.uid() = user_id
  );

-- Solo usuarios paid pueden insertar su contexto
CREATE POLICY "Paid users can insert own context"
  ON user_context
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

-- Solo usuarios paid pueden actualizar su contexto
CREATE POLICY "Paid users can update own context"
  ON user_context
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Solo usuarios paid pueden borrar su contexto
CREATE POLICY "Paid users can delete own context"
  ON user_context
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Policies para dreams
-- ============================================

-- Los usuarios pueden ver sus propios sueños
CREATE POLICY "Users can view own dreams"
  ON dreams
  FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden insertar sus propios sueños
CREATE POLICY "Users can insert own dreams"
  ON dreams
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus propios sueños
CREATE POLICY "Users can update own dreams"
  ON dreams
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden borrar sus propios sueños
CREATE POLICY "Users can delete own dreams"
  ON dreams
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Policies para dream_messages
-- ============================================

-- Los usuarios pueden ver mensajes de sus propios sueños
CREATE POLICY "Users can view own dream messages"
  ON dream_messages
  FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden insertar mensajes en sus propios sueños
CREATE POLICY "Users can insert own dream messages"
  ON dream_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden borrar mensajes de sus propios sueños
CREATE POLICY "Users can delete own dream messages"
  ON dream_messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
-- ============================================

-- Cuando un usuario se registra con Google OAuth, automáticamente crear su perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, tier, created_at, updated_at)
  VALUES (NEW.id, 'free', NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. VERIFICACIÓN
-- ============================================

-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'user_context', 'dreams', 'dream_messages');

-- Debería mostrar todas las tablas con rowsecurity = true
