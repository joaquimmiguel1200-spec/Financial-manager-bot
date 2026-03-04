import { useState, useCallback, useEffect } from 'react';
import type { Transaction, FinancialGoal } from '@/types';
import { authService } from '@/services/authService';
import { securityService } from '@/services/securityService';

export function useFinancialData() {
  const session = authService.getSession();
  const userId = session?.id || '';

  const txKey = `financasia_transactions_${userId}`;
  const goalsKey = `financasia_goals_${userId}`;

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try { return JSON.parse(localStorage.getItem(txKey) || '[]'); } catch { return []; }
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    try { return JSON.parse(localStorage.getItem(goalsKey) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    if (userId) localStorage.setItem(txKey, JSON.stringify(transactions));
  }, [transactions, txKey, userId]);

  useEffect(() => {
    if (userId) localStorage.setItem(goalsKey, JSON.stringify(goals));
  }, [goals, goalsKey, userId]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: securityService.generateId(),
      userId,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  }, [userId]);

  const addTransactions = useCallback((txs: Transaction[]) => {
    setTransactions(prev => [...txs, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id && t.parentId !== id));
  }, []);

  const addGoal = useCallback((goal: Omit<FinancialGoal, 'id' | 'userId' | 'createdAt'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: securityService.generateId(),
      userId,
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  }, [userId]);

  const updateGoal = useCallback((id: string, updates: Partial<FinancialGoal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  // Summary
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expensesByCategory = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  return {
    transactions, monthTransactions, goals,
    totalIncome, totalExpense, balance, expensesByCategory,
    addTransaction, addTransactions, deleteTransaction,
    addGoal, updateGoal, deleteGoal,
  };
}
