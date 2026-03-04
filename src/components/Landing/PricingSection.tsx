import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 px-4 bg-accent/30">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-sm font-medium text-primary mb-2">Planos</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          Invista no seu futuro financeiro
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Menos que um café por dia para ter controle total do seu dinheiro.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setAnnual(false)}
            className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${!annual ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Mensal
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${annual ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Anual
            <span className="ml-1 text-xs">-20%</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl bg-card border border-border p-8">
            <h3 className="font-display font-bold text-xl mb-2">Grátis</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">R$ 0</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                { ok: true, text: 'Até 30 transações/mês' },
                { ok: true, text: 'Dashboard básico' },
                { ok: true, text: '1 meta financeira' },
                { ok: false, text: 'Chat IA limitado (5/dia)' },
                { ok: false, text: 'Sem exportação' },
                { ok: false, text: 'Sem receitas/despesas fixas' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  {item.ok ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={item.ok ? '' : 'text-muted-foreground'}>{item.text}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" onClick={() => navigate('/register')}>
              Começar Grátis
            </Button>
          </div>

          {/* Pro */}
          <div className="rounded-2xl bg-card border-2 border-primary p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              Mais Popular
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Pro</h3>
            <div className="mb-1">
              <span className="text-4xl font-bold">R$ {annual ? '7,90' : '9,90'}</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">Cancele quando quiser</p>
            <ul className="space-y-3 mb-8">
              {[
                'Transações ilimitadas',
                'Chat IA ilimitado',
                'Metas ilimitadas',
                'Exportar CSV & Relatórios',
                'Receitas/Despesas fixas',
                'Parcelas & Parcelamentos',
                'Dashboard completo',
                'Suporte prioritário',
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  {text}
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90"
              onClick={() => navigate('/register')}
            >
              Começar 7 dias grátis
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          💳 Cartão 💚 Pix 📄 Boleto — Pagamento 100% seguro • Cancele quando quiser
        </p>
      </div>
    </section>
  );
}
