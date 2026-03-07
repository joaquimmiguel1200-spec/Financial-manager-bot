import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Transaction } from '@/types';

interface Props {
  transactions: Transaction[];
}

const PERIOD_OPTIONS = [
  { label: '1M', months: 1 },
  { label: '2M', months: 2 },
  { label: '3M', months: 3 },
  { label: '4M', months: 4 },
  { label: '5M', months: 5 },
  { label: '6M', months: 6 },
  { label: '1A', months: 12 },
];

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function MonthlyEvolutionChart({ transactions }: Props) {
  const [period, setPeriod] = useState(6);

  const data = useMemo(() => {
    const now = new Date();
    const result = [];

    for (let i = period - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();

      const monthTxs = transactions.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === month && td.getFullYear() === year;
      });

      const income = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      result.push({
        name: `${MONTH_NAMES[month]}/${String(year).slice(2)}`,
        Receitas: income,
        Despesas: expense,
        Saldo: income - expense,
      });
    }
    return result;
  }, [transactions, period]);

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm">📈 Evolução Mensal</h3>
        <div className="flex gap-1">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.months}
              onClick={() => setPeriod(opt.months)}
              className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                period === opt.months
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-52 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 90%)" strokeOpacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(160, 10%, 45%)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(160, 10%, 45%)' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }}
              formatter={(value: number, name: string) => [fmt(value), name]}
              labelStyle={{ fontWeight: 600, fontSize: '11px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Area type="monotone" dataKey="Receitas" stroke="hsl(160, 84%, 39%)" fill="url(#gradIncome)" strokeWidth={2} dot={{ r: 3 }} />
            <Area type="monotone" dataKey="Despesas" stroke="hsl(0, 72%, 51%)" fill="url(#gradExpense)" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {(() => {
          const totalInc = data.reduce((s, d) => s + d.Receitas, 0);
          const totalExp = data.reduce((s, d) => s + d.Despesas, 0);
          const totalBal = totalInc - totalExp;
          return (
            <>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground">Receitas</p>
                <p className="text-xs font-bold text-primary">{fmt(totalInc)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground">Despesas</p>
                <p className="text-xs font-bold text-destructive">{fmt(totalExp)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground">Saldo</p>
                <p className={`text-xs font-bold ${totalBal >= 0 ? 'text-primary' : 'text-destructive'}`}>{fmt(totalBal)}</p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
