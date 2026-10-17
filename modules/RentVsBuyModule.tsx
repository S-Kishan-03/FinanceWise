import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateRentVsBuy, formatCurrency, downloadCSV } from '../utils/finance';
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
import { Info, TrendingUp, Home, ArrowRightLeft, Download } from 'lucide-react';
import { ModuleType } from '../types';

interface RentVsBuyModuleProps {
  onSaveScenario?: (scenario: any) => void;
}

const RentVsBuyModule: React.FC<RentVsBuyModuleProps> = ({ onSaveScenario }) => {
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

  const trajectoryData = useMemo(() => {
    const years = [0, 5, 10, 15, 20, 25, 30];
    return years.map(y => {
      const res = calculateRentVsBuy(
        propertyPrice,
        downPayment,
        loanRate,
        y || 1,
        monthlyRent,
        rentAppreciation,
        appreciation,
        investmentReturn
      );
      return {
        year: `Yr ${y}`,
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

  const handleSave = () => {
    if (onSaveScenario) {
      onSaveScenario({
        moduleType: ModuleType.RENT_VS_BUY,
        title: `Property ${formatCurrency(propertyPrice)} vs Rent ${formatCurrency(monthlyRent)}`,
        data: { propertyPrice, downPayment, loanRate, tenure, monthlyRent },
        summary: [
          { label: 'Winner', value: results.netWorthBuy > results.netWorthRent ? 'Buying' : 'Renting' },
          { label: 'Buy Net Worth', value: formatCurrency(results.netWorthBuy) },
          { label: 'Rent Net Worth', value: formatCurrency(results.netWorthRent) },
          { label: 'Break-even', value: breakEvenYear ? `Year ${breakEvenYear}` : '30+ Years' }
        ]
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Timeline', 'Buy Net Worth (₹)', 'Rent Net Worth (₹)'];
    const rows = trajectoryData.map(d => [
      d.year,
      Math.round(d.buyNetWorth),
      Math.round(d.rentNetWorth)
    ]);
    downloadCSV(`FinWise_RentVsBuy_${propertyPrice}_vs_Rent_${monthlyRent}.csv`, headers, rows);
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBox 
          label={`Net Worth (Buying) - Yr ${tenure}`} 
          value={formatCurrency(results.netWorthBuy)} 
          colorClass="text-indigo-600 dark:text-indigo-400" 
          subValue={`Asset value: ${formatCurrency(results.finalPropertyValue)}`}
          icon={<Home size={16} />}
        />
        <StatBox 
          label={`Net Worth (Renting) - Yr ${tenure}`} 
          value={formatCurrency(results.netWorthRent)} 
          colorClass="text-rose-500 dark:text-rose-400" 
          subValue="Invested down payment + monthly savings"
          icon={<ArrowRightLeft size={16} />}
        />
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${results.netWorthBuy > results.netWorthRent ? 'bg-indigo-50/70 border-indigo-200/60 dark:bg-indigo-950/20 dark:border-indigo-900/40' : 'bg-rose-50/70 border-rose-200/60 dark:bg-rose-950/20 dark:border-rose-900/40'}`}>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Decision Winner</p>
          <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {results.netWorthBuy > results.netWorthRent ? 'Buying Property' : 'Renting + Investing'}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            Higher by {formatCurrency(Math.abs(results.netWorthBuy - results.netWorthRent))}
          </p>
        </div>
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl flex flex-col justify-between">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Break-Even Milestone</p>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {breakEvenYear ? `Year ${breakEvenYear}` : "30+ Years (Rent Wins)"}
          </p>
          <p className="text-[10px] text-slate-500 font-medium truncate">
            {breakEvenYear ? 'When buying overtakes rent' : 'Renting stays more profitable'}
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-5 space-y-3">
          <Card title="Buy Scenario">
            <div className="space-y-2.5">
              <InputGroup 
                label="Property Price" 
                value={propertyPrice} 
                onChange={setPropertyPrice} 
                min={1000000} 
                max={50000000} 
                step={100000} 
                prefix="₹" 
                presets={[5000000, 7500000, 10000000]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <InputGroup 
                  label="Down Payment" 
                  value={downPayment} 
                  onChange={setDownPayment} 
                  min={100000} 
                  max={25000000} 
                  step={100000} 
                  prefix="₹" 
                  presets={[1000000, 2000000]}
                />
                <InputGroup label="Appreciation (p.a)" value={appreciation} onChange={setAppreciation} min={1} max={15} step={0.5} suffix="%" />
              </div>
            </div>
          </Card>
          
          <Card title="Rent Scenario">
            <div className="space-y-2.5">
              <InputGroup 
                label="Monthly Rent" 
                value={monthlyRent} 
                onChange={setMonthlyRent} 
                min={5000} 
                max={500000} 
                step={1000} 
                prefix="₹" 
                presets={[15000, 25000, 35000]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <InputGroup label="Rent Hike %" value={rentAppreciation} onChange={setRentAppreciation} min={0} max={20} step={0.5} suffix="%" />
                <InputGroup label="Diff. Return %" value={investmentReturn} onChange={setInvestmentReturn} min={1} max={25} step={0.5} suffix="%" />
              </div>
            </div>
          </Card>

          <button 
            onClick={handleSave}
            className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold text-xs shadow-xs"
          >
            Add to Comparison Board
          </button>
        </div>

        <div className="lg:col-span-7">
          <Card 
            title="30-Year Wealth Trajectory"
            action={
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded text-[11px] font-bold transition-all"
                title="Download CSV"
              >
                <Download size={12} />
                <span>Export CSV</span>
              </button>
            }
          >
            <div className="h-64 sm:h-72 w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10}} 
                    tickFormatter={(val) => `₹${(val / 10000000).toFixed(0)}Cr`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff', fontSize: '11px', padding: '6px 10px' }}
                  />
                  <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Line 
                    name="Buy Path (Net Asset)" 
                    type="monotone" 
                    dataKey="buyNetWorth" 
                    stroke="#6366f1" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: '#6366f1' }}
                    activeDot={{ r: 5 }} 
                  />
                  <Line 
                    name="Rent Path (Invested Corpus)" 
                    type="monotone" 
                    dataKey="rentNetWorth" 
                    stroke="#f43f5e" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: '#f43f5e' }}
                    activeDot={{ r: 5 }} 
                  />
                  {breakEvenYear && tenure > breakEvenYear && (
                    <ReferenceLine x={`Yr ${Math.floor(breakEvenYear / 5) * 5}`} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Break-even', fill: '#10b981', fontSize: 10 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RentVsBuyModule;
