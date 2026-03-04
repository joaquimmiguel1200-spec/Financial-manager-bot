import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Posso testar antes de pagar?',
    a: 'Sim! O plano Pro inclui 7 dias grátis. Você pode cancelar a qualquer momento sem cobrança.',
  },
  {
    q: 'Como funciona o chat com IA?',
    a: 'Basta digitar seus gastos em linguagem natural, como "Comprei almoço por R$ 35 no Pix". A IA detecta automaticamente o valor, categoria e método de pagamento.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim, sem multa ou complicação. Após cancelar, seu plano volta para o Grátis.',
  },
  {
    q: 'Meus dados são seguros?',
    a: 'Sim! Usamos criptografia SHA-256, dados isolados por usuário, proteção contra XSS e rate limiting.',
  },
  {
    q: 'Funciona offline?',
    a: 'Sim! Como PWA, o app funciona offline após o primeiro carregamento. Seus dados ficam salvos localmente.',
  },
  {
    q: 'Posso exportar meus dados?',
    a: 'Usuários Pro podem exportar transações em CSV (compatível com Excel) e relatórios completos em TXT.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-sm font-medium text-primary mb-2">FAQ</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Perguntas Frequentes
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-border rounded-lg overflow-hidden bg-card transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-accent/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-muted-foreground animate-fade-up">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
