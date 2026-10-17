import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculatePPF, formatCurrency } from '../utils/finance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, TrendingUp, PiggyBank, Info } from 'lucide-react';

const PPF_EPFModule: React.FC = () => {
  const [amount, setAmount] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);

  const { maturityValue, totalInvested, interestEarned, yearlyData } = useMemo(() => 
    calculatePPF(amount, rate, years), [amount, rate, years]
  );

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBox label="Maturity Value" value={formatCurrency(maturityValue)} colorClass="text-indigo-600 dark:text-indigo-400" icon={<ShieldCheck size={16} />} />
        <StatBox label="Interest Earned" value={formatCurrency(interestEarned)} colorClass="text-emerald-600 dark:text-emerald-400" icon={<TrendingUp size={16} />} />
        <StatBox label="Total Invested" value={formatCurrency(totalInvested)} icon={<PiggyBank size={16} />} />
        <StatBox label="Tax Status" value="EEE Category" subValue="100% Tax-Free Returns" colorClass="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-5 space-y-3">
          <Card title="Contribution Settings">
            <div className="space-y-3">
              <InputGroup 
                label="Annual Contribution" 
                value={amount} 
                onChange={setAmount} 
                min={500} 
                max={1500000} 
                step={5000} 
                prefix="₹" 
                presets={[50000, 100000, 150000]}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputGroup 
                  label="Rate (p.a)" 
                  value={rate} 
                  onChange={setRate} 
                  min={1} 
                  max={15} 
                  step={0.1} 
                  suffix="%" 
                  presets={[7.1, 8.1, 8.25]}
                />
                <InputGroup 
                  label="Duration" 
                  value={years} 
                  onChange={setYears} 
                  min={1} 
                  max={40} 
                  step={1} 
                  suffix=" Yrs" 
                  presets={[15, 20, 25]}
                />
              </div>
            </div>
          </Card>

          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl flex items-start gap-2.5">
            <Info size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed">
              PPF interest rates are quarterly revised by the Govt. of India (currently 7.1%). Annual contributions qualify for Section 80C deductions up to ₹1.5 Lakhs.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Card title="Corpus Growth Over Time">
            <div className="h-64 sm:h-72 w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ppfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#ppfGrad)" name="Total Corpus" />
                  <Area type="monotone" dataKey="totalInvested" stroke="#94a3b8" strokeWidth={1.5} fillOpacity={0} name="Investment" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PPF_EPFModule;
