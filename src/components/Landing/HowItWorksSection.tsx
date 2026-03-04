const steps = [
  { icon: '📱', step: 1, title: 'Baixe e cadastre', desc: 'Instale o app em 1 clique. Crie sua conta em 30 segundos.' },
  { icon: '💬', step: 2, title: 'Converse com a IA', desc: 'Diga o que comprou, quanto pagou e como pagou. A IA faz o resto!' },
  { icon: '📊', step: 3, title: 'Acompanhe tudo', desc: 'Veja dashboards, metas, parcelas e exporte relatórios profissionais.' },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-sm font-medium text-primary mb-2">Como Funciona</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Simples assim ✨
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-4">
                {s.icon}
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-3">
                {s.step}
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
