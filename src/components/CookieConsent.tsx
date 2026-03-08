import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { securityService } from '@/services/securityService';

const CONSENT_KEY = 'financasia_cookie_consent';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = async (analyticsVal: boolean, marketingVal: boolean) => {
    const sessionId = securityService.generateId();
    const consent = { analytics: analyticsVal, marketing: marketingVal, functional: true, timestamp: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    
    // Save to database (best effort)
    try {
      await supabase.from('cookie_consent').insert({
        session_id: sessionId,
        analytics: analyticsVal,
        marketing: marketingVal,
        functional: true,
      });
    } catch { /* silent */ }
    
    setShow(false);
  };

  const acceptAll = () => saveConsent(true, true);
  const acceptEssential = () => saveConsent(false, false);
  const savePreferences = () => saveConsent(analytics, marketing);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-up">
      <div className="max-w-lg mx-auto rounded-2xl bg-card border border-border shadow-lg p-5">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">🍪</span>
          <div>
            <h3 className="font-display font-bold text-sm">Cookies e Privacidade</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Usamos cookies para melhorar sua experiência. Cookies essenciais são necessários para o funcionamento do app.
            </p>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3 mb-4 p-3 rounded-lg bg-muted/50 animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">✅ Essenciais</p>
                <p className="text-[10px] text-muted-foreground">Autenticação e sessão (sempre ativo)</p>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">📊 Analíticos</p>
                <p className="text-[10px] text-muted-foreground">Melhorar performance e UX</p>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">📢 Marketing</p>
                <p className="text-[10px] text-muted-foreground">Conteúdo personalizado</p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!expanded ? (
            <>
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setExpanded(true)}>
                Personalizar
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={acceptEssential}>
                Apenas essenciais
              </Button>
              <Button size="sm" className="flex-1 text-xs bg-gradient-hero text-primary-foreground hover:opacity-90" onClick={acceptAll}>
                Aceitar todos
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={acceptEssential}>
                Apenas essenciais
              </Button>
              <Button size="sm" className="flex-1 text-xs bg-gradient-hero text-primary-foreground hover:opacity-90" onClick={savePreferences}>
                Salvar preferências
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
