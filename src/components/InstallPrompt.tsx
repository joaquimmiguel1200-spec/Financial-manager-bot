import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'financasia_install_dismissed';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if dismissed recently (7 days)
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // iOS detection
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-[90] animate-fade-up">
      <div className="max-w-md mx-auto rounded-2xl bg-card border border-border shadow-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-xl shrink-0">
          💰
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-sm">Instalar FinançasIA</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {isIOS
              ? 'Toque em Compartilhar → "Adicionar à Tela de Início"'
              : 'Instale o app para acesso rápido e offline'}
          </p>
        </div>
        {!isIOS && deferredPrompt && (
          <Button size="sm" onClick={handleInstall} className="bg-gradient-hero text-primary-foreground hover:opacity-90 shrink-0">
            <Download className="w-3 h-3 mr-1" /> Instalar
          </Button>
        )}
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
