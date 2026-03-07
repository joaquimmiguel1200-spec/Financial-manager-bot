# 💰 FinançasIA 2.0

> Aplicativo de gestão financeira pessoal com IA integrada, dark mode, exportação de dados e suporte a app nativo (Google Play Store).

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.x-119eff?logo=capacitor)](https://capacitorjs.com)

**URL**: https://sunbeam-forge-lab.lovable.app

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Design System](#-design-system)
- [Segurança](#-segurança)
- [PWA & Offline](#-pwa--offline)
- [App Nativo (Capacitor)](#-app-nativo-capacitor)
- [Como Executar](#-como-executar)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Tipos TypeScript](#-tipos-typescript)
- [Serviços (Services)](#-serviços-services)
- [Planos e Limites](#-planos-e-limites)
- [Contribuição](#-contribuição)

---

## Visão Geral

O **FinançasIA** é um app completo de finanças pessoais que permite registrar transações manualmente ou por **linguagem natural via Chat IA**, definir metas financeiras, gerenciar receitas/despesas fixas recorrentes e exportar relatórios. Projetado como **PWA** e **app nativo** para Google Play Store via Capacitor.

### Diferenciais

| Feature | Descrição |
|---------|-----------|
| 🤖 Chat IA | Registro por linguagem natural com suporte a parcelamentos |
| 🌙 Dark Mode | Toggle com persistência e detecção de preferência do sistema |
| 📊 Dashboard | Resumo financeiro com categorias e gráficos |
| 🔄 Recorrências | Receitas e despesas fixas com dia do mês configurável |
| 📥 Exportação | CSV (Excel) e TXT detalhado — exclusivo Pro |
| 📱 PWA + Nativo | Instalável offline + APK/AAB para Play Store |
| 🔒 Segurança | Hash SHA-256, sanitização XSS, rate limiting |
| 📜 LGPD | Termos de Uso e Política de Privacidade completos |

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão | Uso |
|--------|-----------|--------|-----|
| Framework | React | 18.3 | UI reativa com componentes |
| Linguagem | TypeScript | 5.x | Tipagem estática |
| Build | Vite | 5.x | HMR e bundle otimizado |
| Estilização | Tailwind CSS + shadcn/ui | 3.x | Design system com tokens |
| Roteamento | React Router DOM | 6.30 | SPA routing |
| Estado | React Hooks | — | useState, useCallback, useEffect |
| Gráficos | Recharts | 2.15 | AreaChart de evolução mensal (1M-1A) |
| Formulários | React Hook Form + Zod | 7.x / 3.x | Validação tipada |
| Mobile | Capacitor | 8.x | Android/iOS nativo |
| PWA | Service Worker | — | Cache offline |
| Testes | Vitest | — | Unit testing |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    App (React SPA)                   │
├──────────────┬────────────────┬──────────────────────┤
│   Pages      │   Components   │   Hooks              │
│  ─ AppPage   │  ─ Landing/*   │  ─ useFinancialData  │
│  ─ Login     │  ─ ui/* (29+)  │  ─ useTheme          │
│  ─ Register  │  ─ SplashScreen│  ─ useMobile         │
│  ─ Terms     │  ─ NavLink     │  ─ useToast          │
│  ─ Privacy   │               │                      │
├──────────────┴────────────────┴──────────────────────┤
│                    Services Layer                     │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────────┐ │
│  │ authService  │ │ chatAIService│ │ reportService │ │
│  │ (auth+sessão)│ │ (NLP engine) │ │ (CSV/TXT)     │ │
│  └──────────────┘ └──────────────┘ └───────────────┘ │
│  ┌──────────────────┐ ┌────────────────────────────┐ │
│  │subscriptionService│ │ securityService            │ │
│  │(planos+limites)   │ │ (hash, sanitize, rate)     │ │
│  └──────────────────┘ └────────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│           Storage (localStorage, offline-first)       │
│  ─ Dados isolados por userId                          │
│  ─ Sessão com token de autenticação                   │
│  ─ Preferência de tema (dark/light)                   │
│  ─ Assinatura e plano do usuário                      │
└──────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Autenticação** → `authService` gerencia registro/login com hash SHA-256 e sessão via localStorage
2. **Dados Financeiros** → `useFinancialData` hook centraliza transações e metas, persistindo por `userId`
3. **Chat IA** → `chatAIService` processa linguagem natural → extrai valor, categoria, método e parcelas
4. **Tema** → `useTheme` hook gerencia dark/light mode com persistência e detecção do sistema
5. **Entradas Fixas** → Armazenadas no perfil do usuário via `authService.updateFixedIncomes/Expenses`
6. **Exportação** → `reportService` gera CSV e TXT com resumo por categoria/método

---

## 🚀 Funcionalidades

### 📊 Dashboard (`DashboardTab`)
- Saldo mensal calculado (receitas − despesas)
- Cards separados de receita e despesa total
- **📈 Gráfico de Evolução Mensal** (Recharts AreaChart) com:
  - Seletor de período: 1M, 2M, 3M, 4M, 5M, 6M e 1 Ano
  - Linhas de Receitas (verde) e Despesas (vermelho) com preenchimento gradiente
  - Tooltip com valores formatados em R$
  - Resumo totalizado do período (Receitas, Despesas, Saldo)
- Top 5 categorias com barras de progresso proporcionais
- Últimas 5 transações com ícone, método e valor

### 💸 Extrato (`TransactionsTab`)
- Formulário de adição com tipo (receita/despesa), valor, descrição, categoria e método de pagamento
- Lista completa com ícones por categoria
- Indicação de fonte (manual 📝 ou chat 💬)
- Suporte a parcelamentos com indicador `1/10`
- Exclusão individual com confirmação
- Métodos: Pix, Crédito, Débito, Dinheiro, Boleto

### 💬 Chat IA (`ChatTab`)

O motor de NLP (`chatAIService`) processa mensagens em português:

**Detecção de Valor:**
```
"R$ 400"  →  400.00
"400 reais"  →  400.00
"2 mil reais"  →  2000.00
"1.500,00"  →  1500.00
```

**Detecção de Método de Pagamento:**
```
"no pix"  →  pix
"no cartão" / "no crédito"  →  credito
"no débito"  →  debito
"no boleto"  →  boleto
(sem menção)  →  dinheiro
```

**Detecção de Parcelamento:**
```
"em 4x"  →  4 parcelas
"em 10 vezes"  →  10 parcelas
"parcelado em 12"  →  12 parcelas
```

**Categorização Automática (keywords):**

| Categoria | Palavras-chave |
|-----------|---------------|
| Alimentação | almoço, mercado, restaurante, pizza, padaria... |
| Transporte | uber, gasolina, ônibus, estacionamento... |
| Moradia | aluguel, condomínio, luz, internet... |
| Saúde | farmácia, médico, dentista, consulta... |
| Educação | curso, faculdade, livro, mensalidade... |
| Lazer | cinema, viagem, bar, show... |
| Roupas | tênis, sapato, camisa, vestido... |
| Tecnologia | celular, notebook, fone, tv... |
| Assinaturas | netflix, spotify, streaming... |

**Exemplo Completo:**
```
Entrada: "Comprei um notebook de R$ 4000 no cartão em 10x"
→ type: expense
→ amount: 4000
→ category: Tecnologia
→ paymentMethod: credito
→ installments: 10
→ Gera 10 transações de R$ 400 cada (parcelas mensais)
```

### 🎯 Metas Financeiras (`GoalsTab`)
- Criação com nome, valor objetivo e prazo (deadline)
- Barra de progresso visual percentual
- Contagem de dias restantes
- Adição incremental de valores
- Exclusão individual

### 👤 Perfil (`ProfileTab`)
- Informações do usuário (nome, email, plano)
- **🌙 Toggle Dark Mode** com ícone dinâmico (Sol/Lua)
- **💰 Receitas Fixas** — CRUD completo com:
  - Descrição, valor (R$), dia do mês (1-31)
  - Categoria e método de pagamento
- **📋 Despesas Fixas** — mesma estrutura
- Upgrade para plano Pro
- **📥 Exportação CSV/TXT** (Pro only)
- Informações de segurança
- **⚠️ Zona de Perigo** — Exclusão de conta com validação de senha

### 📜 Páginas Legais
- **Termos de Uso** (`/terms`) — 12 seções completas
- **Política de Privacidade** (`/privacy`) — 15 seções em conformidade com a LGPD (Lei 13.709/2018)
- Links no rodapé da landing e na tela de registro
- Header sticky com botão de voltar
- Layout responsivo mobile-first

---

## 🎨 Design System

### Tokens de Cor (HSL)

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--background` | `150 20% 98%` | `160 30% 6%` |
| `--foreground` | `160 30% 8%` | `150 15% 95%` |
| `--primary` | `160 84% 39%` | `160 84% 39%` |
| `--card` | `0 0% 100%` | `160 25% 10%` |
| `--muted` | `150 15% 93%` | `160 15% 14%` |
| `--destructive` | `0 72% 51%` | `0 62% 30%` |
| `--border` | `150 15% 90%` | `160 15% 16%` |

### Tipografia

| Uso | Fonte | CSS Variable |
|-----|-------|-------------|
| Títulos (H1-H6) | Space Grotesk | `--font-display` |
| Corpo de texto | Inter | `--font-body` |

### Utilitários CSS Customizados

| Classe | Efeito |
|--------|--------|
| `.bg-gradient-hero` | Gradiente emerald (135deg) |
| `.bg-gradient-dark` | Gradiente escuro |
| `.bg-gradient-gold` | Gradiente dourado |
| `.glass` | Glassmorphism (backdrop-blur + transparência) |
| `.shadow-glow` | Sombra luminosa emerald |
| `.animate-float` | Flutuação suave (6s loop) |
| `.animate-fade-up` | Fade up na entrada (0.6s) |
| `.animate-scale-in` | Scale in na entrada (0.4s) |

### Componentes UI (shadcn/ui)

29+ componentes base incluindo: Accordion, Alert, Avatar, Badge, Button, Calendar, Card, Carousel, Checkbox, Command, Dialog, Drawer, Dropdown Menu, Form, Input, Label, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Sheet, Skeleton, Slider, Switch, Tabs, Toast, Toggle, Tooltip.

---

## 🔒 Segurança (Enterprise-Grade)

O FinançasIA 2.0 implementa **10 camadas de segurança** para proteção completa de ponta a ponta:

### Camadas de Proteção

| # | Camada | Implementação | Detalhes |
|---|--------|--------------|----------|
| 1 | **Hash de Senha** | PBKDF2 (100k iterações) + salt único | Migração automática de hashes legados SHA-256 |
| 2 | **Sanitização XSS** | Allowlist estrito + escape de 8 caracteres perigosos | `< > " ' & \` \ /` → entidades HTML |
| 3 | **Rate Limiting** | Backoff exponencial (3→30s, 5→5min, 8→30min, 10→1h) | Por email normalizado |
| 4 | **Sessão Segura** | Token 256-bit + expiração 24h + fingerprint do browser | Validação em cada requisição |
| 5 | **Integridade de Dados** | Checksum SHA-256 em dados persistidos | Detecção de tampering no localStorage |
| 6 | **Token CSRF** | Token 192-bit por sessão via sessionStorage | Proteção contra cross-site request forgery |
| 7 | **CSP (Content Security Policy)** | Meta tag com diretivas restritivas | `frame-ancestors 'none'`, `base-uri 'self'` |
| 8 | **Comparação Constant-Time** | Prevenção de timing attacks na verificação | Todas as comparações de hash/token |
| 9 | **Anti-Prototype-Pollution** | `safeJSONParse` remove `__proto__`, `constructor` | Parsing seguro de dados externos |
| 10 | **Audit Log** | Log de eventos de segurança em memória | Login, registro, falhas, rate limiting |

### Headers de Segurança (index.html)

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="DENY" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

### Validação de Inputs

| Campo | Regras |
|-------|--------|
| Email | RFC 5322 simplificado, máx. 254 chars |
| Senha | 6-128 chars, 1 maiúscula, 1 número, verificação de senhas comuns |
| Descrição | Máx. 500 chars, sanitização completa |
| Valor | Numérico, > 0, ≤ 999.999.999, finito |
| Nome | Mín. 2 chars, sanitizado |

### Detalhes Técnicos do PBKDF2

```typescript
// Substitui SHA-256 simples por PBKDF2 com salt único
Algoritmo: PBKDF2-HMAC-SHA256
Iterações: 100.000
Salt: 16 bytes (crypto.getRandomValues)
Output: 32 bytes
Formato: "pbkdf2:{iterations}:{salt_hex}:{hash_hex}"
```

### Anti-Enumeração

- Mensagens de erro idênticas para "email não encontrado" e "senha incorreta"
- Rate limiting aplicado mesmo para emails inexistentes
- Normalização de email (lowercase + trim) antes de qualquer operação

### Sessão e Autenticação

```
┌─ Login ─────────────────────────────────────┐
│  1. Normaliza email (lowercase + trim)       │
│  2. Verifica rate limiting (exponencial)     │
│  3. Busca usuário                            │
│  4. Verifica senha (PBKDF2 constant-time)    │
│  5. Migra hash legado se necessário          │
│  6. Cria sessão segura (token + fingerprint) │
│  7. Gera CSRF token                          │
│  8. Registra evento no audit log             │
└──────────────────────────────────────────────┘
```

---

## 📱 PWA & Offline

### Arquivos de Configuração

| Arquivo | Função |
|---------|--------|
| `public/manifest.json` | Nome, ícones, cores, atalhos, display standalone |
| `public/sw.js` | Service Worker com estratégia network-first + cache |
| `index.html` | Metatags PWA, registro do SW, apple-touch-icon |

### Ícones

| Tamanho | Arquivo | Uso |
|---------|---------|-----|
| 192×192 | `icon-192.png` | Ícone padrão |
| 512×512 | `icon-512.png` | Splash screen |
| 192×192 | `icon-maskable-192.png` | Ícone adaptativo Android |
| 512×512 | `icon-maskable-512.png` | Ícone adaptativo Android |

### Como Instalar (PWA)

- **Android**: Menu do navegador → "Adicionar à tela inicial"
- **iOS**: Compartilhar → "Adicionar à Tela de Início"

---

## 📲 App Nativo (Capacitor)

### Configuração (`capacitor.config.ts`)

```typescript
{
  appId: 'app.lovable.d27214b5ded346b790ae9064a136f0b8',
  appName: 'FinançasIA',
  webDir: 'dist',
  plugins: {
    SplashScreen: { launchShowDuration: 2000, backgroundColor: '#0d9668' },
    StatusBar: { backgroundColor: '#0d9668', style: 'LIGHT' },
  }
}
```

### Plugins Nativos

| Plugin | Uso |
|--------|-----|
| `@capacitor/core` | Core runtime |
| `@capacitor/android` | Plataforma Android |
| `@capacitor/ios` | Plataforma iOS |
| `@capacitor/splash-screen` | Splash screen nativo (2s) |
| `@capacitor/status-bar` | Cor da barra de status |

### Gerar APK/AAB para Play Store

```bash
# 1. Clone e instale
git clone <repo-url> && cd financasia
npm install

# 2. Adicione a plataforma Android
npx cap add android

# 3. Build e sincronize
npm run build
npx cap sync android

# 4. Abra no Android Studio
npx cap open android

# 5. No Android Studio: Build → Generate Signed Bundle/APK
#    Selecione "Android App Bundle (AAB)" para Play Store
```

### Checklist Play Store

- [x] Ícones adaptativos (maskable) 192×192 e 512×512
- [x] Splash Screen nativo (2s, cor #0d9668)
- [x] Status bar com cor temática
- [x] Termos de Uso completos (`/terms` — 12 seções)
- [x] Política de Privacidade LGPD (`/privacy` — 15 seções)
- [x] Exclusão de conta disponível no perfil
- [x] Conteúdo responsivo mobile-first
- [x] Funcionamento offline (Service Worker)
- [x] Manifest completo com atalhos

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou bun

### Desenvolvimento

```bash
npm install
npm run dev
# → http://localhost:5173
```

### Testes

```bash
npm run test
```

### Build de Produção

```bash
npm run build
# Output em /dist — pode ser hospedado em Vercel, Netlify, AWS S3, etc.
```

---

## 📁 Estrutura de Arquivos

```
financasia/
├── public/
│   ├── favicon.ico               # Favicon
│   ├── icon-192.png              # Ícone PWA 192×192
│   ├── icon-512.png              # Ícone PWA 512×512
│   ├── icon-maskable-192.png     # Ícone adaptativo 192×192
│   ├── icon-maskable-512.png     # Ícone adaptativo 512×512
│   ├── manifest.json             # Manifest PWA
│   ├── sw.js                     # Service Worker
│   └── robots.txt                # SEO robots
├── src/
│   ├── components/
│   │   ├── Landing/
│   │   │   ├── LandingPage.tsx       # Página principal + rodapé
│   │   │   ├── HeroSection.tsx       # Hero com CTAs
│   │   │   ├── FeaturesSection.tsx   # Grid de funcionalidades
│   │   │   ├── HowItWorksSection.tsx # Passo a passo
│   │   │   ├── ChatDemoSection.tsx   # Demo interativo do chat
│   │   │   ├── PricingSection.tsx    # Planos e preços
│   │   │   ├── TestimonialsSection.tsx # Depoimentos
│   │   │   └── FAQSection.tsx        # Perguntas frequentes
│   │   ├── ui/                       # 29+ componentes shadcn/ui
│   │   ├── NavLink.tsx               # Link de navegação
│   │   └── SplashScreen.tsx          # Splash animado (web)
│   ├── hooks/
│   │   ├── useFinancialData.ts   # Transações e metas (localStorage)
│   │   ├── useTheme.ts           # Dark/light mode toggle
│   │   ├── use-mobile.tsx        # Detecção de viewport mobile
│   │   └── use-toast.ts          # Sistema de notificações
│   ├── pages/
│   │   ├── AppPage.tsx           # App principal com 5 tabs
│   │   ├── Index.tsx             # Redirect → Landing
│   │   ├── LoginPage.tsx         # Tela de login
│   │   ├── RegisterPage.tsx      # Tela de cadastro
│   │   ├── TermsPage.tsx         # Termos de Uso (12 seções)
│   │   ├── PrivacyPage.tsx       # Política de Privacidade (15 seções LGPD)
│   │   └── NotFound.tsx          # Página 404
│   ├── services/
│   │   ├── authService.ts        # Auth, sessão, perfil, entradas fixas
│   │   ├── chatAIService.ts      # Motor NLP (parsing + geração)
│   │   ├── reportService.ts      # Exportação CSV e TXT
│   │   ├── subscriptionService.ts # Planos, limites, trial
│   │   └── securityService.ts    # Hash, sanitize, rate limiting
│   ├── types/
│   │   └── index.ts              # Tipos, constantes, labels
│   ├── App.tsx                   # Router principal
│   ├── App.css                   # Estilos globais
│   ├── index.css                 # Design tokens (light + dark)
│   └── main.tsx                  # Entry point
├── capacitor.config.ts           # Config Capacitor (nativo)
├── tailwind.config.ts            # Config Tailwind + tokens
├── vite.config.ts                # Config Vite
├── vitest.config.ts              # Config testes
├── tsconfig.json                 # Config TypeScript
└── package.json                  # Dependências e scripts
```

---

## 📝 Tipos TypeScript

### Transaction
```typescript
interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: 'pix' | 'pix_parcelado' | 'credito' | 'debito' | 'dinheiro' | 'boleto';
  installments?: Installment[];
  parentId?: string;         // Referência à transação pai (parcelamento)
  totalAmount?: number;      // Valor total do parcelamento
  isRecurring?: boolean;
  source?: 'manual' | 'chat';
  createdAt: string;
}
```

### Installment
```typescript
interface Installment {
  number: number;     // Número da parcela (1, 2, 3...)
  total: number;      // Total de parcelas
  value: number;      // Valor da parcela
  dueDate: string;    // Data de vencimento
  paid: boolean;      // Se já foi paga
}
```

### FinancialGoal
```typescript
interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}
```

### FixedEntry
```typescript
interface FixedEntry {
  id: string;
  description: string;
  amount: number;
  dayOfMonth: number;      // Dia do mês (1-31)
  category?: string;
  paymentMethod?: PaymentMethod;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  password: string;         // Hash SHA-256
  createdAt: string;
  fixedIncomes: FixedEntry[];
  fixedExpenses: FixedEntry[];
}
```

---

## ⚙️ Serviços (Services)

### `authService.ts`
| Método | Descrição |
|--------|-----------|
| `register(name, email, password)` | Cria conta com hash de senha |
| `login(email, password)` | Valida credenciais com rate limiting |
| `logout()` | Remove sessão e token |
| `getSession()` | Retorna sessão ativa ou null |
| `getCurrentUser()` | Retorna User completo |
| `updateUserProfile(name)` | Atualiza nome com sanitização |
| `updateFixedIncomes(entries)` | Salva receitas fixas |
| `updateFixedExpenses(entries)` | Salva despesas fixas |
| `changePassword(current, new)` | Altera senha com validação |
| `deleteAccount(password)` | Exclui conta e todos os dados |

### `chatAIService.ts`
| Método | Descrição |
|--------|-----------|
| `parseMessage(msg)` | Extrai ParsedTransaction do texto |
| `createTransactions(parsed, userId)` | Gera Transaction[] (com parcelas) |
| `generateResponse(parsed, msg)` | Gera resposta da IA formatada |

### `subscriptionService.ts`
| Método | Descrição |
|--------|-----------|
| `getSubscription()` | Retorna assinatura atual |
| `isPro()` | Verifica se é Pro (inclui admin bypass) |
| `subscribe(plan)` | Ativa plano com 7 dias trial |
| `canAddTransaction(count)` | Verifica limite (30/mês free) |
| `canUseChat(count)` | Verifica limite (5/dia free) |
| `canExport()` | Só para Pro |
| `canAddGoal(count)` | Verifica limite (1 free) |

### `securityService.ts`
| Método | Descrição |
|--------|-----------|
| `hashPassword(password)` | SHA-256 via Web Crypto API |
| `verifyPassword(password, hash)` | Compara hash |
| `sanitizeInput(input)` | Remove caracteres perigosos (XSS) |
| `validateEmail(email)` | Regex de formato |
| `validatePasswordStrength(pw)` | Mín 6 chars, 1 maiúscula, 1 número |
| `checkLoginAttempts(email)` | Rate limiting (5 tentativas) |
| `generateId()` | UUID v4 via crypto |
| `generateSessionToken()` | Token 32 bytes hex |

### `reportService.ts`
| Método | Descrição |
|--------|-----------|
| `exportCSV(transactions)` | Gera e baixa arquivo CSV |
| `exportReport(transactions, goals)` | Gera relatório TXT completo |

---

## 💰 Planos e Limites

| Recurso | Grátis | Pro (R$ 9,90/mês) |
|---------|--------|-------------------|
| Transações/mês | 30 | ∞ |
| Chat IA/dia | 5 | ∞ |
| Metas financeiras | 1 | ∞ |
| Exportação CSV/TXT | ❌ | ✅ |
| Receitas/Despesas fixas | ✅ | ✅ |
| Dark Mode | ✅ | ✅ |
| Trial gratuito | — | 7 dias |

**Admin bypass**: O email `joaquimmiguel1200@gmail.com` possui acesso Pro vitalício.

---

## 🤝 Contribuição

```bash
# 1. Fork o repositório
# 2. Crie uma branch
git checkout -b feature/nova-funcionalidade

# 3. Commit (conventional commits)
git commit -m 'feat: adiciona nova funcionalidade'

# 4. Push e abra PR
git push origin feature/nova-funcionalidade
```

### Convenções de Commit

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação |
| `style:` | Formatação (sem lógica) |
| `refactor:` | Refatoração |
| `test:` | Testes |
| `chore:` | Manutenção |

---

## 📄 Licença

Projeto privado — Todos os direitos reservados.

---

<p align="center">
  Feito com ❤️ usando <a href="https://lovable.dev">Lovable</a>
</p>
