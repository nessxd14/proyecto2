"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Plus,
  Search,
  CreditCard,
  Briefcase,
  TrendingUp
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
};

const CATEGORIES = {
  income: ["Ventas Mostrador", "Ventas Mayoristas", "Otros Ingresos"],
  expense: ["Pago a Proveedores", "Planilla Salarios", "Alquiler", "Servicios", "Otros Gastos"]
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Form states
  const [txType, setTxType] = useState<"income" | "expense">("income");
  const [txAmount, setTxAmount] = useState("");
  const [txDesc, setTxDesc] = useState("");
  const [txCat, setTxCat] = useState(CATEGORIES.income[0]);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("finance_mvp_data");
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved data");
      }
    } else {
      // Seed initial data spread across a few days for the chart
      const now = Date.now();
      const seed: Transaction[] = [
        { id: "1", type: "income", amount: 1250.50, description: "Ventas del día", category: "Ventas Mostrador", date: new Date(now).toISOString() },
        { id: "2", type: "expense", amount: 450.00, description: "Compra de resmas", category: "Pago a Proveedores", date: new Date(now - 86400000).toISOString() },
        { id: "3", type: "income", amount: 3200.00, description: "Venta a Colegio", category: "Ventas Mayoristas", date: new Date(now - 172800000).toISOString() },
        { id: "4", type: "income", amount: 850.00, description: "Ventas mostrador", category: "Ventas Mostrador", date: new Date(now - 345600000).toISOString() },
        { id: "5", type: "expense", amount: 1200.00, description: "Pago servicios", category: "Servicios", date: new Date(now - 432000000).toISOString() },
      ];
      setTransactions(seed);
      localStorage.setItem("finance_mvp_data", JSON.stringify(seed));
    }
  }, []);

  // Save on change
  useEffect(() => {
    if (isClient && transactions.length > 0) {
      localStorage.setItem("finance_mvp_data", JSON.stringify(transactions));
    }
  }, [transactions, isClient]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txDesc) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: txType,
      amount: parseFloat(txAmount),
      description: txDesc,
      category: txCat,
      date: new Date().toISOString()
    };

    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);
    setTxAmount("");
    setTxDesc("");
  };

  useEffect(() => {
    setTxCat(CATEGORIES[txType][0]);
  }, [txType]);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  // Prepare chart data (Group by date)
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Create a map of dates to net balance change for that day
    const dailyBalance: Record<string, number> = {};

    transactions.forEach(t => {
      const dateStr = new Date(t.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      if (!dailyBalance[dateStr]) dailyBalance[dateStr] = 0;
      dailyBalance[dateStr] += t.type === 'income' ? t.amount : -t.amount;
    });

    // Convert to array and sort (very basic sort for demo purposes)
    return Object.entries(dailyBalance).map(([date, _amount]) => ({
      name: date,
      Balance: _amount > 0 ? _amount : 0, // Simplified for visual 'trend' of positive cashflow
      Gastos: _amount < 0 ? Math.abs(_amount) : 0
    })).reverse(); // Reverse to show chronological order simply
  }, [transactions]);

  if (!isClient) return null;

  return (
    <div className="container min-h-screen py-8 animate-fade-in md:px-8">
      <header className="flex-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Resumen Financiero</h2>
          <p className="text-sm text-secondary flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400" />
            Viendo rendimiento filtrado por: <span className="text-text-primary px-2 py-0.5 bg-white/5 rounded-md">Últimos 30 días</span>
          </p>
        </div>
        <button className="btn btn-primary shadow-lg shadow-indigo-500/20" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nueva Transacción
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)]">
              <Wallet size={24} className="text-indigo-400" />
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
              +12.5% vs Mes ant.
            </span>
          </div>
          <div>
            <p className="text-secondary font-medium mb-1">Saldo de Caja Actual</p>
            <h3 className="text-4xl font-bold tracking-tight text-text-primary">
              ${currentBalance.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Income Card */}
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)]">
              <ArrowUpRight size={24} className="text-emerald-500" />
            </div>
          </div>
          <div>
            <p className="text-secondary font-medium mb-1">Ingresos de Operación</p>
            <h3 className="text-3xl font-bold tracking-tight text-emerald-50 text-shadow-sm">
              ${totalIncome.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Expense Card */}
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)]">
              <ArrowDownRight size={24} className="text-red-500" />
            </div>
          </div>
          <div>
            <p className="text-secondary font-medium mb-1">Rotación / Egresos</p>
            <h3 className="text-3xl font-bold tracking-tight text-red-50 text-shadow-sm">
              ${totalExpense.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col">
          <div className="mb-6 flex-between">
            <div>
              <h3 className="text-lg font-bold">Flujo Acumulado</h3>
              <p className="text-xs text-secondary">Comparativa de ingresos vs egresos por día</p>
            </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15,17,21,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="Balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                <Area type="monotone" dataKey="Gastos" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorGastos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List (Mini) */}
        <div className="glass-panel p-6 flex flex-col">
          <div className="flex-between mb-6">
            <h3 className="text-lg font-bold">Últimos Movimientos</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Ver Todo</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === "income" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {tx.type === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary line-clamp-1">{tx.description}</p>
                    <p className="text-xs text-secondary">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === "income" ? "text-emerald-400" : "text-text-primary"}`}>
                    {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-center text-sm text-secondary py-4">Sin datos recientes</p>}
          </div>
        </div>
      </div>

      {/* Full Transactions Table */}
      <div className="glass-panel p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="flex-between mb-6">
          <h3 className="text-lg font-bold">Registro Detallado General</h3>
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
            <input type="text" placeholder="Buscar transacción..." className="input-base pl-10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)] text-secondary text-sm">
                <th className="py-4 font-medium pl-4">Fecha</th>
                <th className="py-4 font-medium">Concepto</th>
                <th className="py-4 font-medium">Tipo</th>
                <th className="py-4 text-right font-medium pr-4">Importe</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-secondary">No hay transacciones registradas.</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.03)] transition-colors group">
                    <td className="py-4 text-sm text-secondary pl-4">
                      {new Date(tx.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-4 font-medium">
                      <span className="group-hover:text-indigo-300 transition-colors">{tx.description}</span>
                    </td>
                    <td className="py-4 text-sm text-secondary">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-xs">
                        {tx.category.includes("Proveedor") || tx.category.includes("Planilla") ? <Briefcase size={10} /> : <CreditCard size={10} />}
                        {tx.category}
                      </span>
                    </td>
                    <td className={`py-4 text-right font-bold pr-4 ${tx.type === "income" ? "text-emerald-400" : "text-text-primary"}`}>
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standard Modal Base */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-panel relative z-10 w-full max-w-md p-8 animate-fade-in shadow-2xl border-indigo-500/20">
            <h3 className="text-2xl font-bold mb-6 tracking-tight">Nuevo Registro</h3>

            <form onSubmit={handleAddTransaction} className="flex flex-col gap-6">
              {/* Type selector */}
              <div className="flex p-1 bg-black/40 w-full rounded-lg border border-[rgba(255,255,255,0.05)]">
                <button
                  type="button"
                  onClick={() => setTxType("income")}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${txType === "income" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-secondary hover:text-white"}`}
                >Ingreso</button>
                <button
                  type="button"
                  onClick={() => setTxType("expense")}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${txType === "expense" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-secondary hover:text-white"}`}
                >Egreso</button>
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary/70 uppercase tracking-wider mb-2">Importe ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="input-base text-2xl font-bold font-mono h-14 bg-black/20 focus:bg-black/40"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary/70 uppercase tracking-wider mb-2">Concepto</label>
                <input
                  type="text"
                  required
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="input-base bg-black/20 focus:bg-black/40"
                  placeholder="Ej. Pago factura #1234"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary/70 uppercase tracking-wider mb-2">Clasificación</label>
                <select
                  className="input-base appearance-none bg-black/20 focus:bg-black/40"
                  value={txCat}
                  onChange={(e) => setTxCat(e.target.value)}
                >
                  {CATEGORIES[txType].map(cat => (
                    <option key={cat} value={cat} className="bg-[#1a1d24]">{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-[rgba(255,255,255,0.05)]">
                <button type="button" className="btn btn-outline hover:bg-white/5" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className={`btn ${txType === "income" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20"} text-white border-none shadow-lg px-6`}>
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
