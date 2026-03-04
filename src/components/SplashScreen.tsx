import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'fade'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 600);
    const t2 = setTimeout(() => setPhase('fade'), 1800);
    const t3 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-hero transition-opacity duration-500 ${
        phase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div
        className={`text-6xl transition-all duration-700 ${
          phase === 'logo' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{ animationDelay: '0.1s' }}
      >
        💰
      </div>

      {/* App name */}
      <h1
        className={`font-display font-bold text-3xl text-primary-foreground mt-4 transition-all duration-500 ${
          phase === 'logo' ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        FinançasIA
      </h1>

      {/* Version badge */}
      <div
        className={`mt-2 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium transition-all duration-500 delay-200 ${
          phase === 'logo' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        2.0
      </div>

      {/* Subtitle */}
      <p
        className={`mt-6 text-primary-foreground/70 text-sm transition-all duration-500 delay-300 ${
          phase === 'logo' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Gestão Inteligente de Finanças
      </p>

      {/* Loading dots */}
      <div className="flex gap-1.5 mt-8">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-foreground/50 animate-pulse-slow"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}
