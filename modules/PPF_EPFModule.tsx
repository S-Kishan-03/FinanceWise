
import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculatePPF, formatCurrency } from '../utils/finance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PPF_EPFModule: React.FC = () => {
  const [amount, setAmount] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);

  const { maturityValue, totalInvested, interestEarned, yearlyData } = useMemo(() => 
    calculatePPF(amount, rate, years), [amount, rate, years]
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Annual Savings" className="lg:col-span-1">
          <div className="space-y-6">
            <InputGroup label="Annual Contribution" value={amount} onChange={setAmount} min={500} max={1500000} step={500} prefix="₹" />
            <InputGroup label="Interest Rate (p.a)" value={rate} onChange={setRate} min={1} max={15} step={0.1} suffix="%" />
            <InputGroup label="Duration (Years)" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" Years" />
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">PPF usually has a 15-year lock-in with current rate of 7.1%. EPF rates vary around 8%.</p>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatBox label="Maturity Value" value={formatCurrency(maturityValue)} colorClass="text-indigo-600" />
            <StatBox label="Total Interest" value={formatCurrency(interestEarned)} colorClass="text-emerald-500" />
            <StatBox label="Total Invested" value={formatCurrency(totalInvested)} />
          </div>

          <Card title="Corpus Growth Over Time">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData}>
                  <defs>
                    <linearGradient id="ppfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#ppfGrad)" name="Total Corpus" />
                  <Area type="monotone" dataKey="totalInvested" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} name="Investment" />
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
