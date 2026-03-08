import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DbTransaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  payment_method: string | null;
  source: string | null;
  is_recurring: boolean | null;
  parent_id: string | null;
  installment_number: number | null;
  installment_total: number | null;
  created_at: string;
}

export interface DbGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
}

export interface DbFixedEntry {
  id: string;
  user_id: string;
  type: string;
  description: string;
  amount: number;
  day_of_month: number;
  category: string | null;
  payment_method: string | null;
  created_at: string;
}

export function useSupabaseFinancialData() {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [transactions, setTransactions] = useState<DbTransaction[]>([]);
  const [goals, setGoals] = useState<DbGoal[]>([]);
  const [fixedEntries, setFixedEntries] = useState<DbFixedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    if (!userId) return;
    
    const fetchAll = async () => {
      setLoading(true);
      const [txRes, goalsRes, fixedRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('fixed_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ]);
      
      if (txRes.data) setTransactions(txRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (fixedRes.data) setFixedEntries(fixedRes.data);
      setLoading(false);
    };

    fetchAll();
  }, [userId]);

  // Auto-apply fixed entries for current month
  useEffect(() => {
    if (!userId || fixedEntries.length === 0) return;
    
    const applyRecurring = async () => {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      // Check if already applied
      const { data: existing } = await supabase
        .from('recurring_log')
        .select('id')
        .eq('user_id', userId)
        .eq('year_month', yearMonth)
        .maybeSingle();
      
      if (existing) return;
      
      // Apply fixed entries as transactions
      const newTxs = fixedEntries.map(entry => ({
        user_id: userId,
        type: entry.type,
        amount: entry.amount,
        category: entry.category || 'Outros',
        description: `[Recorrente] ${entry.description}`,
        date: new Date(now.getFullYear(), now.getMonth(), Math.min(entry.day_of_month, new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate())).toISOString(),
        payment_method: entry.payment_method || 'pix',
        source: 'recurring' as string,
        is_recurring: true,
      }));

      if (newTxs.length > 0) {
        const { data: inserted, error } = await supabase.from('transactions').insert(newTxs).select();
        if (!error && inserted) {
          setTransactions(prev => [...inserted, ...prev]);
          await supabase.from('recurring_log').insert({ user_id: userId, year_month: yearMonth });
          toast.success(`${newTxs.length} transações recorrentes aplicadas para ${yearMonth}!`);
        }
      }
    };

    applyRecurring();
  }, [userId, fixedEntries]);

  // Transaction CRUD
  const addTransaction = useCallback(async (tx: Omit<DbTransaction, 'id' | 'user_id' | 'created_at'>) => {
    const { data, error } = await supabase.from('transactions').insert({ ...tx, user_id: userId }).select().single();
    if (error) { toast.error('Erro ao adicionar transação'); return null; }
    setTransactions(prev => [data, ...prev]);
    return data;
  }, [userId]);

  const addTransactions = useCallback(async (txs: Array<Omit<DbTransaction, 'id' | 'user_id' | 'created_at'>>) => {
    const rows = txs.map(tx => ({ ...tx, user_id: userId }));
    const { data, error } = await supabase.from('transactions').insert(rows).select();
    if (error) { toast.error('Erro ao adicionar transações'); return; }
    if (data) setTransactions(prev => [...data, ...prev]);
  }, [userId]);

  const deleteTransaction = useCallback(async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id).eq('user_id', userId);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [userId]);

  // Goal CRUD
  const addGoal = useCallback(async (goal: { name: string; target_amount: number; current_amount: number; deadline: string }) => {
    const { data, error } = await supabase.from('goals').insert({ ...goal, user_id: userId }).select().single();
    if (error) { toast.error('Erro ao criar meta'); return; }
    setGoals(prev => [data, ...prev]);
  }, [userId]);

  const updateGoal = useCallback(async (id: string, updates: Partial<DbGoal>) => {
    const { error } = await supabase.from('goals').update(updates).eq('id', id).eq('user_id', userId);
    if (!error) setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, [userId]);

  const deleteGoal = useCallback(async (id: string) => {
    await supabase.from('goals').delete().eq('id', id).eq('user_id', userId);
    setGoals(prev => prev.filter(g => g.id !== id));
  }, [userId]);

  // Fixed Entry CRUD
  const addFixedEntry = useCallback(async (entry: { type: string; description: string; amount: number; day_of_month: number; category?: string; payment_method?: string }) => {
    const { data, error } = await supabase.from('fixed_entries').insert({ ...entry, user_id: userId }).select().single();
    if (error) { toast.error('Erro ao adicionar entrada fixa'); return; }
    setFixedEntries(prev => [data, ...prev]);
  }, [userId]);

  const deleteFixedEntry = useCallback(async (id: string) => {
    await supabase.from('fixed_entries').delete().eq('id', id).eq('user_id', userId);
    setFixedEntries(prev => prev.filter(e => e.id !== id));
  }, [userId]);

  // Summary calculations
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const expensesByCategory = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  return {
    transactions, monthTransactions, goals, fixedEntries, loading,
    totalIncome, totalExpense, balance, expensesByCategory,
    addTransaction, addTransactions, deleteTransaction,
    addGoal, updateGoal, deleteGoal,
    addFixedEntry, deleteFixedEntry,
  };
}
