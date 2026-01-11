
import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateRentVsBuy, formatCurrency } from '../utils/finance';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine
} from 'recharts';
import { Info, TrendingUp, Home, ArrowRightLeft } from 'lucide-react';

const RentVsBuyModule: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState(8000000);
  const [downPayment, setDownPayment] = useState(1600000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [rentAppreciation, setRentAppreciation] = useState(7);
  const [appreciation, setAppreciation] = useState(5);
  const [investmentReturn, setInvestmentReturn] = useState(10);

  const results = useMemo(() => calculateRentVsBuy(
    propertyPrice, 
    downPayment, 
    loanRate, 
    tenure, 
    monthlyRent, 
    rentAppreciation, 
    appreciation, 
    investmentReturn
  ), [propertyPrice, downPayment, loanRate, tenure, monthlyRent, rentAppreciation, appreciation, investmentReturn]);

  // Generate trajectory data for the chart (0 to 30 years)
  const trajectoryData = useMemo(() => {
    const years = [0, 5, 10, 15, 20, 25, 30];
    return years.map(y => {
      const res = calculateRentVsBuy(
        propertyPrice,
        downPayment,
        loanRate,
        y || 1, // at least 1 year for calc
        monthlyRent,
        rentAppreciation,
        appreciation,
        investmentReturn
      );
      return {
        year: `Year ${y}`,
        buyNetWorth: y === 0 ? downPayment : res.netWorthBuy,
        rentNetWorth: y === 0 ? downPayment : res.netWorthRent,
      };
    });
  }, [propertyPrice, downPayment, loanRate, monthlyRent, rentAppreciation, appreciation, investmentReturn]);

  const breakEvenYear = useMemo(() => {
    for (let i = 1; i <= 30; i++) {
        const res = calculateRentVsBuy(propertyPrice, downPayment, loanRate, i, monthlyRent, rentAppreciation, appreciation, investmentReturn);
        if (res.netWorthBuy > res.netWorthRent) return i;
    }
    return null;
  }, [propertyPrice, downPayment, loanRate, monthlyRent, rentAppreciation, appreciation, investmentReturn]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Buy Scenario">
            <div className="space-y-5">
              <InputGroup label="Property Price" value={propertyPrice} onChange={setPropertyPrice} min={1000000} max={100000000} step={100000} prefix="₹" />
              <InputGroup label="Down Payment" value={downPayment} onChange={setDownPayment} min={100000} max={50000000} step={100000} prefix="₹" />
              <InputGroup label="Property Appreciation (p.a)" value={appreciation} onChange={setAppreciation} min={1} max={15} step={0.5} suffix="%" />
              <InputGroup label="Loan Rate" value={loanRate} onChange={setLoanRate} min={5} max={15} step={0.1} suffix="%" />
            </div>
          </Card>
          
          <Card title="Rent Scenario">
            <div className="space-y-5">
              <InputGroup label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} min={5000} max={500000} step={1000} prefix="₹" />
              <InputGroup label="Yearly Rent Increase" value={rentAppreciation} onChange={setRentAppreciation} min={0} max={20} step={0.5} suffix="%" />
              <InputGroup label="Saved Diff. Return" value={investmentReturn} onChange={setInvestmentReturn} min={1} max={25} step={0.5} suffix="%" />
            </div>
          </Card>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-3">
             <Info className="text-indigo-600 dark:text-indigo-400 shrink-0" size={18} />
             <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                The "Rent" scenario assumes you invest your Down Payment + the monthly difference between EMI and Rent at {investmentReturn}% CAGR.
             </p>
          </div>
        </div>

        {/* Right: Results & Comparison */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatBox 
                label={`Net Worth (Buying) - Yr ${tenure}`} 
                value={formatCurrency(results.netWorthBuy)} 
                colorClass="text-indigo-600 dark:text-indigo-400" 
                subValue={`Asset: ${formatCurrency(results.finalPropertyValue)}`}
            />
            <StatBox 
                label={`Net Worth (Renting) - Yr ${tenure}`} 
                value={formatCurrency(results.netWorthRent)} 
                colorClass="text-rose-500 dark:text-rose-400" 
                subValue="Includes invested principal + savings"
            />
          </div>

          <Card title="Wealth Trajectory: 30 Year Comparison">
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10}} 
                    tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line 
                    name="Buy Path (Net Asset)" 
                    type="monotone" 
                    dataKey="buyNetWorth" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#6366f1' }}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    name="Rent Path (Invested Corpus)" 
                    type="monotone" 
                    dataKey="rentNetWorth" 
                    stroke="#f43f5e" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#f43f5e' }}
                    activeDot={{ r: 6 }} 
                  />
                  {breakEvenYear && tenure > breakEvenYear && (
                    <ReferenceLine x={`Year ${Math.floor(breakEvenYear / 5) * 5}`} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Break-even Zone', fill: '#10b981', fontSize: 10 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-6 rounded-2xl border transition-all ${results.netWorthBuy > results.netWorthRent ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30' : 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30'}`}>
                <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${results.netWorthBuy > results.netWorthRent ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'}`}>
                        {results.netWorthBuy > results.netWorthRent ? <Home size={20} /> : <ArrowRightLeft size={20} />}
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Decision Outcome</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    At the end of {tenure} years, <strong>{results.netWorthBuy > results.netWorthRent ? 'Buying' : 'Renting'}</strong> leads to a higher net worth by 
                    <span className="font-bold mx-1 text-slate-900 dark:text-white">{formatCurrency(Math.abs(results.netWorthBuy - results.netWorthRent))}</span>.
                </p>
            </div>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-lg">
                        <TrendingUp size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Break-even Point</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {breakEvenYear 
                        ? `Buying this property typically becomes more profitable than renting after Year ${breakEvenYear}.` 
                        : "With these settings, Renting remains more financially viable over the entire 30-year period."}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentVsBuyModule;
