import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useFinancialData } from '@/hooks/useFinancialData';
import { chatAIService } from '@/services/chatAIService';
import { subscriptionService } from '@/services/subscriptionService';
import type { Transaction, ChatMessage } from '@/types';
import { CATEGORY_ICONS, PAYMENT_METHOD_LABELS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  LayoutDashboard, MessageCircle, Target, User, LogOut, Plus, Trash2, Send, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { securityService } from '@/services/securityService';

type AppTab = 'dashboard' | 'transactions' | 'chat' | 'goals' | 'profile';

export default function AppPage() {
  const navigate = useNavigate();
  const session = authService.getSession();
  const [tab, setTab] = useState<AppTab>('dashboard');

  useEffect(() => {
    if (!session) navigate('/login');
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-hero px-4 py-3 flex items-center justify-between">
        <span className="font-display font-bold text-primary-foreground">💰 FinançasIA 2.0</span>
        <button
          onClick={() => { authService.logout(); navigate('/'); }}
          className="text-primary-foreground/80 hover:text-primary-foreground"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-20">
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'transactions' && <TransactionsTab />}
        {tab === 'chat' && <ChatTab userId={session.id} />}
        {tab === 'goals' && <GoalsTab />}
        {tab === 'profile' && <ProfileTab />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 z-50">
        {([
          { id: 'dashboard' as AppTab, icon: LayoutDashboard, label: '📊' },
          { id: 'transactions' as AppTab, icon: ArrowDownCircle, label: '💸' },
          { id: 'chat' as AppTab, icon: MessageCircle, label: '💬' },
          { id: 'goals' as AppTab, icon: Target, label: '🎯' },
          { id: 'profile' as AppTab, icon: User, label: '👤' },
        ]).map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
              tab === item.id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <span className="text-lg">{item.label}</span>
            <span className="text-[10px] mt-0.5 capitalize">{item.id === 'transactions' ? 'Extrato' : item.id === 'chat' ? 'Chat' : item.id === 'goals' ? 'Metas' : item.id === 'profile' ? 'Perfil' : 'Home'}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function DashboardTab() {
  const { totalIncome, totalExpense, balance, expensesByCategory, monthTransactions } = useFinancialData();
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const sortedCategories = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = sortedCategories[0]?.[1] || 1;

  return (
    <div className="p-4 space-y-4">
      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-hero p-5 text-center">
        <p className="text-primary-foreground/70 text-sm">Saldo do Mês</p>
        <p className={`text-3xl font-bold font-display ${balance >= 0 ? 'text-primary-foreground' : 'text-destructive-foreground'}`}>
          {fmt(balance)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-light p-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <ArrowUpCircle className="w-3 h-3" /> Receitas
          </div>
          <p className="font-bold text-primary text-lg">{fmt(totalIncome)}</p>
        </div>
        <div className="rounded-xl bg-destructive/10 p-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <ArrowDownCircle className="w-3 h-3" /> Despesas
          </div>
          <p className="font-bold text-destructive text-lg">{fmt(totalExpense)}</p>
        </div>
      </div>

      {/* Categories */}
      {sortedCategories.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-4">
          <h3 className="font-display font-semibold mb-3 text-sm">Gastos por Categoria</h3>
          <div className="space-y-2">
            {sortedCategories.slice(0, 5).map(([cat, val]) => (
              <div key={cat} className="flex items-center gap-2">
                <span className="text-lg w-6">{CATEGORY_ICONS[cat] || '📌'}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{cat}</span>
                    <span className="text-muted-foreground">{fmt(val)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-hero rounded-full transition-all" style={{ width: `${(val / maxCat) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="rounded-xl bg-card border border-border p-4">
        <h3 className="font-display font-semibold mb-3 text-sm">Últimas Transações</h3>
        {monthTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma transação ainda</p>
        ) : (
          <div className="space-y-2">
            {monthTransactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[tx.category] || '📌'}</span>
                  <div>
                    <p className="font-medium text-xs">{tx.description}</p>
                    <p className="text-[10px] text-muted-foreground">{PAYMENT_METHOD_LABELS[tx.paymentMethod]}</p>
                  </div>
                </div>
                <span className={`font-medium text-xs ${tx.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionsTab() {
  const { transactions, addTransaction, deleteTransaction } = useFinancialData();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Outros');
  const [description, setDescription] = useState('');
  const [method, setMethod] = useState<Transaction['paymentMethod']>('pix');
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleAdd = () => {
    const val = parseFloat(amount.replace(',', '.'));
    if (!val || !description) { toast.error('Preencha todos os campos'); return; }
    if (!subscriptionService.canAddTransaction(transactions.length)) { toast.error('Limite de transações atingido. Faça upgrade para Pro!'); return; }
    addTransaction({ type, amount: val, category, description, date: new Date().toISOString(), paymentMethod: method, source: 'manual' });
    toast.success('Transação adicionada!');
    setAmount(''); setDescription(''); setShowForm(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-lg">Extrato</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-1" /> Nova
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl bg-card border border-border p-4 space-y-3 animate-scale-in">
          <div className="flex gap-2">
            <button onClick={() => setType('expense')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'expense' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>Despesa</button>
            <button onClick={() => setType('income')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'income' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>Receita</button>
          </div>
          <Input placeholder="Valor" value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" />
          <Input placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {(type === 'income' ? ['Salário','Freelance','Investimentos','Outros'] : ['Alimentação','Transporte','Moradia','Saúde','Educação','Lazer','Roupas','Compras','Tecnologia','Assinaturas','Outros']).map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={method} onChange={e => setMethod(e.target.value as Transaction['paymentMethod'])} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="pix">Pix</option>
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="boleto">Boleto</option>
          </select>
          <Button onClick={handleAdd} className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90">Adicionar</Button>
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">Nenhuma transação ainda</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between rounded-xl bg-card border border-border p-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{CATEGORY_ICONS[tx.category] || '📌'}</span>
                <div>
                  <p className="font-medium text-sm">{tx.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{PAYMENT_METHOD_LABELS[tx.paymentMethod]}</span>
                    {tx.installments?.[0] && <span>• {tx.installments[0].number}/{tx.installments[0].total}</span>}
                    {tx.source === 'chat' && <span>• 💬 Chat</span>}
                    <span>• {new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </span>
                <button onClick={() => deleteTransaction(tx.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatTab({ userId }: { userId: string }) {
  const { addTransactions } = useFinancialData();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: '👋 Olá! Sou a IA do FinançasIA 2.0!\n\nMe diga seus gastos e eu registro automaticamente.\n\n💬 "Comprei um tênis de R$ 400 no cartão em 4x"\n💬 "Paguei R$ 85 de pix no mercado"', timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: securityService.generateId(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);

    const parsed = chatAIService.parseMessage(input);
    const response = chatAIService.generateResponse(parsed, input);

    if (parsed) {
      const txs = chatAIService.createTransactions(parsed, userId);
      addTransactions(txs);
    }

    const aiMsg: ChatMessage = { id: securityService.generateId(), role: 'assistant', content: response, timestamp: new Date().toISOString() };
    setTimeout(() => setMessages(prev => [...prev, aiMsg]), 300);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
              msg.role === 'user'
                ? 'rounded-br-md bg-primary/10'
                : 'rounded-bl-md bg-accent'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Diga o que comprou..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function GoalsTab() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinancialData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleAdd = () => {
    const val = parseFloat(target.replace(',', '.'));
    if (!name || !val || !deadline) { toast.error('Preencha todos os campos'); return; }
    if (!subscriptionService.canAddGoal(goals.length)) { toast.error('Limite de metas atingido. Faça upgrade para Pro!'); return; }
    addGoal({ name, targetAmount: val, currentAmount: 0, deadline });
    setName(''); setTarget(''); setDeadline(''); setShowForm(false);
    toast.success('Meta criada!');
  };

  const addToGoal = (id: string) => {
    const val = prompt('Quanto deseja adicionar? (R$)');
    if (!val) return;
    const amount = parseFloat(val.replace(',', '.'));
    if (!amount) return;
    const goal = goals.find(g => g.id === id);
    if (goal) updateGoal(id, { currentAmount: goal.currentAmount + amount });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-lg">Metas Financeiras</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-1" /> Nova
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl bg-card border border-border p-4 space-y-3 animate-scale-in">
          <Input placeholder="Nome da meta" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Valor objetivo (R$)" value={target} onChange={e => setTarget(e.target.value)} type="number" step="0.01" />
          <Input placeholder="Prazo" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          <Button onClick={handleAdd} className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90">Criar Meta</Button>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-sm">Nenhuma meta definida</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
            const daysLeft = Math.max(0, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            return (
              <div key={g.id} className="rounded-xl bg-card border border-border p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{g.name}</h3>
                  <button onClick={() => deleteGoal(g.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>{fmt(g.currentAmount)} / {fmt(g.targetAmount)}</span>
                  <span>{daysLeft} dias restantes</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-hero rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-primary">{pct.toFixed(0)}%</span>
                  <Button size="sm" variant="outline" onClick={() => addToGoal(g.id)} className="text-xs h-7">
                    <Plus className="w-3 h-3 mr-1" /> Adicionar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProfileTab() {
  const session = authService.getSession();
  const sub = subscriptionService.getSubscription();

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-xl bg-card border border-border p-5 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center text-2xl mx-auto mb-3">
          👤
        </div>
        <h3 className="font-display font-bold text-lg">{session?.name}</h3>
        <p className="text-sm text-muted-foreground">{session?.email}</p>
        <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {sub ? subscriptionService.getPlanLabel(sub.plan) : 'Grátis'}
          {subscriptionService.isTrialActive() && ` (${subscriptionService.getTrialDaysRemaining()} dias trial)`}
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-4 space-y-3">
        <h3 className="font-display font-semibold text-sm">Plano Atual</h3>
        {subscriptionService.isPro() ? (
          <div className="space-y-2">
            <p className="text-xs text-primary">✅ Acesso Pro ativo</p>
            <p className="text-xs text-muted-foreground">Transações, chat e metas ilimitadas</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Limite: 30 transações/mês, 5 chats/dia, 1 meta</p>
            <Button
              size="sm"
              className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90"
              onClick={() => { subscriptionService.subscribe('pro_monthly'); toast.success('Plano Pro ativado! 7 dias grátis.'); }}
            >
              Fazer Upgrade para Pro
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-card border border-border p-4">
        <h3 className="font-display font-semibold text-sm mb-3">🔒 Segurança</h3>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li>✅ Criptografia SHA-256</li>
          <li>✅ Dados isolados por usuário</li>
          <li>✅ Proteção contra XSS</li>
          <li>✅ Rate limiting de login</li>
        </ul>
      </div>
    </div>
  );
}
