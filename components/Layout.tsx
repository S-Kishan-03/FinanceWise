import React, { useState } from 'react';
import { ModuleType, Theme, SavedScenario } from '../types';
import { 
  Home, 
  TrendingUp, 
  Target, 
  Wallet, 
  ShieldCheck, 
  Calculator, 
  ArrowLeftRight, 
  CircleDollarSign,
  Menu,
  X,
  Sun,
  Moon,
  Layers,
  Trash2,
  PieChart,
  Type,
  Briefcase,
  Flame
} from 'lucide-react';

interface LayoutProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  children: React.ReactNode;
  theme: Theme;
  onToggleTheme: () => void;
  fontSize: number;
  onAdjustFontSize: (delta: number) => void;
  onResetFontSize: () => void;
  savedScenarios: SavedScenario[];
  onRemoveScenario: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  activeModule, 
  onModuleChange, 
  children, 
  theme, 
  onToggleTheme, 
  fontSize,
  onAdjustFontSize,
  onResetFontSize,
  savedScenarios,
  onRemoveScenario
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isComparisonOpen, setComparisonOpen] = useState(false);

  const navItems = [
    { id: ModuleType.SIP, label: 'SIP Calculator', icon: TrendingUp },
    { id: ModuleType.HOME_LOAN, label: 'Home Loan EMI', icon: Home },
    { id: ModuleType.FIRE_CALC, label: 'FIRE Calculator', icon: Flame },
    { id: ModuleType.BUDGET_PLANNER, label: 'Budget Planner', icon: PieChart },
    { id: ModuleType.ASSET_ALLOCATION, label: 'Asset Allocation', icon: Briefcase },
    { id: ModuleType.FD_RD, label: 'FD / RD Returns', icon: Calculator },
    { id: ModuleType.PPF_EPF, label: 'PPF / EPF Growth', icon: ShieldCheck },
    { id: ModuleType.LUMPSUM, label: 'Lumpsum Returns', icon: CircleDollarSign },
    { id: ModuleType.GOAL_PLANNER, label: 'Goal Planner', icon: Target },
    { id: ModuleType.AFFordABILITY, label: 'Affordability', icon: Wallet },
    { id: ModuleType.RENT_VS_BUY, label: 'Rent vs Buy', icon: ArrowLeftRight },
  ];

  const handleModuleSelection = (id: ModuleType) => {
    onModuleChange(id);
    setSidebarOpen(false);
  };

  const currentNav = navItems.find(item => item.id === activeModule);

  return (
    <div className="flex h-screen bg-transparent transition-colors duration-300 overflow-hidden text-slate-800 dark:text-slate-100">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sleek, Compact Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 lg:w-64 bg-gradient-to-b from-white/95 via-slate-50/95 to-indigo-50/30 dark:from-slate-900/95 dark:via-slate-900/95 dark:to-slate-950/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/60 transform transition-transform duration-250 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                <TrendingUp className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none">FinWise</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Financial Suite</p>
              </div>
            </div>
            {/* Mobile Close Button inside Sidebar */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
          
          <nav className="flex-1 px-2.5 py-2.5 space-y-0.5 overflow-y-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleModuleSelection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold'
                  }`}
                >
                  <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-100 dark:border-slate-800/50 space-y-2">
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg">
              <div className="flex items-center gap-1">
                <button onClick={() => onAdjustFontSize(-10)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="Decrease Font">
                  <Type size={12} />
                </button>
                <button onClick={onResetFontSize} className="px-1.5 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400 font-bold text-[10px]" title="Reset Font">
                  {fontSize}%
                </button>
                <button onClick={() => onAdjustFontSize(10)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="Increase Font">
                  <Type size={15} />
                </button>
              </div>
              <button 
                onClick={onToggleTheme}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-400"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>

            <div className="bg-slate-900 dark:bg-slate-800/80 rounded-xl px-3 py-2 text-white flex items-center justify-between">
              <div>
                <p className="text-[9px] text-indigo-300 uppercase font-black tracking-wider leading-none">FinWise Pro</p>
                <p className="text-[11px] font-bold text-slate-300 mt-0.5">India Edition</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-12 flex items-center justify-between px-4 md:px-6 bg-gradient-to-r from-white/90 via-slate-50/85 to-indigo-50/30 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-900/50 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/50 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            {currentNav && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{currentNav.label}</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Real-time Simulation
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setComparisonOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-xs font-bold transition-all border border-slate-200/60 dark:border-slate-700/60"
            >
              <Layers size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span>Comparison Board</span>
              {savedScenarios.length > 0 && (
                <span className="w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {savedScenarios.length}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3 md:px-6 md:py-4 scroll-smooth">
          {children}
        </div>

        {isComparisonOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" onClick={() => setComparisonOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl z-[70] shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-250">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 tracking-tight">
                  <Layers size={18} className="text-indigo-600" />
                  Comparison Board
                </h3>
                <button onClick={() => setComparisonOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {savedScenarios.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-300 dark:text-slate-600">
                      <Layers size={36} />
                    </div>
                    <div>
                      <p className="text-slate-800 dark:text-white font-bold text-sm">No saved scenarios</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click "Add to Comparison Board" in calculators to compare outcomes.</p>
                    </div>
                  </div>
                ) : (
                  savedScenarios.map((scenario) => (
                    <div key={scenario.id} className="p-4 bg-white/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 relative group shadow-xs">
                      <button 
                        onClick={() => onRemoveScenario(scenario.id)}
                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-500 opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                      <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-0.5">
                        {scenario.moduleType.replace('_', ' ')}
                      </p>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs pr-6">{scenario.title}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {scenario.summary.map((s, idx) => (
                          <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/40">
                            <p className="text-[8px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tight mb-0.5">{s.label}</p>
                            <p className="text-xs font-black text-slate-900 dark:text-white">{s.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Layout;
