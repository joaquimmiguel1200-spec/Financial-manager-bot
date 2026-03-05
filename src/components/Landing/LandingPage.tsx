import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ChatDemoSection } from './ChatDemoSection';
import { TestimonialsSection } from './TestimonialsSection';
import { PricingSection } from './PricingSection';
import { FAQSection } from './FAQSection';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl flex items-center gap-2">
            💰 <span>FinançasIA</span>
            <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">2.0</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/register')}
              className="bg-gradient-hero text-primary-foreground hover:opacity-90"
            >
              Começar
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ChatDemoSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />

      {/* Security badges */}
      <section className="py-12 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {['🔒 Criptografia SHA-256', '📱 PWA Play Store Ready', '⚡ Performance A+', '🛡️ Dados Protegidos', '🌐 Funciona Offline', '♿ Acessibilidade'].map((badge) => (
            <span key={badge} className="flex items-center gap-1">{badge}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-dark text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para controlar{' '}
            <span className="text-gradient-primary">suas finanças?</span> 🚀
          </h2>
          <p className="text-primary-foreground/70 mb-8">
            Junte-se a milhares de pessoas que já transformaram sua vida financeira com o FinançasIA.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-90 px-8 py-6 text-base"
          >
            Começar Agora — 7 dias grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border text-center text-xs text-muted-foreground space-y-2">
        <p>© 2026 FinançasIA 2.0 — Gestão Inteligente de Finanças Pessoais</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/terms" className="hover:text-primary transition-colors">Termos de Uso</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-primary transition-colors">Política de Privacidade</Link>
        </div>
      </footer>
    </div>
  );
}
