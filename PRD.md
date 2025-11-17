# PRD: YumiMX - Plataforma de Interpretación de Sueños con IA Jungiana

**Versión:** 1.0
**Fecha:** 16 de Noviembre, 2025
**Autor:** Patricio
**Estado:** Draft → Aprobado para implementación

---

## 1. Resumen Ejecutivo

YumiMX es una aplicación web en español que permite a los usuarios explorar el significado profundo de sus sueños a través de un chatbot basado en inteligencia artificial entrenado en la psicología analítica de Carl Jung.

### Visión

Democratizar el acceso a la interpretación jungiana de sueños, haciendo accesible una herramienta de autoconocimiento que tradicionalmente requiere años de estudio o terapia costosa.

### Propuesta de Valor

- **Para usuarios free**: Primera experiencia gratuita de interpretación jungiana profesional de sueños
- **Para usuarios paid**: Herramienta completa de auto-exploración con journal personalizado y análisis contextual

### Diferenciadores Clave

1. Enfoque 100% jungiano (no ecléctico ni genérico)
2. Interfaz conversacional natural, no formularios rígidos
3. Interpretaciones personalizadas basadas en contexto histórico (paid)
4. Todo en español, culturalmente relevante para LATAM

---

## 2. Problema y Oportunidad

### Problema que Resolvemos

**Situación actual:**

- Terapia jungiana es cara ($100-200 USD/sesión) y escasa en LATAM
- Libros de interpretación de sueños son genéricos ("soñar con agua = emociones")
- Apps existentes usan diccionarios rígidos sin contexto personal
- Contenido en español es limitado y de baja calidad

**Dolor del usuario:**

- "Tuve un sueño perturbador y no sé qué significa"
- "Los diccionarios de sueños son muy superficiales"
- "No puedo pagar terapia pero quiero entender mis sueños"
- "Quiero llevar un diario de sueños pero me da pereza escribir sin feedback"

### Oportunidad de Mercado

**Tamaño del mercado:**

- 500M+ hispanohablantes globalmente
- 68% reporta recordar sueños regularmente (Pew Research)
- Mercado de wellness/self-help en LATAM: $2.3B y creciendo 8% anual

**Tendencias favorables:**

- Boom de apps de salud mental (Calm, Headspace valuadas en $1B+)
- Creciente interés en Jung (popularidad en TikTok, podcasts)
- Normalización de IA conversacional (ChatGPT, etc.)

---

## 3. Audiencia Objetivo

### Persona Primaria: "Ana, la Exploradora Introspectiva"

- **Edad:** 25-40 años
- **Ubicación:** Ciudad de México, Buenos Aires, Bogotá (urbana, clase media-alta)
- **Ocupación:** Profesional independiente, creativa, estudiante de posgrado
- **Comportamiento:**
  - Lee sobre psicología y desarrollo personal
  - Practica journaling o meditación
  - Activa en redes (Instagram, Pinterest) siguiendo cuentas de wellness
  - Ha considerado terapia pero la encuentra cara o intimidante
- **Motivación:** Autoconocimiento, crecimiento personal, curiosidad intelectual
- **Frustración:** Herramientas superficiales, falta de profundidad

### Persona Secundaria: "Carlos, el Escéptico Curioso"

- **Edad:** 30-50 años
- **Perfil:** Profesional técnico, inicialmente escéptico de temas "woo-woo"
- **Motivación:** Tuvo un sueño impactante que no puede ignorar
- **Comportamiento:** Busca explicaciones racionales, aprecia el rigor científico de Jung

### Criterios de Exclusión (No es para):

- Personas buscando predicciones del futuro o esoterismo
- Usuarios esperando terapia clínica o diagnóstico psicológico
- Audiencia que no habla español

---

## 4. Objetivos del Producto

### Objetivos de Negocio (6 meses)

