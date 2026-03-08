import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event from the auth redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    // Also check hash for recovery token
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (password !== confirm) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error('Erro ao redefinir senha. Tente novamente.');
    } else {
      toast.success('Senha redefinida com sucesso!');
      navigate('/app');
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="text-4xl">🔐</div>
          <h2 className="font-display font-bold text-xl">Redefinir senha</h2>
          <p className="text-sm text-muted-foreground">
            Aguardando verificação... Se você chegou aqui por um link de email, aguarde um momento.
          </p>
          <Link to="/forgot-password">
            <Button variant="outline" className="mt-4">Solicitar novo link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">💰</span>
          <span className="font-display font-bold text-2xl">FinançasIA</span>
        </Link>

        <div className="rounded-2xl bg-card border border-border p-6">
          <h2 className="font-display font-bold text-xl mb-1">Nova senha</h2>
          <p className="text-sm text-muted-foreground mb-6">Defina sua nova senha</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Mín. 6 caracteres"
              />
            </div>
            <div>
              <Label htmlFor="confirm">Confirmar senha</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repita a senha"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
