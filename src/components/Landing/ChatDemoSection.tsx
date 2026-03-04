export function ChatDemoSection() {
  return (
    <section className="py-20 px-4 bg-accent/30">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-sm font-medium text-primary mb-2">Chat IA</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Registre gastos{' '}
          <span className="text-gradient-primary">conversando</span>
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
          Esqueça formulários chatos. Basta dizer o que comprou em linguagem natural e a IA registra automaticamente.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Examples */}
          <div className="space-y-4">
            {[
              { label: 'Cartão Parcelado', msg: '"Comprei um sofá de R$ 3000 no cartão em 10x"' },
              { label: 'Pix Instantâneo', msg: '"Paguei R$ 45 de pix no almoço"' },
              { label: 'Pix Parcelado', msg: '"TV de R$ 2000 no pix parcelado em 5x"' },
            ].map((ex, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-card border border-border p-4">
                <span className="text-primary text-lg mt-0.5">✅</span>
                <div>
                  <p className="text-xs font-medium text-primary mb-1">{ex.label}</p>
                  <p className="text-sm text-muted-foreground">{ex.msg}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat mockup */}
          <div className="rounded-2xl bg-card border border-border shadow-md overflow-hidden max-w-sm mx-auto w-full">
            <div className="bg-gradient-hero px-5 py-3 flex items-center gap-3">
              <span className="text-xl">🤖</span>
              <div>
                <p className="text-primary-foreground font-display font-semibold text-sm">FinançasIA Chat</p>
                <p className="text-primary-foreground/70 text-xs">Online agora</p>
              </div>
            </div>
            <div className="p-4 space-y-3 min-h-[300px]">
              {/* User message */}
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-br-md bg-primary/10 px-4 py-2 text-sm max-w-[80%]">
                  Comprei um notebook de R$ 4000 no cartão em 10x
                </div>
              </div>
              {/* AI response */}
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-accent px-4 py-3 text-sm max-w-[85%] space-y-1">
                  <p className="font-medium text-primary">✅ Gasto registrado!</p>
                  <p className="text-muted-foreground text-xs">📝 Notebook</p>
                  <p className="text-muted-foreground text-xs">💰 Total: R$ 4.000,00</p>
                  <p className="text-muted-foreground text-xs">💳 Crédito: 10x de R$ 400,00</p>
                  <p className="text-muted-foreground text-xs">🏷️ Compras</p>
                  <p className="text-muted-foreground text-xs">📅 Parcelas adicionadas nas próximas faturas</p>
                </div>
              </div>
              {/* User message 2 */}
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-br-md bg-primary/10 px-4 py-2 text-sm max-w-[80%]">
                  Paguei 85 reais de pix no mercado
                </div>
              </div>
              {/* AI response 2 */}
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-accent px-4 py-2 text-sm">
                  <p className="font-medium text-primary">✅ Registrado!</p>
                  <p className="text-muted-foreground text-xs">💚 Pix • R$ 85,00 • Alimentação</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border px-4 py-3">
              <div className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                Diga o que comprou...
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