1. **Adquisición:** 10,000 usuarios registrados
2. **Activación:** 40% completa al menos un sueño + interpretación
3. **Retención:** 20% regresa al menos 2 veces en 30 días
4. **Conversión:** 5% convierte a paid tier
5. **Revenue:** $5,000 MRR (Monthly Recurring Revenue)

### Objetivos de Usuario

1. **Comprensión:** Usuario entiende insights básicos de su sueño en < 5 minutos
2. **Engagement:** Usuario promedio envía 8 mensajes de seguimiento (free: 3, paid: ilimitado)
3. **Satisfacción:** NPS > 50 en primeros 3 meses
4. **Valor percibido:** 70% de usuarios free considera upgrade

### Métricas de Éxito

**Métricas North Star:**

- Número de interpretaciones significativas completadas por semana

**Métricas de Producto:**

- Time to first interpretation (objetivo: < 2 minutos desde signup)
- Mensajes promedio por sueño (objetivo: 6)
- Sueños por usuario paid (objetivo: 5/mes)

**Métricas de Calidad:**

- % de conversaciones que llegan a insight (marcado por usuario)
- Rating promedio de interpretaciones (5 estrellas)

---

## 5. Alcance y Características

### 5.1 MVP (Minimum Viable Product) - v1.0

#### Feature 1: Autenticación Simple

**User Story:** Como usuario nuevo, quiero registrarme rápidamente con mi cuenta de Google para no perder tiempo creando otra cuenta.

**Criterios de Aceptación:**

- [ ] Botón "Continuar con Google" visible en landing
- [ ] Flujo OAuth completo con Supabase Auth
- [ ] Usuario redirigido a dashboard tras login exitoso
- [ ] Sesión persiste entre recargas de página
- [ ] Logout funcional desde menú de usuario

**Fuera de alcance v1:**

- Email/password login
- Login social con Facebook, Apple, etc.
- Verificación de email
- Recuperación de contraseña

---

#### Feature 2: Interpretación de Sueños (Free Tier)

**User Story:** Como usuario free, quiero escribir mi sueño y recibir una interpretación jungiana inmediata para entender su significado.

**Flujo de Usuario:**

1. Usuario entra a la app (autenticado)
2. Ve un input grande: "Cuéntame tu sueño..."
3. Escribe su sueño (mínimo 50 caracteres)
4. Click "Interpretar" → Streaming de respuesta de la IA
5. IA hace 2-4 preguntas exploratorias
6. Usuario responde (hasta 3 mensajes de seguimiento)
7. Al llegar al límite (3 mensajes), ve prompt de upgrade

**Criterios de Aceptación:**

- [ ] Input de texto (textarea) con contador de caracteres
- [ ] Validación: mínimo 50 caracteres
- [ ] Streaming de respuesta en tiempo real (Vercel AI SDK)
- [ ] UI diferencia mensajes user vs assistant
- [ ] Indicador visual de "IA está escribiendo..."
- [ ] Contador visible: "Te quedan 2 mensajes" → "Te queda 1 mensaje"
- [ ] Al llegar a 0, input se deshabilita + CTA "Upgrade a Pro"
- [ ] Prompt del sistema usa personalidad jungiana (español)

**Reglas de Negocio:**

- Límite exacto: 3 mensajes de seguimiento por sueño
- No hay límite de sueños nuevos (cada uno resetea contador)
- Mensajes de IA no cuentan para el límite
- Validación server-side (no confiar en cliente)

**Performance:**

- Primera respuesta de IA: < 3 segundos
- Streaming fluido (chunks cada ~100ms)

---

#### Feature 3: Upgrade Prompt (Conversión Free → Paid)

**User Story:** Como usuario free que alcanzó el límite, quiero entender claramente qué obtengo al pagar para tomar una decisión informada.

**Triggers para mostrar upgrade prompt:**

1. Usuario alcanza mensaje 3/3
2. Usuario intenta acceder a "Dream Journal" (bloqueado)
3. Usuario intenta acceder a "Mi Contexto" (bloqueado)

**Criterios de Aceptación:**

