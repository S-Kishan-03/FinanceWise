import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { formatCurrency } from '../utils/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Wallet, 
  Coins, 
  Gem, 
  Home, 
  TrendingUp, 
  Activity, 
  Scale,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const AssetAllocationModule: React.FC = () => {
  const [cash, setCash] = useState(500000);
  const [gold, setGold] = useState(200000);
  const [silver, setSilver] = useState(50000);
  const [realEstate, setRealEstate] = useState(5000000);
  const [mutualFunds, setMutualFunds] = useState(1000000);
  const [stocks, setStocks] = useState(750000);

  const assets = useMemo(() => [
    { name: 'Cash / FD', value: cash, color: '#6366f1', icon: Wallet },
    { name: 'Gold', value: gold, color: '#f59e0b', icon: Coins },
    { name: 'Silver', value: silver, color: '#94a3b8', icon: Gem },
    { name: 'Real Estate', value: realEstate, color: '#10b981', icon: Home },
    { name: 'Mutual Funds', value: mutualFunds, color: '#ec4899', icon: Activity },
    { name: 'Stocks', value: stocks, color: '#8b5cf6', icon: TrendingUp },
  ], [cash, gold, silver, realEstate, mutualFunds, stocks]);

  const totalNetWorth = useMemo(() => 
    assets.reduce((sum, asset) => sum + asset.value, 0) || 1, [assets]
  );

  const equityExposure = useMemo(() => 
    ((stocks + mutualFunds) / totalNetWorth) * 100, [stocks, mutualFunds, totalNetWorth]
  );

  const safeExposure = useMemo(() => 
    ((cash + gold + silver) / totalNetWorth) * 100, [cash, gold, silver, totalNetWorth]
  );

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto pb-4">
      {/* Top Row: Sleek Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="sm:col-span-2 p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-900 dark:to-slate-950 rounded-xl border border-slate-800 text-white flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Combined Net Worth</p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              {formatCurrency(totalNetWorth)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Spread across {assets.filter(a => a.value > 0).length} asset classes
            </p>
          </div>
          <div className="hidden sm:block p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
            <Scale size={24} className="text-indigo-300" />
          </div>
        </div>

        <StatBox 
          label="Equity Exposure" 
          value={`${equityExposure.toFixed(1)}%`} 
          subValue={`Stocks + MFs (${formatCurrency(stocks + mutualFunds)})`}
          colorClass={equityExposure > 50 ? "text-indigo-600 dark:text-indigo-400" : "text-amber-500"}
          icon={<TrendingUp size={16} />}
        />

        <StatBox 
          label="Safe / Liquid Assets" 
          value={`${safeExposure.toFixed(1)}%`} 
          subValue={`Cash & Metals (${formatCurrency(cash + gold + silver)})`}
          colorClass="text-emerald-600 dark:text-emerald-400"
          icon={<ShieldCheck size={16} />}
        />
      </div>

      {/* Main Grid: Inputs on Left, Analytics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: 6 Assets in a 2-column compact grid */}
        <div className="lg:col-span-7">
          <Card title="Asset Portfolio Values">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <InputGroup label="Cash & Bank / FD" value={cash} onChange={setCash} min={0} max={10000000} step={10000} prefix="₹" />
              <InputGroup label="Gold" value={gold} onChange={setGold} min={0} max={5000000} step={5000} prefix="₹" />
              <InputGroup label="Silver" value={silver} onChange={setSilver} min={0} max={1000000} step={1000} prefix="₹" />
              <InputGroup label="Real Estate" value={realEstate} onChange={setRealEstate} min={0} max={50000000} step={100000} prefix="₹" />
              <InputGroup label="Mutual Funds" value={mutualFunds} onChange={setMutualFunds} min={0} max={30000000} step={10000} prefix="₹" />
              <InputGroup label="Direct Stocks" value={stocks} onChange={setStocks} min={0} max={30000000} step={10000} prefix="₹" />
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Scale size={14} className="text-indigo-500" />
                Rule of Thumb: (100 - Age)% suggested in equities.
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                Active Portfolio
              </span>
            </div>
          </Card>
        </div>

        {/* Right: Pie Chart and Breakdown + Risk Gauges */}
        <div className="lg:col-span-5 space-y-3.5">
          <Card title="Asset Allocation Breakdown">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assets.filter(a => a.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {assets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => formatCurrency(val)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px', padding: '6px 10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pr-1">
                {assets.map(asset => {
                  const pct = ((asset.value / totalNetWorth) * 100).toFixed(1);
                  return (
                    <div key={asset.name} className="flex items-center justify-between text-xs py-0.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: asset.color }} />
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">{asset.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compact Liquidity & Volatility Risk Meters */}
            <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-slate-500 font-bold uppercase">Liquidity (Cash)</span>
                  <span className="font-bold text-indigo-600">{((cash / totalNetWorth) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${Math.min(100, (cash / totalNetWorth) * 100)}%` }} />
                </div>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-slate-500 font-bold uppercase">Market Equity</span>
                  <span className="font-bold text-rose-500">{equityExposure.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: `${Math.min(100, equityExposure)}%` }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationModule;
