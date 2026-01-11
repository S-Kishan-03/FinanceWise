
import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateEMI, calculatePrepaymentImpact, formatCurrency } from '../utils/finance';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { PiggyBank, CalendarClock, Wallet, Landmark } from 'lucide-react';
import { ModuleType } from '../types';

interface HomeLoanModuleProps {
  onSaveScenario?: (scenario: any) => void;
}

const HomeLoanModule: React.FC<HomeLoanModuleProps> = ({ onSaveScenario }) => {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [monthlyPrepayment, setMonthlyPrepayment] = useState(0);
  const [lumpsumAmount, setLumpsumAmount] = useState(0);

  const { emi, totalInterest: originalTotalInterest } = useMemo(() => 
    calculateEMI(amount, rate, tenure), [amount, rate, tenure]
  );

  const totalMonthlyOutflow = useMemo(() => emi + monthlyPrepayment, [emi, monthlyPrepayment]);

  const prepaymentResults = useMemo(() => 
    calculatePrepaymentImpact(amount, rate, tenure, monthlyPrepayment, lumpsumAmount, 1),
    [amount, rate, tenure, monthlyPrepayment, lumpsumAmount]
  );

  const totalCostOfOwnership = useMemo(() => amount + prepaymentResults.newTotalInterest, [amount, prepaymentResults.newTotalInterest]);
  const originalTotalCost = useMemo(() => amount + originalTotalInterest, [amount, originalTotalInterest]);

  const chartData = [
    { name: 'Standard Plan', value: originalTotalInterest, fill: '#64748b' },
    { name: 'Optimized Plan', value: prepaymentResults.newTotalInterest, fill: '#6366f1' },
  ];

  const handleSave = () => {
    if (onSaveScenario) {
      onSaveScenario({
        moduleType: ModuleType.HOME_LOAN,
        title: `${formatCurrency(amount)} Loan @ ${rate}%`,
        data: { amount, rate, tenure, monthlyPrepayment },
        summary: [
          { label: 'EMI', value: formatCurrency(emi) },
          { label: 'Total Paid', value: formatCurrency(totalCostOfOwnership) },
          { label: 'Saved', value: formatCurrency(prepaymentResults.interestSaved) },
          { label: 'Time Saved', value: `${Math.floor(prepaymentResults.monthsSaved / 12)}Y ${prepaymentResults.monthsSaved % 12}M` }
        ]
      });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card title="Loan Parameters">
            <div className="space-y-6">
              <InputGroup 
                label="Loan Amount (Principal)" 
                value={amount} 
                onChange={setAmount} 
                min={100000} 
                max={100000000} 
                step={100000} 
                prefix="₹" 
              />
              <InputGroup 
                label="Interest Rate (p.a)" 
                value={rate} 
                onChange={setRate} 
                min={1} 
                max={20} 
                step={0.1} 
                suffix="%" 
              />
              <InputGroup 
                label="Loan Tenure" 
                value={tenure} 
                onChange={setTenure} 
                min={1} 
                max={30} 
                step={1} 
                suffix=" Years" 
              />
            </div>
          </Card>

          <Card title="Prepayment Strategy" className="bg-indigo-50/20 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
            <div className="space-y-6">
              <InputGroup 
                label="Extra Monthly Payment" 
                value={monthlyPrepayment} 
                onChange={setMonthlyPrepayment} 
                min={0} 
                max={100000} 
                step={1000} 
                prefix="₹" 
              />
              <InputGroup 
                label="One-time Lumpsum (Initial)" 
                value={lumpsumAmount} 
                onChange={setLumpsumAmount} 
                min={0} 
                max={5000000} 
                step={10000} 
                prefix="₹" 
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-indigo-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
                    <PiggyBank size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Standard EMI</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatCurrency(emi)}</p>
                  </div>
                </div>
                <div className="p-3 bg-indigo-600 rounded-lg border border-indigo-700 flex items-center gap-3 text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                  <div className="p-2 bg-indigo-500 rounded text-indigo-100">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-tight">Total Outflow</p>
                    <p className="text-sm font-bold">{formatCurrency(totalMonthlyOutflow)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold"
          >
            Add to Compare
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2 p-6 bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-900 dark:to-slate-950 rounded-2xl shadow-xl border border-slate-800 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/20 transition-all duration-700"></div>
               <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Total Ownership Cost</p>
                      <h3 className="text-4xl font-black mt-2 tracking-tight">{formatCurrency(totalCostOfOwnership)}</h3>
                      <div className="flex items-center gap-4 mt-3">
                        <p className="text-xs text-slate-400 font-medium">Original Cost: {formatCurrency(originalTotalCost)}</p>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <p className="text-xs text-emerald-400 font-bold">Saving: {formatCurrency(prepaymentResults.interestSaved)}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
                      <Landmark size={32} className="text-indigo-400" />
                    </div>
                  </div>
               </div>
            </div>

            <StatBox label="Total Interest Saved" value={formatCurrency(prepaymentResults.interestSaved)} colorClass="text-emerald-500 dark:text-emerald-400" />
            
            <div className="p-4 bg-indigo-50 dark:bg-slate-800/40 rounded-xl border border-indigo-100 dark:border-slate-800 flex items-center gap-4">
               <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <CalendarClock size={24} />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tenure Cut By</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white">
                    {Math.floor(prepaymentResults.monthsSaved / 12)}Y {prepaymentResults.monthsSaved % 12}M
                  </p>
               </div>
            </div>

            <StatBox label="Updated Interest" value={formatCurrency(prepaymentResults.newTotalInterest)} colorClass="text-indigo-600 dark:text-indigo-400" />
            <StatBox label="Loan to Interest Ratio" value={`${(originalTotalInterest / amount).toFixed(1)}x`} colorClass="text-slate-400" />
          </div>

          <Card title="Financial Cost Comparison">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={140} tick={{fontSize: 11, fontWeight: 600, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9', opacity: 0.1}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    formatter={(val: number) => formatCurrency(val)} 
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
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

export default HomeLoanModule;
