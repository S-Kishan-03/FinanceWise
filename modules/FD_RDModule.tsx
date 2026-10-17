import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateFD, calculateRD, formatCurrency } from '../utils/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Landmark, ArrowDownCircle, Coins } from 'lucide-react';

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
    { name: 'Principal Invested', value: totalInvested, fill: '#6366f1' },
    { name: 'Interest Earned', value: results.interestEarned, fill: '#10b981' },
  ];

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBox label="Maturity Value" value={formatCurrency(results.maturityValue)} colorClass="text-indigo-600 dark:text-indigo-400" icon={<Landmark size={16} />} />
        <StatBox label="Interest Earned" value={formatCurrency(results.interestEarned)} colorClass="text-emerald-600 dark:text-emerald-400" icon={<Coins size={16} />} />
        <StatBox label="Total Invested" value={formatCurrency(totalInvested)} icon={<ArrowDownCircle size={16} />} />
        <StatBox label="Effective Compounding" value={`${rate}% p.a`} subValue="Quarterly compounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-6 space-y-3">
          <Card title="Deposit Parameters">
            <div className="space-y-3">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button 
                  onClick={() => { setType('FD'); setAmount(100000); }} 
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${type === 'FD' ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
                >Fixed Deposit (FD)</button>
                <button 
                  onClick={() => { setType('RD'); setAmount(5000); }} 
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${type === 'RD' ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
                >Recurring Deposit (RD)</button>
              </div>

              <InputGroup 
                label={type === 'FD' ? "Principal Amount" : "Monthly Installment"} 
                value={amount} 
                onChange={setAmount} 
                min={1000} 
                max={10000000} 
                step={type === 'FD' ? 10000 : 500} 
                prefix="₹" 
                presets={type === 'FD' ? [100000, 250000, 500000, 1000000] : [2000, 5000, 10000, 25000]}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputGroup 
                  label="Interest Rate (p.a)" 
                  value={rate} 
                  onChange={setRate} 
                  min={1} 
                  max={15} 
                  step={0.1} 
                  suffix="%" 
                  presets={[6.5, 7.0, 7.5, 8.0]}
                />
                <InputGroup 
                  label="Tenure (Years)" 
                  value={years} 
                  onChange={setYears} 
                  min={1} 
                  max={20} 
                  step={1} 
                  suffix=" Yrs" 
                  presets={[1, 3, 5, 10]}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card title="Principal vs Interest Breakdown">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={4} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {chartData.map((item) => (
                  <div key={item.name} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FD_RDModule;
