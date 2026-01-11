
import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateFIRE, formatCurrency } from '../utils/finance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  Flame, 
  Target, 
  Trophy
} from 'lucide-react';

const FIREModule: React.FC = () => {
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Lifestyle Inputs">
            <div className="space-y-6">
              <InputGroup label="Monthly Expenses" value={monthlyExpenses} onChange={setMonthlyExpenses} min={5000} max={1000000} step={1000} prefix="₹" />
              <InputGroup label="Current Corpus" value={currentSavings} onChange={setCurrentSavings} min={0} max={100000000} step={10000} prefix="₹" />
              <InputGroup label="Monthly Investment" value={monthlyContribution} onChange={setMonthlyContribution} min={0} max={1000000} step={1000} prefix="₹" />
            </div>
          </Card>
          
          <Card title="Simulation Controls">
            <div className="space-y-6">
              <InputGroup label="Market Returns" value={annualReturn} onChange={setAnnualReturn} min={1} max={30} step={0.5} suffix="%" />
              <InputGroup label="Inflation Hedge" value={inflation} onChange={setInflation} min={0} max={15} step={0.5} suffix="%" />
              <InputGroup label="Withdrawal Rate" value={withdrawalRate} onChange={setWithdrawalRate} min={1} max={10} step={0.1} suffix="%" />
            </div>
          </Card>
          
          <div className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-500/20 group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full" />
             <div className="relative z-10">
                <h4 className="font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Trophy size={16} className="text-amber-400" />
                  Your FIRE Status
                </h4>
                <p className="text-2xl font-black">
                  {yearsToFire > 0 ? `${yearsToFire} Years Left` : "Freedom Achieved!"}
                </p>
                <p className="text-[10px] text-indigo-100 mt-2 font-medium">Keep investing {formatCurrency(monthlyContribution)} to stay on track.</p>
             </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2 p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden border border-slate-800 shadow-2xl">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-600/20 blur-[80px] rounded-full" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 blur-[80px] rounded-full" />
                <div className="relative z-10 text-center">
                  <p className="text-xs font-black text-orange-400 uppercase tracking-[0.3em] mb-4">Maturity Target</p>
                  <h3 className="text-6xl md:text-7xl font-black tracking-tighter mb-4">
                      {formatCurrency(fireTargetToday)}
                  </h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">This is the amount you need in your portfolio today to never work again.</p>
                </div>
            </div>

            <StatBox 
              label="Monthly Freedom Pay" 
              value={formatCurrency((fireTargetToday * (withdrawalRate / 100)) / 12)} 
              subValue="Sustainable monthly spend"
              icon={<Flame size={20} className="text-orange-500" />}
            />
            <StatBox 
              label="Corpus Multiplier" 
              value={`${(fireTargetToday / (monthlyExpenses * 12)).toFixed(1)}x`} 
              subValue="Expenses covered per year"
              icon={<Target size={20} className="text-indigo-500" />}
            />
          </div>

          <Card title="The Financial Freedom Curve">
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`} />
                  <Tooltip 
                    formatter={(val: number) => formatCurrency(val)}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)', background: '#0f172a', color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={40} iconType="circle" />
                  <Area type="stepAfter" name="Portfolio Value" dataKey="corpus" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#fireGrad)" />
                  <Area type="monotone" name="FIRE Target Line" dataKey="target" stroke="#6366f1" strokeWidth={2} strokeDasharray="10 10" fillOpacity={1} fill="url(#targetGrad)" />
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
