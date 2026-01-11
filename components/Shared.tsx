
import React from 'react';
import { Share2, ShieldCheck } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white/80 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="font-bold text-slate-700 dark:text-slate-200">{title}</span>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export const InputGroup: React.FC<{ 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number; 
  step?: number;
  suffix?: string;
  prefix?: string;
}> = ({ label, value, onChange, min = 0, max = 100000000, step = 1, suffix, prefix }) => (
  <div className="space-y-2 group">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">{label}</label>
      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{prefix}{value.toLocaleString()}{suffix}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all hover:h-2"
    />
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2 text-sm bg-slate-100/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
    />
  </div>
);

export const StatBox: React.FC<{ label: string; value: string; subValue?: string; colorClass?: string; icon?: React.ReactNode }> = ({ label, value, subValue, colorClass = "text-indigo-600", icon }) => (
  <div className="p-5 bg-white/80 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md relative overflow-hidden group">
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">{label}</p>
        {icon && <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">{icon}</div>}
      </div>
      <p className={`text-2xl font-black ${colorClass} tracking-tight`}>{value}</p>
      {subValue && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium italic">{subValue}</p>}
    </div>
  </div>
);
