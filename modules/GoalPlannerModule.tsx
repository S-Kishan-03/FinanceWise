import React, { useState } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateGoal, formatCurrency } from '../utils/finance';
import { Target, GraduationCap, Plane, Car, Home } from 'lucide-react';
import { ModuleType } from '../types';

interface GoalPlannerModuleProps {
  onSaveScenario?: (scenario: any) => void;
}

const GoalPlannerModule: React.FC<GoalPlannerModuleProps> = ({ onSaveScenario }) => {
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

  const handleSave = () => {
    if (onSaveScenario) {
      onSaveScenario({
        moduleType: ModuleType.GOAL_PLANNER,
        title: `${goalName} Goal - ${formatCurrency(target)}`,
        data: { goalName, target, rate, years },
        summary: [
          { label: 'Target Corpus', value: formatCurrency(target) },
          { label: 'Required SIP', value: `${formatCurrency(requiredMonthly)}/mo` },
          { label: 'Timeline', value: `${years} Years` }
        ]
      });
    }
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Hero Card & Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sm:col-span-2 p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-900 dark:to-slate-950 rounded-xl border border-slate-800 text-white flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Required Monthly SIP</p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              {formatCurrency(requiredMonthly)}<span className="text-sm font-normal text-slate-300">/mo</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              To accumulate {formatCurrency(target)} in {years} years @ {rate}% return
            </p>
          </div>
          <div className="hidden sm:block p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
            <Target size={24} className="text-indigo-400" />
          </div>
        </div>

        <StatBox label="Target Corpus" value={formatCurrency(target)} colorClass="text-indigo-600 dark:text-indigo-400" />
        <StatBox label="Time Horizon" value={`${years} Years`} subValue={`CAGR: ${rate}% p.a`} colorClass="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-7 space-y-3">
          <Card title="Goal Target Settings">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">Select Goal Category</label>
                <div className="grid grid-cols-5 gap-2">
                  {goals.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => setGoalName(g.name)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                        goalName === g.name 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-bold' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${g.color} shrink-0`}>
                        <g.icon size={14} />
                      </div>
                      <span className="text-[10px] truncate max-w-full">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <InputGroup 
                label="Target Amount (Inflation Adj.)" 
                value={target} 
                onChange={setTarget} 
                min={100000} 
                max={50000000} 
                step={100000} 
                prefix="₹" 
                presets={[1000000, 2500000, 5000000, 10000000]}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputGroup 
                  label="Expected Return (p.a)" 
                  value={rate} 
                  onChange={setRate} 
                  min={1} 
                  max={25} 
                  step={0.5} 
                  suffix="%" 
                  presets={[10, 12, 14]}
                />
                <InputGroup 
                  label="Years to Goal" 
                  value={years} 
                  onChange={setYears} 
                  min={1} 
                  max={30} 
                  step={1} 
                  suffix=" Years" 
                  presets={[3, 5, 10, 15]}
                />
              </div>
            </div>
          </Card>

          <button 
            onClick={handleSave}
            className="w-full py-2.5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold text-xs shadow-xs"
          >
            Add to Comparison Board
          </button>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <Card title="Investment Breakdown">
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Estimated Total Investment:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(requiredMonthly * years * 12)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Estimated Wealth Gain:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(Math.max(0, target - (requiredMonthly * years * 12)))}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full" 
                    style={{ width: `${Math.min(100, ((requiredMonthly * years * 12) / target) * 100)}%` }} 
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                <p className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                  💡 Pro-tip for {goalName}
                </p>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-400 leading-relaxed">
                  Start early and consider setting up an auto-debit on the day after salary credit. An annual step-up of 10% will drastically reduce the initial monthly investment required.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalPlannerModule;
