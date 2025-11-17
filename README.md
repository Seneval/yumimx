# YumiMX - Interpretación de Sueños con IA Jungiana

Plataforma web para interpretar sueños basada en la psicología analítica de Carl Jung, potenciada por inteligencia artificial.

## 📚 Documentación del Proyecto

Antes de empezar, lee estos documentos en orden:

1. **[CLAUDE.md](./CLAUDE.md)** - Contexto y arquitectura del proyecto
2. **[SECURITY-RULES.md](./SECURITY-RULES.md)** - Reglas de seguridad (NON-NEGOTIABLE)
3. **[PRD.md](./PRD.md)** - Product Requirements Document completo

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm o yarn
- Git
- Cuenta de Supabase
- API key de OpenAI

### Setup Inicial

1. **Clonar e instalar dependencias**

   ```bash
   git clone <repository-url>
   cd yumimx
   npm install
   ```

2. **Configurar variables de entorno**

   ```bash
   # Copiar template
   cp .env.example .env.local

   # Editar .env.local y agregar tus credenciales REALES
   # NUNCA commitees este archivo!
   ```

3. **Instalar pre-commit hooks (IMPORTANTE)**

   ```bash
   # Instalar pre-commit (macOS)
   brew install pre-commit

   # Instalar hooks en el repositorio
   pre-commit install

   # Verificar que funciona
   pre-commit run --all-files
   ```

4. **Configurar Supabase**

   - Crear proyecto en https://app.supabase.com
   - Ejecutar el schema SQL (ver `PRD.md` sección 7)
   - Configurar Google OAuth en Authentication → Providers
   - Copiar URL y keys a `.env.local`

5. **Correr en desarrollo**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000)

## 🔒 Seguridad

Este proyecto tiene protecciones estrictas contra leaks de secrets:

- **Pre-commit hooks** bloquean commits con API keys
- **GitHub Actions** escanea automáticamente en cada PR
- **Validación Zod** falla fast si faltan variables de entorno
- **Server-only** protege código sensible del bundle del cliente

**⚠️ NUNCA commitees:**

- `.env.local` o cualquier archivo `.env*.local`
- API keys, passwords, tokens hardcodeados
- Credenciales de base de datos

Si accidentalmente commiteas un secret, sigue el protocolo en `SECURITY-RULES.md`.

## 📦 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Build
npm run build        # Build de producción
npm start            # Inicia servidor de producción

# Calidad de código
npm run lint         # ESLint
npm run type-check   # TypeScript type checking

# Pre-commit
pre-commit run --all-files    # Ejecutar todos los hooks manualmente
```

## 🏗️ Stack Tecnológico

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Server Actions
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google OAuth)
- **IA:** OpenAI GPT-4 (Vercel AI SDK)
- **Hosting:** Vercel

## 📁 Estructura del Proyecto

```
yumimx/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Rutas protegidas
│   ├── (public)/        # Rutas públicas
│   └── api/             # API routes
├── components/          # Componentes React
│   ├── ui/             # shadcn/ui components
│   └── features/       # Feature-specific components
├── lib/                 # Lógica de negocio
│   ├── supabase/       # Clientes de Supabase
│   ├── actions/        # Server Actions
│   ├── services/       # Business logic
│   └── env.ts          # Validación de env vars
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
└── public/              # Static assets
```

## 🔄 Flujo de Desarrollo

1. Lee `CLAUDE.md`, `SECURITY-RULES.md`, y `PRD.md`
2. Crea feature branch: `git checkout -b feature/nombre`
3. Escribe código
4. Pre-commit hooks se ejecutan automáticamente
5. Push y crea PR
6. GitHub Actions escanea por secrets
7. Merge cuando pasa CI

## 🤝 Contribución

1. **Seguridad primero:** Lee `SECURITY-RULES.md`
2. **Sigue las convenciones:** Ver `CLAUDE.md`
3. **Tests:** Escribe tests para nueva lógica
4. **Commits:** Usa mensajes descriptivos
5. **PRs:** Una feature por PR, descripción clara

## 📞 Soporte

- **Issues:** [GitHub Issues]
- **Documentación:** Ver archivos `.md` en la raíz
- **Security:** Para reportar vulnerabilidades, contacta directamente (no abras issue público)

## 📄 Licencia

[Por definir]

---

**Hecho con ❤️ y Carl Jung**
