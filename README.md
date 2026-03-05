# 💰 FinançasIA 2.0

**Gestão Inteligente de Finanças Pessoais com IA**

**URL**: https://sunbeam-forge-lab.lovable.app

## 📋 Sobre

FinançasIA é um app de gestão financeira pessoal com inteligência artificial integrada. Registre gastos por conversa, controle parcelas automaticamente, acompanhe metas e exporte relatórios — tudo no seu bolso.

## 🚀 Funcionalidades

### Core
- 📊 **Dashboard** com saldo, receitas, despesas e gráficos por categoria
- 💬 **Chat IA** para registro de transações por linguagem natural
- 💸 **Extrato** com adição manual de receitas e despesas
- 🎯 **Metas Financeiras** com acompanhamento de progresso
- 👤 **Perfil** com gestão de plano e exportação de dados

### Chat IA
- Parsing de linguagem natural: "Comprei um tênis de R$ 400 no cartão em 4x"
- Detecção automática de: valor, categoria, método de pagamento, parcelamento
- Registro automático de parcelas mensais

### Exportação (Pro)
- 📥 CSV para Excel
- 📄 Relatório TXT completo com resumo por categoria e método

### Planos
- **Grátis**: 30 transações/mês, 5 chats/dia, 1 meta
- **Pro Mensal**: R$ 9,90/mês — Ilimitado
- **Pro Anual**: R$ 7,90/mês — Ilimitado

### Segurança
- Criptografia SHA-256 para senhas
- Dados isolados por usuário
- Proteção contra XSS (sanitização de inputs)
- Rate limiting de login

## 🛠️ Stack Tecnológica

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Estilo**: Tailwind CSS + shadcn/ui
- **Mobile Nativo**: Capacitor (Android/iOS)
- **PWA**: Service Worker + manifest.json
- **Persistência**: localStorage (offline-first)

## 📱 App Nativo (Play Store)

Este projeto usa **Capacitor** para gerar um APK/AAB nativo para publicação na Google Play Store.

### Requisitos
- Node.js 18+
- Android Studio (para Android)
- Xcode (para iOS, somente macOS)

### Setup local

```bash
# 1. Clone o repositório
git clone <repo-url>
cd <repo>

# 2. Instale dependências
npm install

# 3. Adicione plataforma Android
npx cap add android

# 4. Build do projeto web
npm run build

# 5. Sincronize com o nativo
npx cap sync

# 6. Abra no Android Studio
npx cap open android

# 7. Rode no emulador ou dispositivo
npx cap run android
```

### Gerar APK/AAB para Play Store

1. Abra o projeto no Android Studio (`npx cap open android`)
2. Vá em **Build > Generate Signed Bundle / APK**
3. Crie ou selecione sua keystore
4. Selecione **Android App Bundle (AAB)** para Play Store
5. Faça upload no [Google Play Console](https://play.google.com/console)

### Requisitos Play Store
- ✅ Ícones em todas as resoluções (192x192, 512x512)
- ✅ Ícones maskable para dispositivos com formatos adaptativos
- ✅ Splash screen nativo configurado
- ✅ Status bar com cor temática
- ✅ Orientação portrait
- ✅ PWA como fallback
- ✅ Manifest completo

## How can I edit this code?

**Use Lovable**

Simply visit the [Lovable Project](https://sunbeam-forge-lab.lovable.app) and start prompting.

**Use your preferred IDE**

Clone this repo and push changes. Pushed changes will also be reflected in Lovable.

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── Landing/          # Landing page sections
│   ├── SplashScreen.tsx  # Animação de inicialização
│   └── ui/               # shadcn/ui components
├── hooks/
│   └── useFinancialData.ts  # Hook de dados financeiros
├── pages/
│   ├── AppPage.tsx       # App principal (tabs)
│   ├── LoginPage.tsx     # Autenticação
│   ├── RegisterPage.tsx  # Registro
│   └── Index.tsx         # Redirecionamento
├── services/
│   ├── authService.ts        # Autenticação
│   ├── chatAIService.ts      # Motor de IA (NLP)
│   ├── reportService.ts      # Exportação CSV/TXT
│   ├── securityService.ts    # Criptografia e segurança
│   └── subscriptionService.ts # Gestão de planos
└── types/
    └── index.ts          # TypeScript types
```

## 📄 Licença

Projeto privado — Todos os direitos reservados.
