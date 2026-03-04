import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-28 pb-20 px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl -z-10" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-emerald-light/30 blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary font-medium mb-8 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
          Novo: Chat IA para registrar gastos
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up">
          Controle suas finanças{' '}
          <span className="text-gradient-primary">com Inteligência Artificial</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Registre gastos por conversa, controle parcelas automaticamente,
          acompanhe metas e exporte relatórios. Tudo no seu bolso.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90 transition-opacity px-8 py-6 text-base"
          >
            Começar Grátis — 7 dias
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-6 text-base"
          >
            Ver Planos
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <span>✅ Sem cartão de crédito</span>
          <span>🔒 100% seguro</span>
          <span>📱 PWA instalável</span>
        </div>

        {/* Phone mockup */}
        <div className="mt-16 max-w-sm mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="rounded-3xl bg-gradient-hero p-1 shadow-lg">
            <div className="rounded-[22px] bg-card overflow-hidden">
              <div className="bg-gradient-hero px-6 py-4 flex items-center justify-between">
                <span className="text-primary-foreground font-display font-bold text-lg">💰 FinançasIA</span>
                <span className="text-primary-foreground/80 text-sm">🤖 IA</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="rounded-xl bg-gradient-hero p-4 text-center">
                  <p className="text-primary-foreground/80 text-xs">Saldo Atual</p>
                  <p className="text-primary-foreground text-2xl font-bold">R$ 3.450,00</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-emerald-light p-3 text-center">
                    <p className="text-xs text-muted-foreground">💰 Receitas</p>
                    <p className="font-bold text-primary">R$ 5.000</p>
                  </div>
                  <div className="rounded-lg bg-destructive/10 p-3 text-center">
                    <p className="text-xs text-muted-foreground">💸 Despesas</p>
                    <p className="font-bold text-destructive">R$ 1.550</p>
                  </div>
                </div>
                <div className="rounded-xl bg-accent p-4">
                  <p className="text-xs font-medium mb-2">💬 Chat IA</p>
                  <div className="rounded-lg bg-card p-2 text-xs text-muted-foreground mb-2">
                    "Comprei um tênis de R$ 400 no cartão em 4x"
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2 text-xs text-primary font-medium">
                    ✅ Registrado! 4x de R$ 100 no crédito
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
