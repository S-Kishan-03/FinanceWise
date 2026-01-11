
import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateFD, calculateRD, formatCurrency } from '../utils/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const FD_RDModule: React.FC = () => {
  const [type, setType] = useState<'FD' | 'RD'>('FD');
  const [amount, setAmount] = useState(type === 'FD' ? 100000 : 5000);
  const [rate, setRate] = useState(7.0);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    return type === 'FD' 
      ? calculateFD(amount, rate, years) 
      : calculateRD(amount, rate, years);
  }, [type, amount, rate, years]);

  const totalInvested = type === 'FD' ? amount : amount * years * 12;
  const chartData = [
    { name: 'Invested', value: totalInvested, fill: '#6366f1' },
    { name: 'Interest', value: results.interestEarned, fill: '#10b981' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card title="Deposit Settings">
            <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
              <button 
                onClick={() => { setType('FD'); setAmount(100000); }} 
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'FD' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >Fixed Deposit (FD)</button>
              <button 
                onClick={() => { setType('RD'); setAmount(5000); }} 
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'RD' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >Recurring Deposit (RD)</button>
            </div>
            <div className="space-y-6">
              <InputGroup label={type === 'FD' ? "Principal Amount" : "Monthly Installment"} value={amount} onChange={setAmount} min={1000} max={10000000} step={1000} prefix="₹" />
              <InputGroup label="Interest Rate (p.a)" value={rate} onChange={setRate} min={1} max={15} step={0.1} suffix="%" />
              <InputGroup label="Tenure (Years)" value={years} onChange={setYears} min={1} max={20} step={1} suffix=" Years" />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatBox label="Maturity Value" value={formatCurrency(results.maturityValue)} colorClass="text-indigo-600" />
            <StatBox label="Interest Earned" value={formatCurrency(results.interestEarned)} colorClass="text-emerald-600" />
            <StatBox label="Total Invested" value={formatCurrency(totalInvested)} />
            <StatBox label="Annual Return" value={`${rate}%`} />
          </div>

          <Card title="Investment Split">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FD_RDModule;