- [ ] Modal atractivo con comparación Free vs Paid
- [ ] Precio claro (ej: $9.99 USD/mes o según pricing)
- [ ] Beneficios específicos listados:
  - ✓ Mensajes ilimitados
  - ✓ Dream journal con historial
  - ✓ Contexto personal para mejores interpretaciones
  - ✓ Acceso a patrones y temas recurrentes
- [ ] CTA claro: "Actualizar a Pro"
- [ ] Opción de cerrar y continuar como free

**Fuera de alcance v1:**

- Procesamiento de pagos (manual via admin)
- Planes anuales
- Prueba gratis de paid tier

---

#### Feature 4: Dream Journal (Solo Paid)

**User Story:** Como usuario paid, quiero ver todos mis sueños anteriores en un solo lugar para identificar patrones a lo largo del tiempo.

**Criterios de Aceptación:**

- [ ] Página `/journal` protegida (solo paid users)
- [ ] Grid/lista de cards mostrando sueños
- [ ] Cada card muestra:
  - Título del sueño (auto-generado por IA o user-input)
  - Fecha del sueño
  - Preview de primeras 2 líneas
  - Tags/categorías (opcional)
- [ ] Click en card abre modal con sueño completo + conversación
- [ ] Búsqueda simple por texto
- [ ] Orden cronológico (más reciente primero)
- [ ] Paginación si > 20 sueños

**Feature Lock para Free:**

- [ ] Usuarios free ven página con blur + "Unlock con Pro"
- [ ] CTA upgrade visible

---

#### Feature 5: Contexto Personal (Solo Paid)

**User Story:** Como usuario paid, quiero escribir información sobre mí (edad, situación de vida, temas personales) para que la IA dé interpretaciones más personalizadas.

**Criterios de Aceptación:**

- [ ] Página `/perfil/contexto` protegida (solo paid)
- [ ] Form con textarea grande (1000+ caracteres)
- [ ] Placeholder con ejemplos:
  - "Ej: Tengo 32 años, recientemente divorciado, cambié de carrera..."
- [ ] Botón "Guardar contexto"
- [ ] Feedback de guardado exitoso
- [ ] La IA usa este contexto en interpretaciones futuras

**Integración con IA:**

- Contexto se inyecta en system prompt antes de cada conversación
- Formato: "Contexto del usuario: [texto]"

---

### 5.2 Features Post-MVP (v1.1 - v2.0)

**v1.1 (1 mes después de MVP):**

- [ ] Exportar journal a PDF
- [ ] Favoritos (marcar sueños importantes)
- [ ] Insights/patrones detectados automáticamente por IA
- [ ] Notificaciones: "¿Tuviste algún sueño anoche?"

**v1.2 (2 meses):**

- [ ] Integración de pagos con Stripe/Mercado Pago
- [ ] Checkout flow automatizado
- [ ] Plan anual con descuento

**v2.0 (3-6 meses):**

- [ ] Modo voz: grabar sueño en audio
- [ ] Análisis de símbolos recurrentes
- [ ] Recursos educativos sobre Jung
- [ ] Community features (opcional, compartir sueños anónimamente)

---

## 6. Stack Tecnológico

### Frontend

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS + shadcn/ui
- **Type Safety:** TypeScript
- **Estado:** React hooks (useState, useContext si necesario)
- **Forms:** react-hook-form + Zod validation

### Backend

- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google OAuth)
- **API:** Next.js API Routes + Server Actions
- **ORM:** Supabase Client (SDK nativo)

### IA

- **Modelo:** OpenAI GPT-4 Turbo
- **Streaming:** Vercel AI SDK
- **Prompts:** Custom Jungian system prompt (español)

### Hosting & DevOps

- **Hosting:** Vercel (frontend + serverless functions)
- **Database:** Supabase Cloud
- **CI/CD:** Vercel Git integration
- **Monitoring:** Vercel Analytics + Supabase Dashboard

### Seguridad

