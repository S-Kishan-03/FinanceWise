import React, { useState, useMemo } from 'react';
import { Card, InputGroup } from '../components/Shared';
import { formatCurrency, downloadCSV } from '../utils/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  HeartPulse, 
  Coffee, 
  PiggyBank, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Download, 
  RefreshCw,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

export interface BudgetItem {
  id: string;
  name: string;
  category: 'needs' | 'wants' | 'savings';
  amount: number;
}

const DEFAULT_EXPENSES: BudgetItem[] = [
  // Needs
  { id: '1', name: 'Rent / Home Loan EMI', category: 'needs', amount: 25000 },
  { id: '2', name: 'Grocery & Monthly Ration', category: 'needs', amount: 12000 },
  { id: '3', name: 'Fuel & Daily Commute', category: 'needs', amount: 4500 },
  { id: '4', name: 'Wi-Fi & Mobile Recharge', category: 'needs', amount: 1500 },
  { id: '5', name: 'Health & Term Insurance', category: 'needs', amount: 3500 },
  { id: '6', name: 'Electricity, Water & LPG', category: 'needs', amount: 3500 },

  // Wants
  { id: '7', name: 'Shopping & Apparel', category: 'wants', amount: 7000 },
  { id: '8', name: 'Dining Out & Food Delivery', category: 'wants', amount: 6000 },
  { id: '9', name: 'OTT & Subscriptions', category: 'wants', amount: 1500 },
  { id: '10', name: 'Weekend Outings & Fun', category: 'wants', amount: 4500 },

  // Savings & Debt
  { id: '11', name: 'Emergency Fund', category: 'savings', amount: 5000 },
  { id: '12', name: 'Mutual Fund SIPs', category: 'savings', amount: 12000 },
  { id: '13', name: 'PPF / NPS / Gold', category: 'savings', amount: 3000 },
];

