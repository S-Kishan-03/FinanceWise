import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { 
  calculateEMI, 
  calculatePrepaymentImpact, 
  formatCurrency, 
  generateAmortizationSchedule, 
  downloadCSV 
} from '../utils/finance';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { 
  PiggyBank, 
  CalendarClock, 
  Wallet, 
  Landmark, 
  Download, 
  ReceiptIndianRupee,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
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
  const [showAllYears, setShowAllYears] = useState(false);

  const { emi, totalInterest: originalTotalInterest } = useMemo(() => 
    calculateEMI(amount, rate, tenure), [amount, rate, tenure]
  );

  const totalMonthlyOutflow = useMemo(() => emi + monthlyPrepayment, [emi, monthlyPrepayment]);

  const prepaymentResults = useMemo(() => 
    calculatePrepaymentImpact(amount, rate, tenure, monthlyPrepayment, lumpsumAmount, 1),
    [amount, rate, tenure, monthlyPrepayment, lumpsumAmount]
  );

  const amortizationSchedule = useMemo(() => 
    generateAmortizationSchedule(amount, rate, tenure, monthlyPrepayment, lumpsumAmount, 1),
    [amount, rate, tenure, monthlyPrepayment, lumpsumAmount]
  );

  const totalCostOfOwnership = useMemo(() => amount + prepaymentResults.newTotalInterest, [amount, prepaymentResults.newTotalInterest]);
  const originalTotalCost = useMemo(() => amount + originalTotalInterest, [amount, originalTotalInterest]);

  // Tax calculations based on first year payments
  const firstYearSchedule = amortizationSchedule[0] || { interestPaid: 0, principalPaid: 0 };
  const sec24bEligible = Math.min(200000, firstYearSchedule.interestPaid);
  const sec80cEligible = Math.min(150000, firstYearSchedule.principalPaid);
  const estimatedTaxSaved = Math.round((sec24bEligible + sec80cEligible) * 0.312);

  const chartData = [
    { name: 'Standard Plan', value: originalTotalInterest, fill: '#64748b' },
    { name: 'Optimized Plan', value: prepaymentResults.newTotalInterest, fill: '#6366f1' },
  ];

  const handleSave = () => {
    if (onSaveScenario) {
      onSaveScenario({
        moduleType: ModuleType.HOME_LOAN,
        title: `${formatCurrency(amount)} Loan @ ${rate}%`,
        data: { amount, rate, tenure, monthlyPrepayment, lumpsumAmount },
        summary: [
          { label: 'EMI', value: formatCurrency(emi) },
          { label: 'Total Paid', value: formatCurrency(totalCostOfOwnership) },
          { label: 'Saved', value: formatCurrency(prepaymentResults.interestSaved) },
          { label: 'Time Saved', value: `${Math.floor(prepaymentResults.monthsSaved / 12)}Y ${prepaymentResults.monthsSaved % 12}M` }
        ]
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Year', 'Opening Balance (₹)', 'Principal Paid (₹)', 'Interest Paid (₹)', 'Total Payment (₹)', 'Closing Balance (₹)'];
    const rows = amortizationSchedule.map(row => [
      `Year ${row.year}`,
      row.openingBalance,
      row.principalPaid,
      row.interestPaid,
      row.totalPaid,
      row.closingBalance
    ]);
    downloadCSV(`FinWise_HomeLoan_Amortization_${amount}_${rate}pct.csv`, headers, rows);
  };

  const displayedSchedule = showAllYears ? amortizationSchedule : amortizationSchedule.slice(0, 5);

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-6">
      {/* Top Row: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-900 dark:to-slate-950 rounded-xl border border-slate-800 text-white shadow-xs">
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Total Ownership Cost</p>
          <h3 className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight text-white">{formatCurrency(totalCostOfOwnership)}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
            <span>Base: {formatCurrency(originalTotalCost)}</span>
            <span className="text-emerald-400 font-bold">Saved: {formatCurrency(prepaymentResults.interestSaved)}</span>
          </p>
        </div>

        <StatBox 
          label="Total Interest Saved" 
          value={formatCurrency(prepaymentResults.interestSaved)} 
          colorClass="text-emerald-600 dark:text-emerald-400"
          subValue={prepaymentResults.monthsSaved > 0 ? `${Math.floor(prepaymentResults.monthsSaved / 12)}Y ${prepaymentResults.monthsSaved % 12}M shaved off` : 'Add prepayments to save'}
          icon={<PiggyBank size={16} />}
        />

        <StatBox 
          label="Standard Monthly EMI" 
          value={formatCurrency(emi)} 
          subValue={`Outflow with prepay: ${formatCurrency(totalMonthlyOutflow)}`}
          colorClass="text-indigo-600 dark:text-indigo-400"
          icon={<Wallet size={16} />}
        />

        <StatBox 
          label="Tenure Cut By" 
          value={`${Math.floor(prepaymentResults.monthsSaved / 12)}Y ${prepaymentResults.monthsSaved % 12}M`}
          subValue={`Total interest: ${formatCurrency(prepaymentResults.newTotalInterest)}`}
          colorClass="text-amber-500"
          icon={<CalendarClock size={16} />}
        />
      </div>

      {/* Main Grid: Parameters on Left, Analysis on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Column: Loan & Prepayment Inputs */}
        <div className="lg:col-span-6 space-y-3">
          <Card title="Loan Parameters">
            <div className="space-y-3">
              <InputGroup 
                label="Loan Amount (Principal)" 
                value={amount} 
                onChange={setAmount} 
                min={100000} 
                max={50000000} 
                step={100000} 
                prefix="₹" 
                presets={[2500000, 5000000, 7500000, 10000000]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputGroup 
                  label="Interest Rate (p.a)" 
                  value={rate} 
                  onChange={setRate} 
                  min={1} 
                  max={20} 
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

          <Card title="Prepayment Accelerators" className="bg-indigo-50/20 dark:bg-indigo-900/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputGroup 
                label="Extra Monthly Payment" 
                value={monthlyPrepayment} 
                onChange={setMonthlyPrepayment} 
                min={0} 
                max={200000} 
                step={1000} 
                prefix="₹" 
                presets={[0, 5000, 10000, 20000]}
              />
              <InputGroup 
                label="One-time Lumpsum" 
                value={lumpsumAmount} 
                onChange={setLumpsumAmount} 
                min={0} 
                max={5000000} 
                step={10000} 
                prefix="₹" 
                presets={[0, 100000, 500000]}
              />
            </div>
          </Card>

          <button 
            onClick={handleSave}
            className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold text-xs shadow-xs"
          >
            Add to Comparison Board
          </button>
        </div>

        {/* Right Column: Comparison Bar & Tax Benefit Card */}
        <div className="lg:col-span-6 space-y-3">
          <Card title="Interest Paid Comparison">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: -15, right: 15, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={115} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9', opacity: 0.1}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px', padding: '6px 10px'}}
                    formatter={(val: number) => formatCurrency(val)} 
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ReceiptIndianRupee className="text-emerald-600 dark:text-emerald-400" size={16} />
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Income Tax Deductions (Old Regime)</h4>
              </div>
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded">
                ~{formatCurrency(estimatedTaxSaved)}/yr Saved
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[9px] text-slate-500 uppercase font-bold">Sec 24(b) Interest</p>
                <p className="font-black text-slate-800 dark:text-slate-200 text-xs mt-0.5">{formatCurrency(sec24bEligible)} <span className="text-[9px] text-slate-400 font-normal">/ max ₹2L</span></p>
              </div>
              <div className="p-2 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[9px] text-slate-500 uppercase font-bold">Sec 80C Principal</p>
                <p className="font-black text-slate-800 dark:text-slate-200 text-xs mt-0.5">{formatCurrency(sec80cEligible)} <span className="text-[9px] text-slate-400 font-normal">/ max ₹1.5L</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortisation Schedule Table */}
      <Card 
        title="Yearly Amortisation Schedule" 
        action={
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded text-[11px] font-bold transition-all"
            title="Download CSV breakdown"
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-2 px-2.5">Year</th>
                <th className="py-2 px-2.5">Opening Balance</th>
                <th className="py-2 px-2.5">Principal Paid</th>
                <th className="py-2 px-2.5">Interest Paid</th>
                <th className="py-2 px-2.5">Total Payment</th>
                <th className="py-2 px-2.5 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {displayedSchedule.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-2 px-2.5 font-bold text-slate-900 dark:text-white">Yr {row.year}</td>
                  <td className="py-2 px-2.5 text-slate-600 dark:text-slate-300">{formatCurrency(row.openingBalance)}</td>
                  <td className="py-2 px-2.5 text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(row.principalPaid)}</td>
                  <td className="py-2 px-2.5 text-rose-500 dark:text-rose-400">{formatCurrency(row.interestPaid)}</td>
                  <td className="py-2 px-2.5 text-slate-800 dark:text-slate-200 font-semibold">{formatCurrency(row.totalPaid)}</td>
                  <td className="py-2 px-2.5 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(row.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {amortizationSchedule.length > 5 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <button
              onClick={() => setShowAllYears(!showAllYears)}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 py-1 px-2.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            >
              {showAllYears ? (
                <>
                  <ChevronUp size={14} /> Show First 5 Years
                </>
              ) : (
                <>
                  <ChevronDown size={14} /> Show All {amortizationSchedule.length} Years
                </>
              )}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HomeLoanModule;