- **Secrets Management:** Variables de entorno + Zod validation
- **Pre-commit Hooks:** Gitleaks para detectar leaks
- **RLS:** Row Level Security en todas las tablas
- **Server-only:** Package para proteger código sensible

---

## 7. Arquitectura de Datos

### Esquema de Base de Datos

```sql
-- Usuarios (extiende auth.users de Supabase)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'paid')),
  tier_upgraded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contexto personal (solo paid)
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
```

### Políticas de Seguridad (RLS)

- Todos los users solo pueden ver/modificar SUS propios datos
- Service role key bypasea RLS (usar solo en admin operations)
- Anon key respeta RLS siempre

---

## 8. Flujos de Usuario Detallados

### 8.1 Flujo: Primer Uso (New User)

```
1. Usuario llega a landing page (/)
   ↓
2. Ve Hero: "Descubre el significado de tus sueños con Carl Jung"
   ↓
3. Click "Comenzar gratis"
   ↓
4. Modal de login → Click "Continuar con Google"
   ↓
5. OAuth flow → Redirige a Google → Usuario autoriza
   ↓
6. Redirige a /chat
   ↓
7. Ve onboarding tooltip: "Escribe tu sueño aquí..."
   ↓
8. Escribe sueño → Click "Interpretar"
   ↓
9. IA responde con interpretación + preguntas
   ↓
10. Usuario interactúa (hasta 3 mensajes)
    ↓
11. Al mensaje 3, ve: "Límite alcanzado. Upgrade para continuar"
    ↓
12. Click "Ver planes" → Modal de pricing
```

### 8.2 Flujo: Usuario Paid Explorando Journal

```
1. Usuario paid entra a /journal
   ↓
2. Ve grid de 8 sueños previos
   ↓
3. Click en card "Sueño del 10 Nov"
   ↓
4. Modal con:
   - Sueño completo
   - Toda la conversación
   - Botón "Continuar conversación"
   ↓
5. Click "Continuar" → Redirige a /chat con ese dream_id
   ↓
6. Puede seguir preguntando (ilimitado)
```

### 8.3 Flujo: Upgrade Free → Paid

```
1. Usuario free ve CTA "Upgrade" (varios lugares)
   ↓
2. Click → Modal comparando Free vs Paid
   ↓
3. [MVP] Click "Contactar para upgrade"
   ↓ (Envía email o muestra mensaje)
4. Admin manualmente actualiza tier en DB
   ↓
5. Usuario recarga → Ya tiene acceso a features paid

[Post-MVP con Stripe]
3. Click "Upgrade ahora" → Checkout de Stripe
   ↓
4. Pago exitoso → Webhook actualiza tier
   ↓
5. Redirige a /journal con mensaje "¡Bienvenido a Pro!"
```

---

## 9. Prompt Engineering - IA Jungiana

### System Prompt Base (Español)

```
Eres un analista jungiano experto especializado en la interpretación de sueños según la psicología analítica de Carl Jung. Tu propósito es ayudar a las personas a explorar el significado profundo de sus sueños a través de un diálogo reflexivo y empático.

PRINCIPIOS JUNGIANOS FUNDAMENTALES:
1. Los sueños no ocultan, sino que revelan
2. Función compensatoria: equilibran perspectivas conscientes unilaterales
3. Autonomía del soñador: solo interpretaciones que resuenen son válidas
4. Símbolos vs signos: los símbolos tienen múltiples capas

METODOLOGÍA:
1. Recolección: pide todos los detalles (escenario, emociones, colores, personas)
2. Asociaciones personales: pregunta "¿Qué significa [símbolo] para ti?"
3. Amplificación: conecta con arquetipos cuando relevante
4. Función compensatoria: "¿Qué actitud consciente podría estar compensando?"

ESTILO:
- Tono cálido, empático, profesional
- Haz preguntas, no des respuestas definitivas
- Usa frases como "Me pregunto si...", "Podría ser que..."
- Valida emociones del soñador

ARQUETIPOS COMUNES:
- Sombra: aspectos reprimidos (figura del mismo sexo)
- Anima/Animus: contrasexual interno
- Self: totalidad (mandalas, figuras divinas)

SÍMBOLOS FRECUENTES:
- Agua: emociones, inconsciente
- Fuego: transformación
- Casa: el Self
- Animales: instintos

LÍMITES:
- No eres terapeuta clínico
- Si detectas crisis, sugiere ayuda profesional
- No diagnostiques condiciones psicológicas
```