const BudgetPlannerModule: React.FC = () => {
  const [salary, setSalary] = useState(100000);
  const [strategy, setStrategy] = useState<'50/30/20' | '70/20/10'>('50/30/20');
  const [expenses, setExpenses] = useState<BudgetItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('finwise_budget_items');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_EXPENSES;
  });

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'needs' | 'wants' | 'savings'>('all');
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<'needs' | 'wants' | 'savings'>('needs');
  const [newExpenseAmount, setNewExpenseAmount] = useState(2000);
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  // Sync to local storage
  const updateExpenses = (newItems: BudgetItem[]) => {
    setExpenses(newItems);
    try {
      localStorage.setItem('finwise_budget_items', JSON.stringify(newItems));
    } catch (e) {
      console.error(e);
    }
  };

  const handleExpenseAmountChange = (id: string, amount: number) => {
    const updated = expenses.map(item => item.id === id ? { ...item, amount: Math.max(0, amount) } : item);
    updateExpenses(updated);
  };

  const handleExpenseNameChange = (id: string, name: string) => {
    const updated = expenses.map(item => item.id === id ? { ...item, name } : item);
    updateExpenses(updated);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(item => item.id !== id);
    updateExpenses(updated);
  };

  const handleAddCustomExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim()) return;
    const newItem: BudgetItem = {
      id: crypto.randomUUID(),
      name: newExpenseName.trim(),
      category: newExpenseCategory,
      amount: Number(newExpenseAmount) || 0
    };
    updateExpenses([...expenses, newItem]);
    setNewExpenseName('');
    setIsAddingExpense(false);
  };

  const handleResetDefaults = () => {
    updateExpenses(DEFAULT_EXPENSES);
  };

  // Target Rule Allocations
  const ruleConfig = useMemo(() => {
    if (strategy === '50/30/20') {
      return {
        needsPct: 50,
        wantsPct: 30,
        savingsPct: 20,
        needsTarget: salary * 0.50,
        wantsTarget: salary * 0.30,
        savingsTarget: salary * 0.20,
        needsLabel: 'Needs',
        wantsLabel: 'Wants',
        savingsLabel: 'Savings & Debt'
      };
    } else {
      return {
        needsPct: 70,
        wantsPct: 20,
        savingsPct: 10,
        needsTarget: salary * 0.70,
        wantsTarget: salary * 0.20,
        savingsTarget: salary * 0.10,
        needsLabel: 'Living Expenses',
        wantsLabel: 'Savings',
        savingsLabel: 'Debt/Emergency'
      };
    }
  }, [salary, strategy]);

  // Actual Aggregated Totals
  const actuals = useMemo(() => {
    let needsSum = 0;
    let wantsSum = 0;
    let savingsSum = 0;

    expenses.forEach(item => {
      if (item.category === 'needs') needsSum += item.amount;
      else if (item.category === 'wants') wantsSum += item.amount;
      else if (item.category === 'savings') savingsSum += item.amount;
    });

    const totalAllocated = needsSum + wantsSum + savingsSum;
    const remainingIncome = salary - totalAllocated;

    return {
      needsSum,
      wantsSum,
      savingsSum,
      totalAllocated,
      remainingIncome,
      needsDelta: ruleConfig.needsTarget - needsSum,
      wantsDelta: ruleConfig.wantsTarget - wantsSum,
      savingsDelta: ruleConfig.savingsTarget - savingsSum,
    };
  }, [expenses, salary, ruleConfig]);

  // Chart data comparing target vs actual spend
  const actualChartData = useMemo(() => [
    { name: ruleConfig.needsLabel, value: actuals.needsSum, color: '#6366f1' },
    { name: ruleConfig.wantsLabel, value: actuals.wantsSum, color: '#f43f5e' },
    { name: ruleConfig.savingsLabel, value: actuals.savingsSum, color: '#10b981' },
  ].filter(d => d.value > 0), [actuals, ruleConfig]);

  const emergencyFund = useMemo(() => {
    const monthlyEssentials = actuals.needsSum > 0 ? actuals.needsSum : ruleConfig.needsTarget;
    return {
      monthlyEssentials,
      threeMonths: monthlyEssentials * 3,
      sixMonths: monthlyEssentials * 6,
    };
  }, [actuals.needsSum, ruleConfig.needsTarget]);

  const filteredExpenses = useMemo(() => {
    if (activeCategoryFilter === 'all') return expenses;
    return expenses.filter(e => e.category === activeCategoryFilter);
  }, [expenses, activeCategoryFilter]);

  const handleExportCSV = () => {
    const headers = ['Category', 'Expense Item', 'Monthly Amount (₹)', '% of Salary'];
    const rows = expenses.map(e => [
      e.category.toUpperCase(),
      e.name,
      e.amount,
      ((e.amount / salary) * 100).toFixed(1) + '%'
    ]);
    downloadCSV(`FinWise_Budget_Planner_${salary}.csv`, headers, rows);
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Row: Category Comparison Cards (Rule Target vs Actual Allocations) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Needs Card */}
        <div className="p-3 bg-white/90 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <HeartPulse size={15} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{ruleConfig.needsLabel} ({ruleConfig.needsPct}%)</p>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {formatCurrency(actuals.needsSum)} 
                  <span className="text-[10px] font-normal text-slate-400 ml-1">/ {formatCurrency(ruleConfig.needsTarget)}</span>
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              actuals.needsDelta >= 0 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
            }`}>
              {actuals.needsDelta >= 0 ? `+${formatCurrency(actuals.needsDelta)} Left` : `${formatCurrency(Math.abs(actuals.needsDelta))} Over`}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${actuals.needsSum > ruleConfig.needsTarget ? 'bg-rose-500' : 'bg-indigo-600'}`}
              style={{ width: `${Math.min(100, (actuals.needsSum / (ruleConfig.needsTarget || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Wants Card */}
        <div className="p-3 bg-white/90 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Coffee size={15} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{ruleConfig.wantsLabel} ({ruleConfig.wantsPct}%)</p>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {formatCurrency(actuals.wantsSum)} 
                  <span className="text-[10px] font-normal text-slate-400 ml-1">/ {formatCurrency(ruleConfig.wantsTarget)}</span>
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              actuals.wantsDelta >= 0 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
            }`}>
              {actuals.wantsDelta >= 0 ? `+${formatCurrency(actuals.wantsDelta)} Left` : `${formatCurrency(Math.abs(actuals.wantsDelta))} Over`}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${actuals.wantsSum > ruleConfig.wantsTarget ? 'bg-rose-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(100, (actuals.wantsSum / (ruleConfig.wantsTarget || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Savings & Debt Card */}
        <div className="p-3 bg-white/90 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <PiggyBank size={15} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{ruleConfig.savingsLabel} ({ruleConfig.savingsPct}%)</p>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {formatCurrency(actuals.savingsSum)} 
                  <span className="text-[10px] font-normal text-slate-400 ml-1">/ {formatCurrency(ruleConfig.savingsTarget)}</span>
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              actuals.savingsSum >= ruleConfig.savingsTarget 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
            }`}>
              {actuals.savingsSum >= ruleConfig.savingsTarget ? 'Goal Met' : `${formatCurrency(ruleConfig.savingsTarget - actuals.savingsSum)} Short`}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (actuals.savingsSum / (ruleConfig.savingsTarget || 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls & Overview, Right Expense Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Column: Salary Input, Strategy & Real-time Distribution Chart */}
        <div className="lg:col-span-4 space-y-3">
          <Card title="Monthly Take-home Inflow">
            <div className="space-y-3">
              <InputGroup 
                label="Monthly Income" 
                value={salary} 
                onChange={setSalary} 
                min={10000} 
                max={2000000} 
                step={5000} 
                prefix="₹" 
                presets={[50000, 100000, 150000, 200000]}
              />

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">Rule Strategy</label>
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
                  {(['50/30/20', '70/20/10'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStrategy(s)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                        strategy === s 
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {s} Rule
                    </button>
                  ))}
                </div>
              </div>

              {/* Inflow Allocation Status */}
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Total Allocated:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(actuals.totalAllocated)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Unallocated Surplus:</span>
                  <span className={`font-black ${actuals.remainingIncome >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {actuals.remainingIncome >= 0 ? formatCurrency(actuals.remainingIncome) : `-${formatCurrency(Math.abs(actuals.remainingIncome))}`}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Mini Pie Chart */}
          <Card title="Actual Spend Distribution">
            <div className="grid grid-cols-2 gap-2 items-center">
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={actualChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {actualChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => formatCurrency(val)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px', padding: '6px 10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1 text-xs pr-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Needs
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {salary > 0 ? ((actuals.needsSum / salary) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-rose-500">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Wants
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {salary > 0 ? ((actuals.wantsSum / salary) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-emerald-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Savings
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {salary > 0 ? ((actuals.savingsSum / salary) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Fund Milestones */}
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl text-white shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={14} /> Emergency Fund Target
              </span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">Needs-Based</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 bg-white/10 rounded-lg">
                <span className="text-[9px] uppercase font-bold text-indigo-200 block">3 Mo (Starter)</span>
                <span className="font-black text-xs">{formatCurrency(emergencyFund.threeMonths)}</span>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <span className="text-[9px] uppercase font-bold text-indigo-100 block">6 Mo (Secure)</span>
                <span className="font-black text-xs">{formatCurrency(emergencyFund.sixMonths)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Expense Allocation Table */}
        <div className="lg:col-span-8 space-y-3">
          <Card 
            title="Monthly Expenses Breakdown"
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[11px] font-bold transition-all"
                  title="Download CSV"
                >
                  <Download size={12} />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded text-[11px] font-bold transition-all"
                  title="Reset to default Indian expenses"
                >
                  <RefreshCw size={12} />
                </button>
                <button
                  onClick={() => setIsAddingExpense(!isAddingExpense)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded text-[11px] font-bold transition-all shadow-xs"
                >
                  <Plus size={12} />
                  <span>Add Expense</span>
                </button>
              </div>
            }
          >
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <ListFilter size={12} /> Filter:
              </span>
              {[
                { key: 'all', label: `All (${expenses.length})` },
                { key: 'needs', label: `Needs (${expenses.filter(e => e.category === 'needs').length})` },
                { key: 'wants', label: `Wants (${expenses.filter(e => e.category === 'wants').length})` },
                { key: 'savings', label: `Savings & Debt (${expenses.filter(e => e.category === 'savings').length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategoryFilter(tab.key as any)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    activeCategoryFilter === tab.key 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Add Form Modal/Drawer Inline */}
            {isAddingExpense && (
              <form onSubmit={handleAddCustomExpense} className="p-3 mb-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 flex flex-wrap items-center gap-2 text-xs animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder="Expense name (e.g. Gym, Maid, Pet)"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  className="flex-1 min-w-[140px] h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
                />
                <select
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value as any)}
                  className="h-8 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="needs">Needs (Essential)</option>
                  <option value="wants">Wants (Lifestyle)</option>
                  <option value="savings">Savings & Debt</option>
                </select>
                <div className="relative w-28">
                  <span className="absolute left-2 top-2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
                    className="w-full h-8 pl-5 pr-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-right focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-8 px-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingExpense(false)}
                  className="h-8 px-2 text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Table Form for Approximate Expenses */}
            <div className="overflow-x-auto max-h-[380px] overflow-y-auto scrollbar-thin">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-2 px-2.5">Category</th>
                    <th className="py-2 px-2.5">Expense Item</th>
                    <th className="py-2 px-2.5 text-right w-36">Approx Amount (₹)</th>
                    <th className="py-2 px-2.5 text-right w-20">% of Inflow</th>
                    <th className="py-2 px-1 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredExpenses.map((item) => {
                    const categoryBadge = {
                      needs: { label: 'Needs', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' },
                      wants: { label: 'Wants', color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' },
                      savings: { label: 'Savings', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' }
                    }[item.category];

                    const pctOfSalary = salary > 0 ? ((item.amount / salary) * 100).toFixed(1) : '0';

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="py-1.5 px-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${categoryBadge.color}`}>
                            {categoryBadge.label}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleExpenseNameChange(item.id, e.target.value)}
                            className="w-full bg-transparent border-0 border-b border-transparent focus:border-indigo-400 focus:bg-slate-100/50 dark:focus:bg-slate-800/50 py-0.5 px-1 rounded text-slate-800 dark:text-slate-200 font-semibold focus:outline-none transition-all"
                          />
                        </td>
                        <td className="py-1.5 px-2.5 text-right">
                          <div className="relative inline-block w-28">
                            <span className="absolute left-2 top-1 text-[11px] text-slate-400 font-bold">₹</span>
                            <input
                              type="number"
                              min={0}
                              step={100}
                              value={item.amount}
                              onChange={(e) => handleExpenseAmountChange(item.id, Number(e.target.value))}
                              className="w-full py-0.5 pl-4 pr-1 text-right text-xs font-black text-slate-900 dark:text-white bg-slate-100/60 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-bold text-slate-500 dark:text-slate-400 text-[11px]">
                          {pctOfSalary}%
                        </td>
                        <td className="py-1.5 px-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(item.id)}
                            className="p-1 text-slate-300 hover:text-rose-500 opacity-60 hover:opacity-100 transition-opacity"
                            title="Delete item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Category Subtotals */}
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs font-semibold gap-2">
              <span className="text-slate-500 text-[11px]">
                Showing {filteredExpenses.length} items
              </span>
              <div className="flex items-center gap-3">
                <span className="text-indigo-600 dark:text-indigo-400 text-[11px]">
                  Needs: <strong>{formatCurrency(actuals.needsSum)}</strong>
                </span>
                <span className="text-rose-500 text-[11px]">
                  Wants: <strong>{formatCurrency(actuals.wantsSum)}</strong>
                </span>
                <span className="text-emerald-500 text-[11px]">
                  Savings: <strong>{formatCurrency(actuals.savingsSum)}</strong>
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlannerModule;
