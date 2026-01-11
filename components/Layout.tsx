
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

  return (
    <div className="flex h-screen bg-transparent transition-colors duration-300 overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">FinWise</h1>
            </div>
            {/* Mobile Close Button inside Sidebar */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide pb-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleModuleSelection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeModule === item.id ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30' : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium'}`}
              >
                <item.icon size={20} strokeWidth={activeModule === item.id ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 space-y-3">
             <div className="flex items-center justify-between px-3 py-2 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl">
                <div className="flex gap-1">
                  <button onClick={() => onAdjustFontSize(-10)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-400" title="Decrease Font">
                    <Type size={14} />
                  </button>
                  <button onClick={onResetFontSize} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-400 font-bold text-xs" title="Reset Font">
                    {fontSize}%
                  </button>
                  <button onClick={() => onAdjustFontSize(10)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-400" title="Increase Font">
                    <Type size={18} />
                  </button>
                </div>
                <button 
                  onClick={onToggleTheme}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-400"
                  title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>

              <div className="bg-slate-900 dark:bg-indigo-600 rounded-2xl p-4 text-white shadow-lg">
                <p className="text-[10px] text-indigo-300 dark:text-indigo-100 uppercase font-black tracking-widest mb-1 opacity-80">Intelligence Suite</p>
                <p className="text-sm font-bold">FinWise Pro v1.2</p>
              </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="flex items-center justify-between p-4 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <TrendingUp className="text-white" size={18} />
              </div>
              <span className="font-black text-slate-800 dark:text-white tracking-tight">FinWise</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setComparisonOpen(true)}
              className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
            >
              <Layers size={22} />
              {savedScenarios.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {savedScenarios.length}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          {children}
        </div>

        {isComparisonOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" onClick={() => setComparisonOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl z-[70] shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 tracking-tight">
                  <Layers size={20} className="text-indigo-600" />
                  Comparison Board
                </h3>
                <button onClick={() => setComparisonOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {savedScenarios.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-3xl text-slate-300 dark:text-slate-600">
                      <Layers size={48} />
                    </div>
                    <div>
                      <p className="text-slate-800 dark:text-white font-bold">No saved scenarios</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Save current settings in supported modules for side-by-side analysis.</p>
                    </div>
                  </div>
                ) : (
                  savedScenarios.map((scenario) => (
                    <div key={scenario.id} className="p-5 bg-white/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 relative group shadow-sm backdrop-blur-sm">
                      <button 
                        onClick={() => onRemoveScenario(scenario.id)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                      <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">
                        {scenario.moduleType.replace('_', ' ')}
                      </p>
                      <h4 className="font-black text-slate-900 dark:text-white mb-3 text-base">{scenario.title}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {scenario.summary.map((s, idx) => (
                          <div key={idx} className="bg-white/50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-tight mb-0.5">{s.label}</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white">{s.value}</p>
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
