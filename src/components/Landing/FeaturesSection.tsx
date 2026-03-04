const features = [
  { icon: '🤖', title: 'IA Financeira', desc: 'Chat inteligente que registra seus gastos automaticamente por conversa natural' },
  { icon: '💳', title: 'Todos os Pagamentos', desc: 'Pix, Cartão de Crédito, Débito, Boleto e Dinheiro — tudo em um só lugar' },
  { icon: '📊', title: 'Parcelas Inteligentes', desc: 'Controle parcelamentos no cartão e Pix parcelado com datas automáticas' },
  { icon: '🎯', title: 'Metas Financeiras', desc: 'Defina objetivos e acompanhe seu progresso em tempo real' },
  { icon: '📥', title: 'Relatórios & Planilhas', desc: 'Exporte CSV para Excel e relatórios completos com um toque' },
  { icon: '🔒', title: 'Segurança Total', desc: 'Criptografia SHA-256, dados isolados e proteção contra invasões' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-accent/30">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-medium text-primary mb-2">Funcionalidades</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Tudo que você precisa para{' '}
          <span className="text-gradient-primary">organizar seu dinheiro</span>
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
          De chat inteligente a relatórios profissionais — todas as ferramentas em um app leve e rápido.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl bg-card border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
