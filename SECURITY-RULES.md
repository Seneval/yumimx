# SECURITY RULES - NEVER BREAK THESE

This file contains absolute security rules for this project. These are **NON-NEGOTIABLE** and must be followed at all times during development.

---

## 🚨 CRITICAL: NEVER DO THESE

### ❌ Hardcoding Secrets

```typescript
// ❌ NEVER DO THIS
const apiKey = "sk-proj-abc123...";
const dbPassword = "mypassword123";
const supabaseKey = "eyJhbGci...";

// ✅ ALWAYS DO THIS
import { env } from "@/lib/env";
const apiKey = env.OPENAI_API_KEY;
```

### ❌ Exposing Secrets to Client

```typescript
// ❌ NEVER - Prefix exposes to client bundle
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJ...

// ✅ CORRECT - No prefix = server-only
OPENAI_API_KEY=sk-proj-...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### ❌ Committing Environment Files

```bash
# ❌ NEVER commit these files
.env.local
.env.production.local
.env.development.local

# ✅ ONLY commit template
.env.example  # With placeholders only
```

### ❌ Using Real Values in .env.example

```bash
# ❌ WRONG - Real API key
OPENAI_API_KEY=sk-proj-Xy9kL2mN4pQ7rS8tU1vW3xY5zA6bC9dE

# ✅ CORRECT - Placeholder
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### ❌ Bypassing Pre-commit Hooks

```bash
# ❌ NEVER use --no-verify unless absolutely necessary
git commit --no-verify -m "bypass hook"

# ✅ Fix the issue instead
git commit -m "proper commit"
```

---

## ✅ ALWAYS DO THESE

### 1. Validate Environment Variables

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().startsWith("sk-"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // ... all env vars
});

export const env = envSchema.parse(process.env);
```

### 2. Mark Server-Only Files

```typescript
// At the TOP of any file with sensitive operations
import "server-only";

// Now this file cannot be imported by client components
```

### 3. Use Correct Supabase Clients

```typescript
// ✅ Client-side (browser)
import { createClient } from "@/lib/supabase/client";
const supabase = createClient(); // Uses anon key

// ✅ Server-side (API routes, Server Components)
import { createServerSupabaseClient } from "@/lib/supabase/server";
const supabase = await createServerSupabaseClient(); // Uses anon key + cookies

// ⚠️ Admin operations (bypasses RLS - use carefully)
import { createAdminClient } from "@/lib/supabase/server";
const supabase = createAdminClient(); // Uses service role key
```

### 4. Enable RLS on All Tables

```sql
-- ALWAYS enable Row Level Security
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- ALWAYS create policies
CREATE POLICY "Users can view own data"
ON your_table FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

### 5. Keep Secrets Server-Side

```typescript
// ✅ API Route (server-side)
export async function POST(request: Request) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`, // ✅ Safe
    },
  });
}

// ❌ Client Component (browser-side)
("use client");
export default function ChatComponent() {
  const callAPI = async () => {
    const response = await fetch("https://api.openai.com/v1/...", {
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`, // ❌ LEAKED!
      },
    });
  };
}
```

---

## 📋 PRE-COMMIT CHECKLIST

Before every commit, verify:

- [ ] No hardcoded API keys, passwords, or tokens in code
- [ ] All secrets are in `.env.local` (not committed)
- [ ] `.env.example` only has placeholders (no real values)
- [ ] Server-only code has `import 'server-only'` at top
- [ ] No `NEXT_PUBLIC_` prefix on sensitive variables
- [ ] Pre-commit hook executed successfully (Gitleaks passed)
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] No `console.log()` statements with sensitive data

---

## 🔥 EMERGENCY: If You Accidentally Commit a Secret

**IMMEDIATE ACTION (0-5 minutes):**

1. **Revoke the secret immediately**

   - OpenAI: Platform → API keys → Delete
   - Supabase: Dashboard → Settings → API → Revoke
   - Database: Change password immediately

2. **Generate new secret**

   - Create replacement in the service dashboard

3. **Update everywhere**

   ```bash
   # Local
   # Update .env.local with new secret

   # Production (Vercel)
   # Dashboard → Settings → Environment Variables → Update

   # Redeploy
   vercel --prod
   ```

4. **Remove from Git history**

   ```bash
   # Install BFG Repo-Cleaner
   brew install bfg

   # Remove the secret from history
   bfg --delete-files .env.local

   # Clean up
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive

   # Force push (⚠️ coordinate with team)
   git push origin --force --all
   ```

5. **Document the incident**
   - Create ticket describing what happened
   - Add to incident log
   - Review what process failed

---

## 🛡️ SAFE PLACEHOLDER PATTERNS

Use these patterns in `.env.example`:

```bash
# ✅ SAFE - Clear placeholder
OPENAI_API_KEY=sk-your-openai-api-key-here
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
DATABASE_PASSWORD=your-secure-password-here

# ✅ SAFE - Descriptive
OPENAI_API_KEY=get-from-https://platform.openai.com/api-keys
STRIPE_SECRET_KEY=get-from-stripe-dashboard-developers-api-keys

# ❌ DANGEROUS - Looks too real
OPENAI_API_KEY=sk-proj-Xy9kL2mN4pQ7rS8tU1vW3xY5zA6bC9dE
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚫 PROHIBITED PATTERNS (Gitleaks Will Block)

These patterns will trigger alerts:

- `sk-[a-zA-Z0-9]{20,}` - OpenAI keys
- `eyJ[a-zA-Z0-9_-]*\.eyJ` - JWT tokens (Supabase)
- `postgres://.*:.*@` - Database URLs with passwords
- `(SECRET|TOKEN|PASSWORD|API_KEY)\s*=\s*["'][^"']{20,}["']`

---

## 📚 REFERENCE

**If secrets are detected:**

- Check `.gitleaks.toml` for configuration
- Review `.gitignore` to ensure files are excluded
- Verify `lib/env.ts` is validating correctly

**Documentation:**

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/database/secure-data)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)

---

**REMEMBER: Speed without security is just a fast path to disaster.**
