# 💰 FinançasIA 2.0

> Aplicativo de gestão financeira pessoal com IA integrada, autenticação via Google OAuth + Email, banco de dados cloud, transações recorrentes automáticas, cookies LGPD e suporte a app nativo (Google Play Store).

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.x-119eff?logo=capacitor)](https://capacitorjs.com)
[![Lovable Cloud](https://img.shields.io/badge/Lovable_Cloud-Backend-0d9668)](https://lovable.dev)

**URL**: https://sunbeam-forge-lab.lovable.app

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Autenticação](#-autenticação)
- [Banco de Dados](#-banco-de-dados)
- [Transações Recorrentes](#-transações-recorrentes)
- [Design System](#-design-system)
- [Segurança](#-segurança)
- [Cookies & LGPD](#-cookies--lgpd)
- [PWA & Offline](#-pwa--offline)
- [App Nativo (Capacitor)](#-app-nativo-capacitor)
- [Como Executar](#-como-executar)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)

---

## Visão Geral

O **FinançasIA** é um app completo de finanças pessoais que permite registrar transações manualmente ou por **linguagem natural via Chat IA**, definir metas financeiras, gerenciar receitas/despesas fixas recorrentes (aplicadas automaticamente todo mês) e exportar relatórios. Autenticação real com **Google OAuth 2.0** e **email/senha** via Lovable Cloud.

### Diferenciais

| Feature | Descrição |
|---------|-----------|
| 🤖 Chat IA | Registro por linguagem natural com suporte a parcelamentos |
| 🔐 Auth Cloud | Login com Google OAuth 2.0 + Email/Senha via Lovable Cloud |
| 🗄️ Banco Cloud | PostgreSQL com Row Level Security (RLS) |
| 🔄 Recorrências Auto | Receitas/despesas fixas aplicadas automaticamente no início do mês |
| 📊 Gráficos | Evolução mensal 1M-1A com Recharts AreaChart |
| 🌙 Dark Mode | Toggle com persistência e detecção do sistema |
| 📥 Exportação | CSV (Excel) e TXT detalhado |
| 📱 PWA + Nativo | Instalável offline + APK/AAB para Play Store |
| 🍪 Cookies LGPD | Consentimento granular com persistência no banco |
| 📲 Install Prompt | Banner de instalação automático para PWA |
| 🔒 Segurança | CSP, XSS sanitization, RLS, HTTPS |

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão | Uso |
|--------|-----------|--------|-----|
| Framework | React | 18.3 | UI reativa com componentes |
| Linguagem | TypeScript | 5.x | Tipagem estática |
| Build | Vite | 5.x | HMR e bundle otimizado |
| Estilização | Tailwind CSS + shadcn/ui | 3.x | Design system com tokens |
| Backend | Lovable Cloud (PostgreSQL) | — | Auth, DB, RLS |
| Auth | Lovable Cloud Auth | — | Google OAuth + Email/Senha |
| Roteamento | React Router DOM | 6.30 | SPA routing |
| Estado | React Context + Hooks | — | AuthContext, useSupabaseFinancialData |
| Gráficos | Recharts | 2.15 | AreaChart de evolução mensal |
| Mobile | Capacitor | 8.x | Android/iOS nativo |
| PWA | Service Worker | — | Cache offline |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    App (React SPA)                   │
├──────────────┬────────────────┬──────────────────────┤
│   Pages      │   Components   │   Hooks/Contexts     │
│  ─ AppPage   │  ─ Landing/*   │  ─ AuthContext        │
│  ─ Login     │  ─ ui/* (29+)  │  ─ useSupabaseData   │
│  ─ Register  │  ─ CookieConsent│ ─ useTheme          │
│  ─ Terms     │  ─ InstallPrompt│ ─ useMobile         │
│  ─ Privacy   │  ─ SplashScreen│                      │
├──────────────┴────────────────┴──────────────────────┤
│                 Lovable Cloud Backend                 │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────────┐ │
│  │ Auth (Google │ │ PostgreSQL   │ │ RLS Policies  │ │
│  │ + Email/PW)  │ │ (6 tables)   │ │ (per user_id) │ │
│  └──────────────┘ └──────────────┘ └───────────────┘ │
│  ┌──────────────────┐ ┌────────────────────────────┐ │
│  │ recurring_log    │ │ cookie_consent             │ │
│  │ (auto-apply)     │ │ (LGPD compliance)          │ │
│  └──────────────────┘ └────────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│           Client Services (Legacy Support)            │
│  ─ chatAIService (NLP engine)                         │
│  ─ securityService (XSS, CSP)                         │
│  ─ reportService (CSV/TXT export)                     │
└──────────────────────────────────────────────────────┘
```

---

## 🔐 Autenticação

### Provedores Suportados

| Provedor | Método | Status |
|----------|--------|--------|
| **Google** | OAuth 2.0 (Managed) | ✅ Ativo |
| **Email/Senha** | Supabase Auth | ✅ Ativo |
| **Apple** | OAuth 2.0 (Managed) | 🔄 Disponível |

### Fluxo de Autenticação

```
┌─ Registro ─────────────────────────────────────────┐
│  1. Email/Senha ou Google OAuth                     │
│  2. Lovable Cloud cria usuário em auth.users       │
│  3. Trigger auto-cria perfil em profiles           │
│  4. AuthContext atualiza estado global             │
│  5. Redireciona para /app                          │
└────────────────────────────────────────────────────┘
```

### Implementação

```typescript
// Google OAuth via Lovable Cloud Managed
import { lovable } from '@/integrations/lovable/index';
const { error } = await lovable.auth.signInWithOAuth('google', {
  redirect_uri: window.location.origin,
});

// Email/Senha via Supabase Auth
import { supabase } from '@/integrations/supabase/client';
await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
await supabase.auth.signInWithPassword({ email, password });
```

---

## 🗄️ Banco de Dados

### Tabelas

| Tabela | Campos Principais | RLS |
|--------|-------------------|-----|
| `profiles` | user_id, display_name, email, avatar_url | ✅ Por user_id |
| `transactions` | user_id, type, amount, category, description, date, payment_method, source, is_recurring | ✅ Por user_id |
| `goals` | user_id, name, target_amount, current_amount, deadline | ✅ Por user_id |
| `fixed_entries` | user_id, type, description, amount, day_of_month, category | ✅ Por user_id |
| `recurring_log` | user_id, year_month, applied_at | ✅ Por user_id |
| `cookie_consent` | session_id, user_id, analytics, marketing, functional | ✅ Restrictive |

### Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado. Políticas garantem que cada usuário só acessa seus próprios dados:

```sql
CREATE POLICY "Users can view own transactions"
ON public.transactions FOR SELECT USING (auth.uid() = user_id);
```

---

## 🔄 Transações Recorrentes

O sistema aplica automaticamente as receitas e despesas fixas como transações no início de cada mês.

### Fluxo

```
┌─ Auto-Apply (useSupabaseFinancialData) ─────────────┐
│  1. Usuário faz login e acessa /app                  │
│  2. Hook verifica recurring_log para o mês atual     │
│  3. Se não aplicado → insere transações fixas        │
│  4. Marca mês como processado em recurring_log       │
│  5. Toast: "X transações recorrentes aplicadas!"     │
└──────────────────────────────────────────────────────┘
```

### Exemplo

Se o usuário tem cadastrado:
- 💰 Salário: R$ 5.000 (dia 5)
- 📋 Aluguel: R$ 1.500 (dia 10)

No dia 1º de cada mês, ao abrir o app:
- Cria transação `[Recorrente] Salário` → R$ 5.000 (receita, dia 5)
- Cria transação `[Recorrente] Aluguel` → R$ 1.500 (despesa, dia 10)

---

## 🍪 Cookies & LGPD

### Consentimento Granular

| Tipo | Descrição | Padrão |
|------|-----------|--------|
| ✅ Essenciais | Autenticação e sessão | Sempre ativo |
| 📊 Analíticos | Performance e UX | Opt-in |
| 📢 Marketing | Conteúdo personalizado | Opt-in |

### Implementação

- Banner de cookies aparece 1.5s após o carregamento
- Opções: "Aceitar todos", "Apenas essenciais", "Personalizar"
- Consentimento salvo no `localStorage` e na tabela `cookie_consent`
- Re-exibição após 7 dias se dispensado

---

## 📲 PWA Install Prompt

Banner inteligente que detecta o ambiente:
- **Android**: Botão "Instalar" usando `beforeinstallprompt` API
- **iOS**: Instrução "Toque em Compartilhar → Adicionar à Tela de Início"
- **Desktop**: Prompt padrão do navegador
- Não aparece se já instalado (`display-mode: standalone`)
- Dismiss com cooldown de 7 dias

---

## 🎨 Design System

### Tokens de Cor (HSL)

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--background` | `150 20% 98%` | `160 30% 6%` |
| `--primary` | `160 84% 39%` | `160 84% 39%` |
| `--card` | `0 0% 100%` | `160 25% 10%` |
| `--destructive` | `0 72% 51%` | `0 62% 30%` |

### Tipografia

| Uso | Fonte |
|-----|-------|
| Títulos | Space Grotesk |
| Corpo | Inter |

---

## 🔒 Segurança

### Camadas de Proteção

| # | Camada | Implementação |
|---|--------|--------------|
| 1 | **Autenticação Cloud** | Lovable Cloud Auth com JWT tokens |
| 2 | **RLS (Row Level Security)** | Todas as 6 tabelas protegidas por user_id |
| 3 | **Google OAuth 2.0** | Managed credentials via Lovable Cloud |
| 4 | **CSP Headers** | Content-Security-Policy via meta tags |
| 5 | **XSS Sanitization** | Allowlist estrito + escape de caracteres |
| 6 | **HTTPS** | Forçado em produção |
| 7 | **Cookie Consent** | LGPD compliance com política restritiva |
| 8 | **Anti-Prototype-Pollution** | safeJSONParse em dados externos |
| 9 | **Secure Headers** | X-Frame-Options: DENY, X-Content-Type-Options: nosniff |
| 10 | **Session Management** | AuthContext com onAuthStateChange listener |

### Headers de Segurança

```html
<meta http-equiv="Content-Security-Policy" content="..." />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="DENY" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

---

## 📱 PWA & Offline

| Arquivo | Função |
|---------|--------|
| `public/manifest.json` | Nome, ícones, cores, atalhos, display standalone |
| `public/sw.js` | Service Worker com estratégia network-first + cache |
| `index.html` | Metatags PWA, registro do SW, apple-touch-icon |

---

## 📲 App Nativo (Capacitor)

### Gerar APK/AAB

```bash
git clone <repo-url> && cd financasia
npm install
npx cap add android
npm run build
npx cap sync android
npx cap open android
# Android Studio → Build → Generate Signed Bundle/APK
```

### Checklist Play Store

- [x] Ícones adaptativos (maskable) 192×192 e 512×512
- [x] Splash Screen nativo (2s, #0d9668)
- [x] Termos de Uso + Política de Privacidade LGPD
- [x] Exclusão de conta disponível
- [x] Cookie consent LGPD
- [x] Responsivo mobile-first
- [x] Service Worker offline

---

## 🚀 Como Executar

```bash
npm install
npm run dev
# → http://localhost:8080
```

### Build

```bash
npm run build
```

---

## 📁 Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── components/
│   ├── CookieConsent.tsx        # LGPD cookie banner
│   ├── InstallPrompt.tsx        # PWA install banner
│   ├── MonthlyEvolutionChart.tsx # Recharts area chart
│   ├── SplashScreen.tsx         # Animated splash
│   ├── Landing/                 # Landing page sections
│   └── ui/                      # 29+ shadcn components
├── hooks/
│   ├── useSupabaseFinancialData.ts # Cloud data + auto-recurring
│   ├── useTheme.ts              # Dark mode hook
│   └── useFinancialData.ts      # Legacy localStorage hook
├── integrations/
│   ├── lovable/index.ts         # Google OAuth managed
│   └── supabase/                # Auto-generated client + types
├── pages/
│   ├── AppPage.tsx              # Main app (5 tabs)
│   ├── LoginPage.tsx            # Email + Google login
│   ├── RegisterPage.tsx         # Email + Google signup
│   └── ...
├── services/
│   ├── chatAIService.ts         # NLP engine
│   ├── securityService.ts       # XSS, CSP, sanitization
│   └── reportService.ts         # CSV/TXT export
└── types/index.ts               # TypeScript interfaces
```

---

## 📄 Licença

© 2026 FinançasIA 2.0 — Gestão Inteligente de Finanças Pessoais
