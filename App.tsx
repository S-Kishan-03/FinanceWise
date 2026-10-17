import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { ModuleType, Theme, SavedScenario } from './types';
import HomeLoanModule from './modules/HomeLoanModule';
import SIPModule from './modules/SIPModule';
import GoalPlannerModule from './modules/GoalPlannerModule';
import LumpsumModule from './modules/LumpsumModule';
import FD_RDModule from './modules/FD_RDModule';
import PPF_EPFModule from './modules/PPF_EPFModule';
import RentVsBuyModule from './modules/RentVsBuyModule';
import AffordabilityModule from './modules/AffordabilityModule';
import BudgetPlannerModule from './modules/BudgetPlannerModule';
import AssetAllocationModule from './modules/AssetAllocationModule';
import FIREModule from './modules/FIREModule';

const App: React.FC = () => {
  const [activeModule, setActiveModuleState] = useState<ModuleType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finwise_active_module') as ModuleType;
      if (saved && Object.values(ModuleType).includes(saved)) {
        return saved;
      }
    }
    return ModuleType.HOME_LOAN;
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('fontSize')) || 100;
    }
    return 100;
  });

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('finwise_saved_scenarios');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved scenarios', e);
      }
    }
    return [];
  });

  const setActiveModule = (mod: ModuleType) => {
    setActiveModuleState(mod);
    localStorage.setItem('finwise_active_module', mod);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem('finwise_saved_scenarios', JSON.stringify(savedScenarios));
    } catch (e) {
      console.error('Failed to save scenarios', e);
    }
  }, [savedScenarios]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.min(Math.max(prev + delta, 80), 140));
  };

  const resetFontSize = () => setFontSize(100);

  const saveScenario = (scenario: Omit<SavedScenario, 'id' | 'timestamp'>) => {
    const newScenario: SavedScenario = {
      ...scenario,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setSavedScenarios(prev => [newScenario, ...prev].slice(0, 5));
  };

  const removeScenario = (id: string) => {
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  };

  const renderModule = () => {
    const props = { onSaveScenario: saveScenario };
    switch (activeModule) {
      case ModuleType.HOME_LOAN: return <HomeLoanModule {...props} />;
      case ModuleType.SIP: return <SIPModule {...props} />;
      case ModuleType.GOAL_PLANNER: return <GoalPlannerModule {...props} />;
      case ModuleType.LUMPSUM: return <LumpsumModule />;
      case ModuleType.FD_RD: return <FD_RDModule />;
      case ModuleType.PPF_EPF: return <PPF_EPFModule />;
      case ModuleType.RENT_VS_BUY: return <RentVsBuyModule {...props} />;
      case ModuleType.AFFordABILITY: return <AffordabilityModule />;
      case ModuleType.BUDGET_PLANNER: return <BudgetPlannerModule />;
      case ModuleType.ASSET_ALLOCATION: return <AssetAllocationModule />;
      case ModuleType.FIRE_CALC: return <FIREModule {...props} />;
      default: return <HomeLoanModule {...props} />;
    }
  };

  const getModuleTitle = () => {
    switch (activeModule) {
      case ModuleType.HOME_LOAN: return "Home Loan EMI & Prepayment Calculator";
      case ModuleType.SIP: return "SIP Investment Returns (Step-Up)";
      case ModuleType.GOAL_PLANNER: return "Financial Goal Planner";
      case ModuleType.LUMPSUM: return "Lumpsum Investment Projection";
      case ModuleType.FD_RD: return "Fixed & Recurring Deposit";
      case ModuleType.PPF_EPF: return "PPF & EPF Estimator";
      case ModuleType.RENT_VS_BUY: return "Rent vs Buy Comparison";
      case ModuleType.AFFordABILITY: return "Affordability Calculator";
      case ModuleType.BUDGET_PLANNER: return "Salary Budget Planner";
      case ModuleType.ASSET_ALLOCATION: return "Asset Allocation Tracker";
      case ModuleType.FIRE_CALC: return "FIRE Calculator";
      default: return "Financial Calculator";
    }
  };

  return (
    <Layout 
      activeModule={activeModule} 
      onModuleChange={setActiveModule}
      theme={theme}
      onToggleTheme={toggleTheme}
      fontSize={fontSize}
      onAdjustFontSize={adjustFontSize}
      onResetFontSize={resetFontSize}
      savedScenarios={savedScenarios}
      onRemoveScenario={removeScenario}
    >
      <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{getModuleTitle()}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Strategic financial planning made simple with Indian market intelligence.</p>
        </div>
      </div>
      {renderModule()}
    </Layout>
  );
};

export default App;
