import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateAffordability, formatCurrency } from '../utils/finance';
import { AlertCircle, Landmark, ShieldCheck } from 'lucide-react';

const AffordabilityModule: React.FC = () => {
  const [income, setIncome] = useState(150000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const results = useMemo(() => calculateAffordability(income, existingEMI, rate, tenure), [income, existingEMI, rate, tenure]);

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Hero and Key Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sm:col-span-2 p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-900 dark:to-slate-950 rounded-xl border border-slate-800 text-white flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Max Home Loan Affordability</p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">{formatCurrency(results.maxLoan)}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Eligible loan principal based on 45% FOIR banking benchmark
            </p>
          </div>
          <div className="hidden sm:block p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
            <Landmark size={24} className="text-indigo-400" />
          </div>
        </div>

        <StatBox 
          label="Safe Maximum EMI" 
          value={`${formatCurrency(results.maxEMI)}/mo`} 
          subValue="45% of net income ceiling"
          colorClass="text-emerald-600 dark:text-emerald-400"
          icon={<ShieldCheck size={16} />}
        />

        <StatBox 
          label="Debt-to-Income (FOIR)" 
          value={`${(( (existingEMI + results.maxEMI) / income) * 100).toFixed(0)}%`} 
          subValue={`Existing EMIs: ${formatCurrency(existingEMI)}`}
          colorClass="text-indigo-600 dark:text-indigo-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-7 space-y-3">
          <Card title="Financial Profile">
            <div className="space-y-3">
              <InputGroup 
                label="Monthly Take-home Income" 
                value={income} 
                onChange={setIncome} 
                min={10000} 
                max={2000000} 
                step={5000} 
                prefix="₹" 
                presets={[75000, 100000, 150000, 250000]}
              />
              <InputGroup 
                label="Existing Monthly EMIs" 
                value={existingEMI} 
                onChange={setExistingEMI} 
                min={0} 
                max={500000} 
                step={1000} 
                prefix="₹" 
                presets={[0, 15000, 30000, 50000]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputGroup 
                  label="Loan Rate (p.a)" 
                  value={rate} 
                  onChange={setRate} 
                  min={5} 
                  max={15} 
                  step={0.1} 
                  suffix="%" 
                  presets={[8.25, 8.5, 9.0]}
                />
                <InputGroup 
                  label="Loan Tenure" 
                  value={tenure} 
                  onChange={setTenure} 
                  min={1} 
                  max={30} 
                  step={1} 
                  suffix=" Years" 
                  presets={[15, 20, 25, 30]}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="p-3 bg-amber-50/80 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-200">How Banks Calculate Loan Eligibility</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed mt-1">
                Indian lenders strictly enforce the Fixed Obligation to Income Ratio (FOIR). Any existing vehicle, personal, or credit card EMIs reduce your eligible home loan borrowing power directly rupee-for-rupee.
              </p>
            </div>
          </div>

          <Card title="Income Utilization">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Gross Monthly Inflow:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(income)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Current Fixed EMIs:</span>
                <span className="font-bold text-rose-500">{formatCurrency(existingEMI)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Available for New Home EMI:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(results.maxEMI)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AffordabilityModule;
