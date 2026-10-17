import React from 'react';
import { formatIndianWord } from '../utils/finance';

export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  title?: string; 
  action?: React.ReactNode;
  noPadding?: boolean;
}> = ({ children, className = '', title, action, noPadding = false }) => (
  <div className={`bg-gradient-to-b from-white/95 via-white/90 to-slate-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/90 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all duration-200 backdrop-blur-md ${className}`}>
    {title && (
      <div className="px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50/80 via-indigo-50/25 to-slate-50/60 dark:from-slate-900/80 dark:to-slate-900/40">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">{title}</span>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className={noPadding ? '' : 'p-3.5 md:p-4'}>{children}</div>
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
  presets?: number[];
  showInWords?: boolean;
  compact?: boolean;
}> = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100000000, 
  step = 1, 
  suffix, 
  prefix, 
  presets, 
  showInWords = true,
  compact = false 
}) => {
  const isRupee = prefix === '₹';
  const verbalWord = (showInWords && isRupee && value >= 1000) ? formatIndianWord(value) : null;

  return (
    <div className="space-y-1.5 group">
      <div className="flex justify-between items-center text-xs">
        <label className="font-semibold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
          {label}
        </label>
        <div className="flex items-center gap-1.5 shrink-0">
          {verbalWord && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 rounded border border-indigo-200/60 dark:border-indigo-900/40 shadow-2xs">
              {verbalWord}
            </span>
          )}
          <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
            {prefix}{value.toLocaleString('en-IN')}{suffix}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all hover:h-2"
        />

        <div className="w-24 sm:w-28 shrink-0">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-7 px-2 text-xs font-bold text-right bg-white/80 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all shadow-2xs"
          />
        </div>
      </div>

      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {presets.map((preset) => {
            const isSelected = value === preset;
            const labelText = isRupee ? formatIndianWord(preset) : `${preset}${suffix || ''}`;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-all ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-transparent'
                }`}
              >
                {labelText}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const StatBox: React.FC<{ 
  label: string; 
  value: string; 
  subValue?: string; 
  colorClass?: string; 
  icon?: React.ReactNode;
  compact?: boolean;
}> = ({ label, value, subValue, colorClass = "text-indigo-600", icon, compact = false }) => {
  const getGradientThemes = () => {
    if (colorClass.includes('emerald') || colorClass.includes('teal')) {
      return 'bg-gradient-to-br from-white/95 via-emerald-50/40 to-teal-50/20 border-emerald-200/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 dark:border-emerald-900/40';
    }
    if (colorClass.includes('indigo') || colorClass.includes('blue')) {
      return 'bg-gradient-to-br from-white/95 via-indigo-50/40 to-blue-50/20 border-indigo-200/70 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 dark:border-indigo-900/40';
    }
    if (colorClass.includes('amber') || colorClass.includes('orange')) {
      return 'bg-gradient-to-br from-white/95 via-amber-50/40 to-orange-50/20 border-amber-200/70 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 dark:border-amber-900/40';
    }
    if (colorClass.includes('rose') || colorClass.includes('red')) {
      return 'bg-gradient-to-br from-white/95 via-rose-50/40 to-red-50/20 border-rose-200/70 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/30 dark:border-rose-900/40';
    }
    return 'bg-gradient-to-br from-white/95 via-slate-50/60 to-indigo-50/20 border-slate-200/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/40 dark:border-slate-800';
  };

  return (
    <div className={`p-3 rounded-xl border shadow-xs transition-all relative overflow-hidden group backdrop-blur-xs ${getGradientThemes()}`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          {icon && <div className="text-slate-400 group-hover:text-indigo-500 transition-colors scale-90">{icon}</div>}
        </div>
        <p className={`text-lg sm:text-xl font-black ${colorClass} tracking-tight leading-tight`}>{value}</p>
        {subValue && <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium italic truncate">{subValue}</p>}
      </div>
    </div>
  );
};
