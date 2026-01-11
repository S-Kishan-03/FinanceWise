
import React, { useState } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateGoal, formatCurrency } from '../utils/finance';
import { Target, GraduationCap, Plane, Car, Home } from 'lucide-react';

const GoalPlannerModule: React.FC = () => {
  const [goalName, setGoalName] = useState('Education');
  const [target, setTarget] = useState(2500000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { requiredMonthly } = calculateGoal(target, rate, years);

  const goals = [
    { name: 'Education', icon: GraduationCap, color: 'bg-blue-500' },
    { name: 'House', icon: Home, color: 'bg-emerald-500' },
    { name: 'Car', icon: Car, color: 'bg-rose-500' },
    { name: 'Vacation', icon: Plane, color: 'bg-amber-500' },
    { name: 'Custom', icon: Target, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Goal Settings">
          <div className="space-y-8">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {goals.map((g) => (
                <button
                  key={g.name}
                  onClick={() => setGoalName(g.name)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${goalName === g.name ? 'border-indigo-600 bg-indigo-50' : 'border-transparent hover:bg-slate-50'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${g.color}`}>
                    <g.icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{g.name}</span>
                </button>
              ))}
            </div>

            <InputGroup label="Target Amount (Inflation Adj.)" value={target} onChange={setTarget} min={100000} max={50000000} step={100000} prefix="₹" />
            <InputGroup label="Expected Return (p.a)" value={rate} onChange={setRate} min={1} max={25} step={0.5} suffix="%" />
            <InputGroup label="Years to Goal" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" Years" />
          </div>
        </Card>

        <div className="flex flex-col justify-center items-center space-y-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-500 mb-2">You need to invest</h3>
            <div className="text-5xl md:text-6xl font-black text-indigo-600 mb-2">
              {formatCurrency(requiredMonthly)}
            </div>
            <p className="text-slate-500 uppercase tracking-widest text-sm font-semibold">Every Month</p>
          </div>

          <div className="grid grid-cols-1 w-full gap-4">
            <StatBox label="Total Goal Amount" value={formatCurrency(target)} />
            <StatBox label="Time Horizon" value={`${years} Years`} />
            <StatBox label="Assumed CAGR" value={`${rate}%`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalPlannerModule;
