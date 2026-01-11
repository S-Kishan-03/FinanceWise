
import React, { useState } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateSIP, formatCurrency } from '../utils/finance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ModuleType } from '../types';
import { TrendingUp, Wallet, Landmark } from 'lucide-react';

interface SIPModuleProps {
  onSaveScenario?: (scenario: any) => void;
}

const SIPModule: React.FC<SIPModuleProps> = ({ onSaveScenario }) => {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(10);

  const { totalValue, totalInvested, wealthGain, yearlyData } = calculateSIP(monthly, rate, years, stepUp);

  const handleSave = () => {
    if (onSaveScenario) {
      onSaveScenario({
        moduleType: ModuleType.SIP,
        title: `SIP ${formatCurrency(monthly)} @ ${rate}%`,
        data: { monthly, rate, years, stepUp },
        summary: [
          { label: 'Total Invested', value: formatCurrency(totalInvested) },
          { label: 'Maturity Value', value: formatCurrency(totalValue) },
          { label: 'Wealth Gain', value: formatCurrency(wealthGain) }
        ]
      });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1" title="Investment Configuration">
          <div className="space-y-8">
            <InputGroup label="Monthly Investment" value={monthly} onChange={setMonthly} min={500} max={1000000} step={500} prefix="₹" />
            <InputGroup label="Expected CAGR" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
            <InputGroup label="Investment Period" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" Years" />
            <InputGroup label="Annual Step-up %" value={stepUp} onChange={setStepUp} min={0} max={50} step={1} suffix="%" />
            
            <button 
              onClick={handleSave}
              className="w-full mt-4 py-4 bg-indigo-600 dark:bg-indigo-700 text-white rounded-2xl hover:bg-indigo-700 transition-all font-black shadow-lg shadow-indigo-200 dark:shadow-none uppercase tracking-widest text-[10px]"
            >
              Add to Board
            </button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatBox label="Principal" value={formatCurrency(totalInvested)} icon={<Wallet size={16} />} />
            <StatBox label="Wealth Multiplier" value={`${(totalValue / totalInvested).toFixed(2)}x`} colorClass="text-emerald-500" icon={<TrendingUp size={16} />} />
            <StatBox label="Final Corpus" value={formatCurrency(totalValue)} colorClass="text-indigo-600 dark:text-indigo-400" icon={<Landmark size={16} />} />
          </div>

          <Card title="Compound Interest Trajectory">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData}>
                  <defs>
                    <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-5" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#sipGrad)" name="Corpus" />
                  <Area type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} name="Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SIPModule;
