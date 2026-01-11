
import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { formatCurrency } from '../utils/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet, Coffee, HeartPulse, PiggyBank, ShieldCheck, AlertCircle } from 'lucide-react';

const BudgetPlannerModule: React.FC = () => {
  const [salary, setSalary] = useState(100000);
  const [strategy, setStrategy] = useState<'50/30/20' | '70/20/10'>('50/30/20');

  const allocation = useMemo(() => {
    if (strategy === '50/30/20') {
      return [
        { name: 'Needs', value: salary * 0.50, color: '#6366f1', icon: HeartPulse, desc: 'Rent, Utilities, Groceries, Insurance' },
        { name: 'Wants', value: salary * 0.30, color: '#f43f5e', icon: Coffee, desc: 'Dining out, Hobbies, Entertainment' },
        { name: 'Savings & Debt', value: salary * 0.20, color: '#10b981', icon: PiggyBank, desc: 'Emergency fund, SIPs, Loan repayments' },
      ];
    } else {
      return [
        { name: 'Living Expenses', value: salary * 0.70, color: '#6366f1', icon: Wallet, desc: 'Combined Needs and lifestyle' },
        { name: 'Savings', value: salary * 0.20, color: '#10b981', icon: PiggyBank, desc: 'Future goals and investments' },
        { name: 'Debt/Emergency', value: salary * 0.10, color: '#f59e0b', icon: HeartPulse, desc: 'Quick access or debt clearing' },
      ];
    }
  }, [salary, strategy]);

  const emergencyFund = useMemo(() => {
    // Essentials are usually the base for emergency funds
    const monthlyEssentials = strategy === '50/30/20' ? salary * 0.5 : salary * 0.7;
    return {
      monthlyEssentials,
      threeMonths: monthlyEssentials * 3,
      sixMonths: monthlyEssentials * 6,
      twelveMonths: monthlyEssentials * 12
    };
  }, [salary, strategy]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Your Income">
            <div className="space-y-6">
              <InputGroup 
                label="Monthly Take-home Salary" 
                value={salary} 
                onChange={setSalary} 
                min={5000} 
                max={2000000} 
                step={1000} 
                prefix="₹" 
              />
              
              <div className="pt-4">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-3">Allocation Strategy</label>
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {(['50/30/20', '70/20/10'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStrategy(s)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${strategy === s ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
                    >
                      {s} Rule
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="p-5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100 dark:shadow-none">
            <h4 className="font-bold mb-2 flex items-center gap-2">
               <ShieldCheck size={20} />
               Emergency Fund Strategy
            </h4>
            <p className="text-xs text-indigo-100 leading-relaxed mb-4">
              Financial experts recommend having at least 3 to 6 months of essential expenses saved. Based on your {strategy} "Needs" allocation:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider">3 Months (Starter)</span>
                <span className="font-black">{formatCurrency(emergencyFund.threeMonths)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/20 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider">6 Months (Secure)</span>
                <span className="font-black">{formatCurrency(emergencyFund.sixMonths)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allocation.map((item) => (
              <div key={item.name} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-xs font-black" style={{ color: item.color }}>
                    {Math.round((item.value / salary) * 100)}%
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{item.name}</p>
                <p className="text-xl font-black text-slate-800 dark:text-white mt-1">{formatCurrency(item.value)}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>

          <Card title="Allocation Breakdown">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {allocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => formatCurrency(val)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-slate-700 dark:text-slate-200">Action Plan</h5>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Target {formatCurrency(emergencyFund.sixMonths)} as your "Safe" EF goal.
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Keep fixed needs below {formatCurrency(emergencyFund.monthlyEssentials)}.
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Prioritize high-interest debt with "Savings" portion.
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded text-amber-600 dark:text-amber-400 mt-1">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Where to keep your Emergency Fund?</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed mt-1">
                Keep these funds in highly liquid accounts such as a high-interest savings account, 
                Short-term FDs, or Liquid Mutual Funds. The goal is safety and accessibility, not high returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlannerModule;
