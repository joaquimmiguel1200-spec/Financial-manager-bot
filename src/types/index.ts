export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'pix' | 'pix_parcelado' | 'credito' | 'debito' | 'dinheiro' | 'boleto';

export type PlanType = 'free' | 'pro_monthly' | 'pro_yearly';

export interface Installment {
  number: number;
  total: number;
  value: number;
  dueDate: string;
  paid: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  installments?: Installment[];
  parentId?: string;
  totalAmount?: number;
  isRecurring?: boolean;
  source?: 'manual' | 'chat';
  createdAt: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

export interface FixedEntry {
  id: string;
  description: string;
  amount: number;
  dayOfMonth: number;
  category?: string;
  paymentMethod?: PaymentMethod;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  fixedIncomes: FixedEntry[];
  fixedExpenses: FixedEntry[];
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
}

export interface Subscription {
  plan: PlanType;
  startDate: string;
  trialEnd?: string;
  isTrialActive: boolean;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  transaction?: Transaction;
}

export const CATEGORIES = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  expense: [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação',
    'Lazer', 'Roupas', 'Compras', 'Tecnologia', 'Assinaturas', 'Outros'
  ],
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: 'Pix',
  pix_parcelado: 'Pix Parc.',
  credito: 'Crédito',
  debito: 'Débito',
  dinheiro: 'Dinheiro',
  boleto: 'Boleto',
};

export const CATEGORY_ICONS: Record<string, string> = {
  'Alimentação': '🍔',
  'Transporte': '🚗',
  'Moradia': '🏠',
  'Saúde': '💊',
  'Educação': '📚',
  'Lazer': '🎮',
  'Roupas': '👕',
  'Compras': '🛍️',
  'Tecnologia': '💻',
  'Assinaturas': '📺',
  'Salário': '💼',
  'Freelance': '🎯',
  'Investimentos': '📈',
  'Outros': '📌',
};
