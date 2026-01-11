
import React, { useState } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateLumpsum, formatCurrency } from '../utils/finance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LumpsumModule: React.FC = () => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { totalValue, totalInvested, wealthGain } = calculateLumpsum(amount, rate, years);

  const data = [
    { name: 'Invested', value: totalInvested, color: '#94a3b8' },
    { name: 'Gains', value: wealthGain, color: '#10b981' },
    { name: 'Total', value: totalValue, color: '#6366f1' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Investment Details">
          <div className="space-y-8">
            <InputGroup label="Lumpsum Amount" value={amount} onChange={setAmount} min={5000} max={10000000} step={5000} prefix="₹" />
            <InputGroup label="Expected Return (p.a)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
            <InputGroup label="Duration" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" Years" />
          </div>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatBox label="Invested Amount" value={formatCurrency(totalInvested)} />
            <StatBox label="Wealth Gain" value={formatCurrency(wealthGain)} colorClass="text-emerald-500" />
            <StatBox label="Maturity Amount" value={formatCurrency(totalValue)} colorClass="text-indigo-600" />
          </div>

          <Card title="Projection Analysis">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(val: number) => formatCurrency(val)} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LumpsumModule;
