import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateFIRE, formatCurrency, downloadCSV } from '../utils/finance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  Flame, 
  Target, 
  Trophy,
  Download,
  CalendarCheck
} from 'lucide-react';
import { ModuleType } from '../types';

interface FIREModuleProps {
  onSaveScenario?: (scenario: any) => void;
}

const FIREModule: React.FC<FIREModuleProps> = ({ onSaveScenario }) => {
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(25000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [inflation, setInflation] = useState(6);
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  const { fireTargetToday, yearsToFire, yearlyData } = useMemo(() => 
    calculateFIRE(monthlyExpenses, currentSavings, monthlyContribution, annualReturn, inflation, withdrawalRate),
    [monthlyExpenses, currentSavings, monthlyContribution, annualReturn, inflation, withdrawalRate]
  );

  const handleSave = () => {
    if (onSaveScenario) {
      onSaveScenario({
        moduleType: ModuleType.FIRE_CALC,
        title: `FIRE @ ${formatCurrency(monthlyExpenses)}/mo`,
        data: { monthlyExpenses, currentSavings, monthlyContribution, annualReturn, inflation, withdrawalRate },
        summary: [
          { label: 'Target Corpus', value: formatCurrency(fireTargetToday) },
          { label: 'Time to FIRE', value: yearsToFire > 0 ? `${yearsToFire} Years` : 'Achieved' },
          { label: 'Safe Monthly Pay', value: formatCurrency((fireTargetToday * (withdrawalRate / 100)) / 12) }
        ]
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Year', 'Projected Corpus (₹)', 'FIRE Target Line (₹)'];
    const rows = yearlyData.map(d => [
      `Year ${d.year}`,
      d.corpus,
      d.target
    ]);
    downloadCSV(`FinWise_FIRE_Trajectory_${monthlyExpenses}_expenses.csv`, headers, rows);
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Row: Hero and Stat Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sm:col-span-2 p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-900 dark:to-slate-950 rounded-xl border border-slate-800 text-white flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Today's Target Corpus</p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              {formatCurrency(fireTargetToday)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Annual expenses of {formatCurrency(monthlyExpenses * 12)} at {withdrawalRate}% SWR rule ({(100 / withdrawalRate).toFixed(0)}x rule)
            </p>
          </div>
          <div className="hidden sm:block p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
            <Flame size={24} className="text-orange-400" />
          </div>
        </div>

        <StatBox 
          label="Your FIRE Status" 
          value={yearsToFire > 0 ? `${yearsToFire} Years Left` : "Freedom Achieved!"}
          subValue={yearsToFire > 0 ? `Investing ${formatCurrency(monthlyContribution)}/mo` : 'Financial Independence met'}
          colorClass={yearsToFire > 0 ? "text-indigo-600 dark:text-indigo-400" : "text-emerald-500"}
          icon={<Trophy size={16} className="text-amber-500" />}
        />

        <StatBox 
          label="Monthly Freedom Pay" 
          value={formatCurrency((fireTargetToday * (withdrawalRate / 100)) / 12)} 
          subValue="Sustainable monthly spend"
          colorClass="text-emerald-600 dark:text-emerald-400"
          icon={<CalendarCheck size={16} />}
        />
      </div>

      {/* Main Grid: Inputs on Left, Curve Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-5 space-y-3">
          <Card title="Lifestyle & Savings">
            <div className="space-y-3">
              <InputGroup 
                label="Monthly Expenses" 
                value={monthlyExpenses} 
                onChange={setMonthlyExpenses} 
                min={5000} 
                max={500000} 
                step={1000} 
                prefix="₹" 
                presets={[30000, 50000, 75000, 100000]}
              />
              <InputGroup 
                label="Current Portfolio" 
                value={currentSavings} 
                onChange={setCurrentSavings} 
                min={0} 
                max={50000000} 
                step={10000} 
                prefix="₹" 
                presets={[500000, 1500000, 3000000, 5000000]}
              />
              <InputGroup 
                label="Monthly Investment" 
                value={monthlyContribution} 
                onChange={setMonthlyContribution} 
                min={0} 
                max={500000} 
                step={1000} 
                prefix="₹" 
                presets={[15000, 25000, 50000, 100000]}
              />
            </div>
          </Card>
          
          <Card title="Market & Inflation Assumptions">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <InputGroup 
                label="Portfolio CAGR" 
                value={annualReturn} 
                onChange={setAnnualReturn} 
                min={1} 
                max={30} 
                step={0.5} 
                suffix="%" 
                presets={[10, 12, 14]}
              />
              <InputGroup 
                label="Inflation" 
                value={inflation} 
                onChange={setInflation} 
                min={0} 
                max={15} 
                step={0.5} 
                suffix="%" 
                presets={[5, 6, 7]}
              />
              <InputGroup 
                label="Safe Withdrawal" 
                value={withdrawalRate} 
                onChange={setWithdrawalRate} 
                min={1} 
                max={10} 
                step={0.1} 
                suffix="%" 
                presets={[3.5, 4.0]}
              />
            </div>
          </Card>

          <button 
            onClick={handleSave}
            className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold text-xs shadow-xs"
          >
            Add to Comparison Board
          </button>
        </div>

        {/* Right: Chart */}
        <div className="lg:col-span-7">
          <Card 
            title="Financial Freedom Curve (50 Years)"
            action={
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded text-[11px] font-bold transition-all"
                title="Download CSV trajectory"
              >
                <Download size={12} />
                <span>Export CSV</span>
              </button>
            }
          >
            <div className="h-64 sm:h-72 w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-5" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val / 10000000).toFixed(0)}Cr`} />
                  <Tooltip 
                    formatter={(val: number) => formatCurrency(val)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#0f172a', color: '#fff', fontSize: '11px', padding: '6px 10px' }}
                  />
                  <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="stepAfter" name="Portfolio Value" dataKey="corpus" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#fireGrad)" />
                  <Area type="monotone" name="FIRE Target Line (Inflation Adj.)" dataKey="target" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#targetGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FIREModule;
