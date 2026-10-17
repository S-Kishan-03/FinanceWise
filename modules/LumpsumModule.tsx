import React, { useState } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateLumpsum, formatCurrency } from '../utils/finance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Coins, TrendingUp, Landmark } from 'lucide-react';

const LumpsumModule: React.FC = () => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { totalValue, totalInvested, wealthGain } = calculateLumpsum(amount, rate, years);

  const data = [
    { name: 'Invested', value: totalInvested, color: '#94a3b8' },
    { name: 'Wealth Gain', value: wealthGain, color: '#10b981' },
    { name: 'Final Total', value: totalValue, color: '#6366f1' },
  ];

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatBox label="Principal Invested" value={formatCurrency(totalInvested)} icon={<Coins size={16} />} />
        <StatBox label="Wealth Gain" value={formatCurrency(wealthGain)} colorClass="text-emerald-500" icon={<TrendingUp size={16} />} />
        <StatBox label="Maturity Value" value={formatCurrency(totalValue)} colorClass="text-indigo-600 dark:text-indigo-400" icon={<Landmark size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-5 space-y-3">
          <Card title="Investment Details">
            <div className="space-y-3">
              <InputGroup 
                label="Lumpsum Amount" 
                value={amount} 
                onChange={setAmount} 
                min={5000} 
                max={10000000} 
                step={5000} 
                prefix="₹" 
                presets={[50000, 100000, 250000, 500000]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputGroup 
                  label="CAGR (p.a)" 
                  value={rate} 
                  onChange={setRate} 
                  min={1} 
                  max={30} 
                  step={0.5} 
                  suffix="%" 
                  presets={[10, 12, 14]}
                />
                <InputGroup 
                  label="Duration" 
                  value={years} 
                  onChange={setYears} 
                  min={1} 
                  max={40} 
                  step={1} 
                  suffix=" Yrs" 
                  presets={[3, 5, 10, 15]}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card title="Return Breakdown">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={42}>
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
