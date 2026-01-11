
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
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.SIP);
  
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

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

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
      case ModuleType.GOAL_PLANNER: return <GoalPlannerModule />;
      case ModuleType.LUMPSUM: return <LumpsumModule />;
      case ModuleType.FD_RD: return <FD_RDModule />;
      case ModuleType.PPF_EPF: return <PPF_EPFModule />;
      case ModuleType.RENT_VS_BUY: return <RentVsBuyModule />;
      case ModuleType.AFFordABILITY: return <AffordabilityModule />;
      case ModuleType.BUDGET_PLANNER: return <BudgetPlannerModule />;
      case ModuleType.ASSET_ALLOCATION: return <AssetAllocationModule />;
      case ModuleType.FIRE_CALC: return <FIREModule />;
      default: return <SIPModule {...props} />;
    }
  };

  const getModuleTitle = () => {
    switch (activeModule) {
      case ModuleType.HOME_LOAN: return "Home Loan EMI Calculator";
      case ModuleType.SIP: return "SIP Investment Returns";
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">{getModuleTitle()}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Strategic financial planning made simple.</p>
      </div>
      {renderModule()}
    </Layout>
  );
};

export default App;