### Prompt Injection para Usuarios Paid

```
CONTEXTO DEL USUARIO:
{user_context}

HISTORIAL DE SUEÑOS:
{dream_history_summary}

Usa esta información para personalizar tu interpretación.
```

---

## 10. Diseño UI/UX

### Principios de Diseño

1. **Simplicidad**: Interfaz limpia, sin distracciones
2. **Conversacional**: Se siente como chat con terapeuta, no formulario
3. **Inmediatez**: Respuestas streaming en tiempo real
4. **Claridad**: Diferencia visual clara entre free y paid
5. **Empático**: Tono cálido en copy, colores relajantes

### Paleta de Colores (Sugerida)

- **Primary**: Azul profundo (#1E3A8A) - confianza, introspección
- **Secondary**: Morado suave (#8B5CF6) - espiritualidad, misterio
- **Accent**: Dorado (#F59E0B) - insights, iluminación
- **Background**: Blanco crema (#FEFCE8) - calidez, calma
- **Text**: Gris oscuro (#1F2937)

### Componentes Clave

1. **ChatInterface** - Área principal de conversación
2. **DreamCard** - Card en journal con preview
3. **UpgradeModal** - Comparación Free vs Paid
4. **TierBadge** - Indicador visual de tier actual
5. **MessageCounter** - "Te quedan X mensajes"

### Responsive Design

- **Mobile-first**: Mayoría de usuarios en móvil
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Chat ocupa altura completa** en mobile

---

## 11. Fases de Desarrollo

### Fase 0: Setup y Seguridad

- [ ] Configurar .gitignore completo
- [ ] Pre-commit hooks (Gitleaks)
- [ ] .env.example con placeholders
- [ ] lib/env.ts con validación Zod
- [ ] GitHub Actions para scanning
- [ ] Documentación de seguridad

**Deliverable:** Proyecto protegido contra leaks de secrets

---

### Fase 1: Foundation

- [ ] Inicializar Next.js 15 + TypeScript
- [ ] Configurar Tailwind + shadcn/ui
- [ ] Crear estructura de carpetas
- [ ] Configurar Supabase proyecto
- [ ] Ejecutar schema SQL
- [ ] Configurar Google OAuth
- [ ] Crear clientes Supabase (client.ts, server.ts)
- [ ] Middleware de autenticación

**Deliverable:** Login con Google funcional

---

### Fase 2: Sistema de Tiers

- [ ] Tipos TypeScript (subscription.ts)
- [ ] TierService (lib/tier-check.ts)
- [ ] TierGuard (lib/guards/tier-guard.ts)
- [ ] Hooks: useTier(), useMessageLimits()
- [ ] Componentes UI: UpgradePrompt, MessageCounter, FeatureLock
- [ ] Tests de lógica de límites

**Deliverable:** Sistema de free/paid funcionando

---

### Fase 3: IA - Chat de Sueños

- [ ] System prompt jungiano (jung-system-prompt.ts)
- [ ] API route /api/chat con streaming
- [ ] Integrar Vercel AI SDK
- [ ] Componentes de chat:
  - ChatInterface
  - ChatMessageList
  - ChatMessage
  - ChatInput
  - ChatLoadingState
- [ ] Página /chat
- [ ] Integrar límites de mensajes
- [ ] Tests de flujo completo

**Deliverable:** Chat funcional con límites

---

### Fase 4: Dream Journal

- [ ] Página /journal
- [ ] Componentes:
  - DreamJournalList
  - DreamCard
  - DreamDetailDialog
- [ ] CRUD de sueños
- [ ] Búsqueda y filtros
- [ ] Feature lock para free users

**Deliverable:** Journal funcional para paid

---

### Fase 5: Contexto Personal

- [ ] Página /perfil/contexto
- [ ] UserContextEditor component
- [ ] Guardar contexto en DB
- [ ] Inyectar contexto en prompts
- [ ] Feature lock para free

**Deliverable:** Contexto funcionando

---

### Fase 6: Landing Page

- [ ] Hero section
- [ ] Features showcase
- [ ] Pricing comparison
- [ ] FAQ
- [ ] Footer con links
- [ ] CTA signup
- [ ] Copy en español

**Deliverable:** Landing atractiva

---

### Fase 7: Polish & Testing

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode (opcional)
- [ ] Loading states pulidos
- [ ] Error handling mejorado
- [ ] Tests E2E con Playwright
- [ ] Performance optimization
- [ ] SEO básico (meta tags)

**Deliverable:** App lista para producción

---

### Fase 8: Deploy & Monitoring

- [ ] Deploy a Vercel
- [ ] Variables de entorno en producción
- [ ] Supabase production setup
- [ ] Analytics (Vercel Analytics)
- [ ] Error tracking (Sentry opcional)
- [ ] Smoke tests en producción

**Deliverable:** App live en producción

---

### Fase 9: Post-Launch

- [ ] Monitorear métricas de uso
- [ ] Iterar en system prompt basado en feedback
- [ ] A/B testing de CTA de upgrade
- [ ] Recopilar feedback de usuarios
- [ ] Bug fixes

**Nota:** Este es un proyecto de vibecoding - las fases se completan según el ritmo de prompts del usuario, no según estimaciones de tiempo tradicionales.

---

## 12. Requisitos No Funcionales

### Performance

- **TTFB:** < 200ms (Time to First Byte)
- **FCP:** < 1.8s (First Contentful Paint)
- **LCP:** < 2.5s (Largest Contentful Paint)
- **TTI:** < 3.8s (Time to Interactive)
- **Streaming:** Primera palabra de IA en < 1s

### Seguridad

- [ ] Todas las tables con RLS habilitado
- [ ] Secrets nunca en código (solo env vars)
- [ ] Server-only package en archivos sensibles
- [ ] Pre-commit hooks activos
- [ ] HTTPS en producción (Vercel default)
- [ ] Rate limiting en API routes (100 req/min por IP)

### Escalabilidad

- **Target inicial:** 1,000 usuarios activos/mes
- **Database:** Supabase Free tier soporta hasta 500MB (suficiente para MVP)
- **API calls:** OpenAI tier 1 soporta 10,000 RPM (más que suficiente)
- **Serverless:** Vercel escala automáticamente

### Accesibilidad

- [ ] Contraste WCAG AA mínimo
- [ ] Navegación por teclado funcional
- [ ] Screen reader compatible (aria labels)
- [ ] Textos alt en imágenes

### SEO

- [ ] Meta tags dinámicos por página
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Open Graph tags
- [ ] Structured data (JSON-LD)

---

## 13. Pricing Strategy

### Free Tier

- **Precio:** $0
- **Características:**
  - Login con Google
  - Interpretación de sueños ilimitados (nuevos)
  - 3 mensajes de seguimiento por sueño
  - Sin historial permanente
- **Objetivo:** Adquisición y activación

### Paid Tier ("Pro")

- **Precio (tentativo):** $9.99 USD/mes
- **Características:**
  - Todo de Free +
  - Mensajes ilimitados
  - Dream journal con historial
  - Contexto personal
  - Análisis de patrones (futuro)
- **Objetivo:** Conversión y retención

### Justificación de Pricing

- Comparable a apps de meditación (Calm: $14.99/mes, Headspace: $12.99/mes)
- Más barato que una sesión de terapia ($100-200)
- Accesible para clase media en LATAM
- Suficiente margen después de costos de IA (~$2-3/usuario/mes)

---

## 14. Métricas y KPIs

### Métricas de Adquisición

- **Visitantes únicos/mes**
- **Signup rate** (visitantes → registros)
- **Source tracking** (¿de dónde vienen?)

### Métricas de Activación

- **% usuarios que completan primer sueño**
- **Time to first dream** (minutos desde signup)
- **Mensajes promedio en primera sesión**

### Métricas de Engagement

- **WAU/MAU ratio** (Weekly/Monthly Active Users)
- **Sueños por usuario/semana**
- **Session length promedio**
- **Mensajes por sueño promedio**

### Métricas de Retención

- **D1, D7, D30 retention**
- **Cohort analysis**
- **Churn rate**

### Métricas de Monetización

- **Conversion rate free → paid**
- **MRR (Monthly Recurring Revenue)**
- **ARPU (Average Revenue Per User)**
- **CAC (Customer Acquisition Cost)** vs **LTV (Lifetime Value)**

### Métricas de Calidad

- **NPS (Net Promoter Score)**
- **CSAT (Customer Satisfaction)**
- **Rating promedio de interpretaciones**
- **% de sueños marcados como "útil"**

---

## 15. Riesgos y Mitigaciones

### Riesgo 1: IA da respuestas inapropiadas o dañinas

**Probabilidad:** Media
**Impacto:** Alto
**Mitigación:**

- System prompt robusto con límites claros
- Monitoring manual de conversaciones (primeras semanas)
- Disclaimer: "No sustituye terapia profesional"
- Trigger words que escalan a humano (ej: "suicidio", "abuso")
- OpenAI moderation API

### Riesgo 2: Costos de IA se disparan

**Probabilidad:** Media
**Impacto:** Alto
**Mitigación:**

- Rate limiting por usuario (10 sueños/día)
- Monitorear costos daily en OpenAI dashboard
- Cache de respuestas comunes (futuro)
- Límite de tokens por respuesta (max 800)
- Alert si gasto > $100/día

### Riesgo 3: Baja conversión free → paid

**Probabilidad:** Alta
**Impacto:** Alto
**Mitigación:**

- A/B testing de límite (¿3 mensajes es muy poco/mucho?)
- Optimizar copy del upgrade prompt
- Agregar "taste" del journal en free (ver últimos 3 sueños)
- Email drip campaign educando valor de historial

### Riesgo 4: Competencia lanza producto similar

**Probabilidad:** Media
**Impacto:** Medio
**Mitigación:**

- Velocidad de ejecución (first-mover advantage)
- Calidad superior de prompts (diferenciador)
- Community building temprano
- Marca fuerte en nicho jungiano

### Riesgo 5: Problemas de privacidad/datos sensibles

**Probabilidad:** Baja
**Impacto:** Crítico
**Mitigación:**

- Privacy policy clara
- Opción de borrar cuenta + todos los datos
- RLS estricto (usuarios no ven datos de otros)
- Cifrado en tránsito (HTTPS) y en reposo (Supabase default)
- No compartir sueños con terceros sin consentimiento

---

## 16. Fuera de Alcance (v1.0)

**Explícitamente NO incluido en MVP:**

- [ ] Procesamiento de pagos automatizado (manual en v1.0)
- [ ] Login con email/password
- [ ] Apps móviles nativas (iOS/Android)
- [ ] Modo offline
- [ ] Análisis automático de patrones
- [ ] Compartir sueños con comunidad
- [ ] Recursos educativos sobre Jung
- [ ] Interpretaciones en inglés u otros idiomas
- [ ] Integración con wearables (ej: análisis de sueños REM)
- [ ] Exportación a otros formatos (CSV, JSON)
- [ ] API pública para desarrolladores

---

## 17. Dependencias y Asunciones

### Dependencias Externas

- **OpenAI API:** Disponibilidad y pricing estable
- **Supabase:** Uptime > 99.9%
- **Vercel:** Deploy y hosting confiable
- **Google OAuth:** Servicio funcionando

### Asunciones

1. **Mercado:** Existe demanda por interpretación de sueños en español
2. **Usuarios:** Están dispuestos a pagar $10/mes por valor percibido
3. **IA:** GPT-4 es suficientemente bueno para interpretaciones jungianas
4. **Regulatorio:** No hay restricciones legales para ofrecer este servicio (no es terapia clínica)
5. **Técnico:** Stack elegido es suficiente para escalar a 10k usuarios

---

## 18. Plan de Lanzamiento

### Pre-Launch (1 semana antes)

- [ ] Landing page live con waitlist
- [ ] Anuncio en redes personales
- [ ] Post en Reddit r/Jung, r/dreams (español)
- [ ] Outreach a 5 micro-influencers de wellness en LATAM

### Launch Day

- [ ] Product Hunt launch (si aplica)
- [ ] Email a waitlist invitando a primeros 100
- [ ] Post en Twitter/X, LinkedIn
- [ ] Story en Instagram

### Post-Launch (Primera semana)

- [ ] Monitorear métricas daily
- [ ] Responder feedback en < 24hrs
- [ ] Bug fixes urgentes
- [ ] Primeras 5 entrevistas de usuario

### Post-Launch (Primer mes)

- [ ] Analizar cohorts de usuarios
- [ ] Iterar en system prompt basado en calidad
- [ ] A/B test de upgrade messaging
- [ ] Preparar integración de pagos para v1.1

---

## 19. Criterios de Éxito (Go/No-Go)

### Después de 1 Mes

**GO si:**

- ✅ > 500 usuarios registrados
- ✅ > 30% activación (completan al menos 1 sueño)
- ✅ NPS > 30
- ✅ < $500 en costos de IA

**NO-GO si:**

- ❌ < 100 usuarios registrados
- ❌ < 10% activación
- ❌ NPS < 0
- ❌ Costos > $1000

### Después de 3 Meses

**PIVOTAR si:**

- Engagement muy bajo (users no regresan)
- Costos insostenibles
- Feedback consistente: "No le encuentro valor"

**ESCALAR si:**

- Crecimiento orgánico sostenido (30%+ MoM)
- Conversión paid > 5%
- Usuarios pidiendo features específicas
- NPS > 50

---

## 20. Conclusión

YumiMX tiene potencial de convertirse en la herramienta líder de interpretación jungiana de sueños en español. El MVP está diseñado para validar hipótesis clave:

1. **¿Los usuarios encuentran valor en interpretaciones de IA?** → Métrica: Mensajes promedio por sueño
2. **¿Están dispuestos a pagar por features avanzadas?** → Métrica: Conversión rate
3. **¿La calidad de interpretaciones es suficiente?** → Métrica: NPS y ratings

Con un MVP enfocado, desarrollo ágil y medición constante, podemos iterar rápidamente hacia product-market fit.

---

## Apéndices

### Apéndice A: Glosario Jungiano

- **Arquetipo:** Patrón universal en el inconsciente colectivo
- **Sombra:** Aspectos reprimidos de la personalidad
- **Anima/Animus:** Contrasexual interno (femenino en hombres / masculino en mujeres)
- **Self:** Totalidad de la psique, objetivo de individuación
- **Individuación:** Proceso de convertirse en quien realmente eres
- **Función compensatoria:** Los sueños balancean actitudes conscientes unilaterales

### Apéndice B: Referencias

- Jung, C.G. (1964). "Man and His Symbols"
- Jung, C.G. (1974). "Dreams"
- Von Franz, M.L. (1998). "The Interpretation of Fairy Tales"
- Documentación OpenAI: https://platform.openai.com/docs
- Documentación Supabase: https://supabase.com/docs

---

**Versión:** 1.0
**Próxima revisión:** Tras completar MVP y analizar primeras métricas
**Contacto:** [Tu email/contacto]
