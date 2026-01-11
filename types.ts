
export enum ModuleType {
  HOME_LOAN = 'home_loan',
  SIP = 'sip',
  GOAL_PLANNER = 'goal_planner',
  LUMPSUM = 'lumpsum',
  FD_RD = 'fd_rd',
  PPF_EPF = 'ppf_epf',
  RENT_VS_BUY = 'rent_vs_buy',
  AFFordABILITY = 'affordability',
  BUDGET_PLANNER = 'budget_planner',
  ASSET_ALLOCATION = 'asset_allocation',
  FIRE_CALC = 'fire_calc'
}

export type Theme = 'light' | 'dark';

export interface SavedScenario {
  id: string;
  moduleType: ModuleType;
  title: string;
  timestamp: number;
  data: any;
  summary: {
    label: string;
    value: string;
  }[];
}

export interface CalculationResult {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description?: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}
