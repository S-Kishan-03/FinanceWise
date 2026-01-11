
import React, { useState, useMemo } from 'react';
import { Card, InputGroup, StatBox } from '../components/Shared';
import { formatCurrency } from '../utils/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  Wallet, 
  Coins, 
  Gem, 
  Home, 
  TrendingUp, 
  Activity, 
  Scale,
  CheckCircle2
} from 'lucide-react';

const AssetAllocationModule: React.FC = () => {
  const [cash, setCash] = useState(500000);
  const [gold, setGold] = useState(200000);
  const [silver, setSilver] = useState(50000);
  const [realEstate, setRealEstate] = useState(5000000);
  const [mutualFunds, setMutualFunds] = useState(1000000);
  const [stocks, setStocks] = useState(750000);

  const assets = useMemo(() => [
    { name: 'Cash/FD', value: cash, color: '#6366f1', icon: Wallet },
    { name: 'Gold', value: gold, color: '#f59e0b', icon: Coins },
    { name: 'Silver', value: silver, color: '#94a3b8', icon: Gem },
    { name: 'Real Estate', value: realEstate, color: '#10b981', icon: Home },
    { name: 'Mutual Funds', value: mutualFunds, color: '#ec4899', icon: Activity },
    { name: 'Stocks', value: stocks, color: '#8b5cf6', icon: TrendingUp },
  ], [cash, gold, silver, realEstate, mutualFunds, stocks]);

  const totalNetWorth = useMemo(() => 
    assets.reduce((sum, asset) => sum + asset.value, 0), [assets]
  );

  const equityExposure = useMemo(() => 
    ((stocks + mutualFunds) / totalNetWorth) * 100, [stocks, mutualFunds, totalNetWorth]
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Inputs */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Current Assets">
            <div className="space-y-5">
              <InputGroup label="Cash & Bank / FD" value={cash} onChange={setCash} min={0} max={10000000} step={10000} prefix="₹" />
              <InputGroup label="Gold" value={gold} onChange={setGold} min={0} max={5000000} step={5000} prefix="₹" />
              <InputGroup label="Silver" value={silver} onChange={setSilver} min={0} max={1000000} step={1000} prefix="₹" />
              <InputGroup label="Real Estate" value={realEstate} onChange={setRealEstate} min={0} max={100000000} step={100000} prefix="₹" />
              <InputGroup label="Mutual Funds" value={mutualFunds} onChange={setMutualFunds} min={0} max={50000000} step={10000} prefix="₹" />
              <InputGroup label="Direct Stocks" value={stocks} onChange={setStocks} min={0} max={50000000} step={10000} prefix="₹" />
            </div>
          </Card>

          <div className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                    <Scale size={20} />
                </div>
                <h4 className="font-bold">Diversification Tip</h4>
             </div>
             <p className="text-xs text-indigo-100 leading-relaxed">
                A common rule of thumb is "100 minus your age" for equity allocation. If you are 30, having 70% in stocks/MFs is considered healthy for growth.
             </p>
          </div>
        </div>

        {/* Results & Visuals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Total Combined Net Worth</p>
                <h3 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white transition-colors">
                    {formatCurrency(totalNetWorth)}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-full text-xs">
                    <CheckCircle2 size={14} />
                    Tracked across {assets.filter(a => a.value > 0).length} asset classes
                </div>
            </div>

            <StatBox 
              label="Equity Exposure" 
              value={`${equityExposure.toFixed(1)}%`} 
              subValue="Stocks + Mutual Funds"
              colorClass={equityExposure > 60 ? "text-indigo-600 dark:text-indigo-400" : "text-amber-500"}
            />
            <StatBox 
              label="Safe Assets" 
              value={`${((cash + gold + silver) / totalNetWorth * 100).toFixed(1)}%`} 
              subValue="Cash + Precious Metals"
            />
          </div>

          <Card title="Allocation Pie Chart">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={assets.filter(a => a.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {assets.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(val: number) => formatCurrency(val)}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                    <h5 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Asset Breakdown</h5>
                    <div className="space-y-2">
                        {assets.map(asset => (
                            <div key={asset.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{asset.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatCurrency(asset.value)}</p>
                                    <p className="text-[10px] text-slate-400">({((asset.value / totalNetWorth) * 100).toFixed(1)}%)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">Liquidity Analysis</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Instant Access (Cash)</span>
                        <span className="font-bold text-indigo-600">{((cash / totalNetWorth) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{ width: `${(cash / totalNetWorth) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 italic">High liquidity is good for emergencies but may lower long-term growth.</p>
                </div>
            </div>
            
            <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">Volatility Risk</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Market Dependent (Equity)</span>
                        <span className="font-bold text-rose-500">{equityExposure.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full" style={{ width: `${equityExposure}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Higher equity means higher potential returns but higher short-term fluctuations.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationModule;
