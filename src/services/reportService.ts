import type { Transaction, FinancialGoal } from '@/types';
import { PAYMENT_METHOD_LABELS } from '@/types';
import { authService } from './authService';

export const reportService = {
  exportCSV(transactions: Transaction[]): void {
    const BOM = '\uFEFF';
    const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Método', 'Parcela', 'Origem'];
    const rows = transactions.map(tx => [
      new Date(tx.date).toLocaleDateString('pt-BR'),
      tx.type === 'income' ? 'Receita' : 'Despesa',
      tx.category,
      tx.description,
      tx.amount.toFixed(2).replace('.', ','),
      PAYMENT_METHOD_LABELS[tx.paymentMethod],
      tx.installments?.[0] ? `${tx.installments[0].number}/${tx.installments[0].total}` : '-',
      tx.source === 'chat' ? 'Chat IA' : 'Manual',
    ]);

    const csv = BOM + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financasia_transacoes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportReport(transactions: Transaction[], goals: FinancialGoal[]): void {
    const user = authService.getCurrentUser();
    const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const now = new Date();

    const income = transactions.filter(t => t.type === 'income');
    const expense = transactions.filter(t => t.type === 'expense');
    const totalIncome = income.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expense.reduce((s, t) => s + t.amount, 0);

    const byCategory = expense.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const byMethod = expense.reduce<Record<string, number>>((acc, t) => {
      const label = PAYMENT_METHOD_LABELS[t.paymentMethod];
      acc[label] = (acc[label] || 0) + t.amount;
      return acc;
    }, {});

    let report = '';
    report += '═══════════════════════════════════════════\n';
    report += '        RELATÓRIO FINANCEIRO - FinançasIA 2.0\n';
    report += '═══════════════════════════════════════════\n\n';
    report += `Usuário: ${user?.name || 'N/A'}\n`;
    report += `Email: ${user?.email || 'N/A'}\n`;
    report += `Data do relatório: ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}\n`;
    report += `Total de transações: ${transactions.length}\n\n`;

    report += '── RESUMO GERAL ──────────────────────────\n';
    report += `  Receitas:  ${fmt(totalIncome)}\n`;
    report += `  Despesas:  ${fmt(totalExpense)}\n`;
    report += `  Saldo:     ${fmt(totalIncome - totalExpense)}\n\n`;

    // Fixed incomes/expenses
    if (user?.fixedIncomes?.length) {
      report += '── RECEITAS FIXAS ────────────────────────\n';
      user.fixedIncomes.forEach(fi => {
        report += `  ${fi.description}: ${fmt(fi.amount)} (dia ${fi.dayOfMonth})\n`;
      });
      report += '\n';
    }
    if (user?.fixedExpenses?.length) {
      report += '── DESPESAS FIXAS ────────────────────────\n';
      user.fixedExpenses.forEach(fe => {
        report += `  ${fe.description}: ${fmt(fe.amount)} (dia ${fe.dayOfMonth})\n`;
      });
      report += '\n';
    }

    report += '── DESPESAS POR CATEGORIA ────────────────\n';
    Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, val]) => {
      const pct = ((val / totalExpense) * 100).toFixed(1);
      report += `  ${cat}: ${fmt(val)} (${pct}%)\n`;
    });
    report += '\n';

    report += '── DESPESAS POR MÉTODO ───────────────────\n';
    Object.entries(byMethod).sort((a, b) => b[1] - a[1]).forEach(([method, val]) => {
      report += `  ${method}: ${fmt(val)}\n`;
    });
    report += '\n';

    if (goals.length > 0) {
      report += '── METAS FINANCEIRAS ────────────────────\n';
      goals.forEach(g => {
        const pct = ((g.currentAmount / g.targetAmount) * 100).toFixed(1);
        report += `  ${g.name}: ${fmt(g.currentAmount)} / ${fmt(g.targetAmount)} (${pct}%)\n`;
      });
      report += '\n';
    }

    report += '── TRANSAÇÕES DETALHADAS ─────────────────\n';
    transactions.forEach(tx => {
      const type = tx.type === 'income' ? '+' : '-';
      const date = new Date(tx.date).toLocaleDateString('pt-BR');
      const inst = tx.installments?.[0] ? ` [${tx.installments[0].number}/${tx.installments[0].total}]` : '';
      report += `  ${date} | ${type}${fmt(tx.amount)} | ${tx.category} | ${tx.description}${inst}\n`;
    });

    report += '\n═══════════════════════════════════════════\n';
    report += '  Gerado por FinançasIA 2.0\n';
    report += '═══════════════════════════════════════════\n';

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financasia_relatorio_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
