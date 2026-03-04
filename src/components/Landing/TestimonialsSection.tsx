const testimonials = [
  { name: 'Maria S.', avatar: '👩', text: 'Finalmente consegui controlar meus gastos! O chat é incrível, registro tudo em segundos.' },
  { name: 'Pedro L.', avatar: '👨', text: 'Economizei R$ 400 no primeiro mês só vendo onde meu dinheiro ia. Recomendo demais!' },
  { name: 'Ana C.', avatar: '👩‍💼', text: 'Uso todo dia. As parcelas ficam organizadas e nunca mais esqueci de um pagamento.' },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-sm font-medium text-primary mb-2">Depoimentos</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Quem usa, aprova ❤️
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-gold">⭐</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.avatar}</span>
                <span className="font-medium text-sm">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
