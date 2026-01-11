
import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateAffordability, formatCurrency } from '../utils/finance';
import { AlertCircle } from 'lucide-react';

const AffordabilityModule: React.FC = () => {
  const [income, setIncome] = useState(150000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const results = useMemo(() => calculateAffordability(income, existingEMI, rate, tenure), [income, existingEMI, rate, tenure]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card title="Financial Profile">
            <div className="space-y-6">
              <InputGroup label="Monthly Take-home Income" value={income} onChange={setIncome} min={10000} max={2000000} step={5000} prefix="₹" />
              <InputGroup label="Existing Monthly EMIs" value={existingEMI} onChange={setExistingEMI} min={0} max={500000} step={1000} prefix="₹" />
              <InputGroup label="Home Loan Rate (p.a)" value={rate} onChange={setRate} min={5} max={15} step={0.1} suffix="%" />
              <InputGroup label="Loan Tenure (Years)" value={tenure} onChange={setTenure} min={1} max={30} step={1} suffix=" Years" />
            </div>
          </Card>
          
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded text-amber-600 mt-1">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Note on Banks' Limit</p>
              <p className="text-xs text-amber-700 leading-relaxed mt-1">Most lenders limit total EMIs (FOIR) to 45-50% of your net monthly income. Our calculator uses a conservative 45% threshold.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-8">
          <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Max Loan Affordability</p>
            <h3 className="text-5xl md:text-6xl font-black text-indigo-600 mb-4">{formatCurrency(results.maxLoan)}</h3>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wide">
              Safe EMI Limit: {formatCurrency(results.maxEMI)}/mo
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatBox label="Monthly Income" value={formatCurrency(income)} />
            <StatBox label="Debt-to-Income" value={`${(( (existingEMI + results.maxEMI) / income) * 100).toFixed(0)}%`} colorClass="text-indigo-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffordabilityModule;
