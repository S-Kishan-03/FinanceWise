import React, { useState } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { calculateSIP, formatCurrency, downloadCSV } from '../utils/finance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ModuleType } from '../types';
import { TrendingUp, Wallet, Landmark, Download, ShieldAlert } from 'lucide-react';

interface SIPModuleProps {
  onSaveScenario?: (scenario: any) => void;
}

const SIPModule: React.FC<SIPModuleProps> = ({ onSaveScenario }) => {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(10);
  const inflationRate = 6.0;

  const { totalValue, totalInvested, wealthGain, yearlyData } = calculateSIP(monthly, rate, years, stepUp);
  const realValue = totalValue / Math.pow(1 + inflationRate / 100, years);

  const handleSave = () => {
    if (onSaveScenario) {
      onSaveScenario({
        moduleType: ModuleType.SIP,
        title: `SIP ${formatCurrency(monthly)} @ ${rate}%`,
        data: { monthly, rate, years, stepUp },
        summary: [
          { label: 'Total Invested', value: formatCurrency(totalInvested) },
          { label: 'Maturity Value', value: formatCurrency(totalValue) },
          { label: 'Wealth Gain', value: formatCurrency(wealthGain) },
          { label: 'Real Value (6% infl.)', value: formatCurrency(realValue) }
        ]
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Year', 'Invested Till Date (₹)', 'Projected Corpus (₹)', 'Wealth Gain (₹)'];
    const rows = yearlyData.map(d => [
      `Year ${d.year}`,
      d.invested,
      d.value,
      d.wealthGain
    ]);
    downloadCSV(`FinWise_SIP_${monthly}_pm_${years}yr_${rate}pct.csv`, headers, rows);
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBox label="Total Invested" value={formatCurrency(totalInvested)} icon={<Wallet size={16} />} />
        <StatBox label="Wealth Multiplier" value={`${(totalValue / totalInvested).toFixed(2)}x`} colorClass="text-emerald-500" icon={<TrendingUp size={16} />} />
        <StatBox label="Final Maturity Value" value={formatCurrency(totalValue)} colorClass="text-indigo-600 dark:text-indigo-400" icon={<Landmark size={16} />} />
        <StatBox 
          label="Today's Real Value" 
          value={formatCurrency(realValue)} 
          subValue="Purchasing power (at 6% inflation)"
          colorClass="text-amber-500"
          icon={<ShieldAlert size={16} />} 
        />
      </div>

      {/* Main Grid: Inputs on Left, Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-5 space-y-3">
          <Card title="Investment Configuration">
            <div className="space-y-3">
              <InputGroup 
                label="Monthly Investment" 
                value={monthly} 
                onChange={setMonthly} 
                min={500} 
                max={1000000} 
                step={500} 
                prefix="₹" 
                presets={[5000, 10000, 25000, 50000]}
              />
              <InputGroup 
                label="Expected CAGR" 
                value={rate} 
                onChange={setRate} 
                min={1} 
                max={30} 
                step={0.5} 
                suffix="%" 
                presets={[10, 12, 14, 15]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputGroup 
                  label="Period" 
                  value={years} 
                  onChange={setYears} 
                  min={1} 
                  max={40} 
                  step={1} 
                  suffix=" Yrs" 
                  presets={[5, 10, 15, 20]}
                />
                <InputGroup 
                  label="Step-up" 
                  value={stepUp} 
                  onChange={setStepUp} 
                  min={0} 
                  max={50} 
                  step={1} 
                  suffix="%" 
                  presets={[0, 5, 10, 15]}
                />
              </div>
            </div>
          </Card>

          <button 
            onClick={handleSave}
            className="w-full py-2.5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold text-xs uppercase tracking-wider shadow-sm"
          >
            Add to Comparison Board
          </button>
        </div>

        <div className="lg:col-span-7">
          <Card 
            title="Compound Growth Trajectory"
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
            <div className="h-64 sm:h-72 w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-5" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `Yr ${val}`} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff', fontSize: '11px', padding: '6px 10px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#sipGrad)" name="Corpus" />
                  <Area type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={1.5} fillOpacity={0} name="Invested" />
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
