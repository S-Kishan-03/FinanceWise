
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatIndianWord = (amount: number): string => {
  if (!amount || isNaN(amount) || amount === 0) return '₹0';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `${cr % 1 === 0 ? cr : cr.toFixed(2)} Crore${cr > 1 ? 's' : ''}`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `${l % 1 === 0 ? l : l.toFixed(2)} Lakh${l > 1 ? 's' : ''}`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}k`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export interface YearlyAmortization {
  year: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
}


export const calculateEMI = (principal: number, annualRate: number, tenureYears: number) => {
  const monthlyRate = annualRate / 12 / 100;
  const months = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
};

export interface PrepaymentResult {
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  monthsSaved: number;
  totalPaymentWithPrepayment: number;
}

export const calculatePrepaymentImpact = (
  principal: number,
  annualRate: number,
  tenureYears: number,
  monthlyPrepayment: number = 0,
  lumpsumAmount: number = 0,
  lumpsumMonth: number = 1
): PrepaymentResult => {
  const monthlyRate = annualRate / 12 / 100;
  const originalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, originalMonths)) / (Math.pow(1 + monthlyRate, originalMonths) - 1);
  
  const originalTotalInterest = (emi * originalMonths) - principal;
  
  let balance = principal;
  let currentMonth = 0;
  let totalInterestPaid = 0;
  
  while (balance > 0 && currentMonth < originalMonths) {
    currentMonth++;
    const interestForMonth = balance * monthlyRate;
    let principalForMonth = emi - interestForMonth;
    
    totalInterestPaid += interestForMonth;
    balance -= principalForMonth;
    
    if (balance > 0) balance -= monthlyPrepayment;
    if (currentMonth === lumpsumMonth && balance > 0) balance -= lumpsumAmount;
    if (balance < 0) balance = 0;
  }
  
  const monthsSaved = originalMonths - currentMonth;
  const interestSaved = originalTotalInterest - totalInterestPaid;
  
  return {
    originalTotalInterest,
    newTotalInterest: totalInterestPaid,
    interestSaved,
    monthsSaved: Math.max(0, monthsSaved),
    totalPaymentWithPrepayment: principal + totalInterestPaid
  };
};

export const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  tenureYears: number,
  monthlyPrepayment: number = 0,
  lumpsumAmount: number = 0,
  lumpsumMonth: number = 1
): YearlyAmortization[] => {
  const monthlyRate = annualRate / 12 / 100;
  const originalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, originalMonths)) / (Math.pow(1 + monthlyRate, originalMonths) - 1);

  let balance = principal;
  let currentMonth = 0;
  const schedule: YearlyAmortization[] = [];

  let yearlyOpening = balance;
  let yearlyPrincipalPaid = 0;
  let yearlyInterestPaid = 0;

  while (balance > 0 && currentMonth < originalMonths) {
    currentMonth++;
    const interestForMonth = balance * monthlyRate;
    let principalForMonth = emi - interestForMonth;

    if (principalForMonth > balance) {
      principalForMonth = balance;
    }

    balance -= principalForMonth;
    yearlyInterestPaid += interestForMonth;
    yearlyPrincipalPaid += principalForMonth;

    // Apply monthly prepayment
    if (balance > 0 && monthlyPrepayment > 0) {
      const extra = Math.min(balance, monthlyPrepayment);
      balance -= extra;
      yearlyPrincipalPaid += extra;
    }

    // Apply lumpsum prepayment
    if (currentMonth === lumpsumMonth && balance > 0 && lumpsumAmount > 0) {
      const extra = Math.min(balance, lumpsumAmount);
      balance -= extra;
      yearlyPrincipalPaid += extra;
    }

    if (balance < 0) balance = 0;

    // At end of 12 months or if loan is fully paid off
    if (currentMonth % 12 === 0 || balance === 0) {
      schedule.push({
        year: Math.ceil(currentMonth / 12),
        openingBalance: Math.round(yearlyOpening),
        principalPaid: Math.round(yearlyPrincipalPaid),
        interestPaid: Math.round(yearlyInterestPaid),
        totalPaid: Math.round(yearlyPrincipalPaid + yearlyInterestPaid),
        closingBalance: Math.round(balance),
      });

      yearlyOpening = balance;
      yearlyPrincipalPaid = 0;
      yearlyInterestPaid = 0;
    }
  }

  return schedule;
};

export const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${val}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export const calculateSIP = (monthlyInvestment: number, annualRate: number, years: number, stepUp: number = 0) => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  let totalValue = 0;
  let totalInvested = 0;
  let currentMonthly = monthlyInvestment;
  const data: any[] = [];

  for (let i = 1; i <= months; i++) {
    totalValue = (totalValue + currentMonthly) * (1 + monthlyRate);
    totalInvested += currentMonthly;
    
    if (i % 12 === 0) {
      currentMonthly += currentMonthly * (stepUp / 100);
      data.push({
        year: i / 12,
        invested: Math.round(totalInvested),
        value: Math.round(totalValue),
        wealthGain: Math.round(totalValue - totalInvested)
      });
    }
  }
  return { totalValue, totalInvested, wealthGain: totalValue - totalInvested, yearlyData: data };
};

export const calculateLumpsum = (amount: number, annualRate: number, years: number) => {
  const totalValue = amount * Math.pow(1 + annualRate / 100, years);
  return { totalValue, totalInvested: amount, wealthGain: totalValue - amount };
};

export const calculateGoal = (targetAmount: number, annualRate: number, years: number) => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  const requiredMonthly = (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
  return { requiredMonthly };
};

export const calculateFD = (principal: number, rate: number, years: number) => {
  const n = 4;
  const maturityValue = principal * Math.pow(1 + (rate / 100) / n, n * years);
  return { maturityValue, interestEarned: maturityValue - principal };
};

export const calculateRD = (monthlyAmount: number, rate: number, years: number) => {
  const n = 4;
  const r = rate / 100;
  const months = years * 12;
  let maturityValue = 0;
  for (let i = 1; i <= months; i++) {
    const remainingMonths = months - i + 1;
    const remainingQuarters = remainingMonths / 3;
    maturityValue += monthlyAmount * Math.pow(1 + r / n, remainingQuarters);
  }
  return { maturityValue, totalInvested: monthlyAmount * months, interestEarned: maturityValue - (monthlyAmount * months) };
};

export const calculatePPF = (yearlyContribution: number, rate: number, years: number) => {
  let balance = 0;
  let totalInvested = 0;
  const data = [];
  for (let i = 1; i <= years; i++) {
    totalInvested += yearlyContribution;
    balance = (balance + yearlyContribution) * (1 + rate / 100);
    data.push({ year: i, balance, totalInvested });
  }
  return { maturityValue: balance, totalInvested, interestEarned: balance - totalInvested, yearlyData: data };
};

export const calculateRentVsBuy = (
  propertyPrice: number,
  downPayment: number,
  loanRate: number,
  tenure: number,
  monthlyRent: number,
  rentAppreciation: number,
  propertyAppreciation: number,
  investmentReturn: number
) => {
  const loanPrincipal = propertyPrice - downPayment;
  const { emi } = calculateEMI(loanPrincipal, loanRate, tenure);
  const finalPropertyValue = propertyPrice * Math.pow(1 + propertyAppreciation / 100, tenure);
  const netWorthBuy = finalPropertyValue;

  let investedCapital = downPayment;
  let currentRent = monthlyRent;
  for (let i = 1; i <= tenure; i++) {
    for (let m = 1; m <= 12; m++) {
      const monthlyDiff = emi - currentRent;
      investedCapital = (investedCapital + monthlyDiff) * (1 + (investmentReturn / 100) / 12);
    }
    currentRent *= (1 + rentAppreciation / 100);
  }
  return { netWorthBuy, netWorthRent: investedCapital, finalPropertyValue };
};

export const calculateAffordability = (monthlyIncome: number, existingEMI: number, rate: number, tenure: number) => {
  const maxEMIAllowed = (monthlyIncome * 0.45) - existingEMI;
  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;
  const maxLoan = maxEMIAllowed * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months));
  return { maxLoan: Math.max(0, maxLoan), maxEMI: Math.max(0, maxEMIAllowed) };
};

export const calculateFIRE = (
  monthlyExpenses: number,
  currentSavings: number,
  monthlyContribution: number,
  annualReturn: number,
  inflation: number,
  withdrawalRate: number = 4
) => {
  const swr = withdrawalRate / 100;
  const annualExpenses = monthlyExpenses * 12;
  const fireTargetToday = annualExpenses / swr;
  
  let currentCorpus = currentSavings;
  let currentMonthlyContribution = monthlyContribution;
  let yearsToFire = 0;
  const yearlyData = [];

  // Max 50 years projection
  for (let y = 1; y <= 50; y++) {
    for (let m = 1; m <= 12; m++) {
      currentCorpus = (currentCorpus + currentMonthlyContribution) * (1 + (annualReturn / 100) / 12);
    }
    
    // Adjust monthly contribution for inflation
    currentMonthlyContribution *= (1 + inflation / 100);
    
    const futureExpenses = annualExpenses * Math.pow(1 + inflation / 100, y);
    const fireTargetFuture = futureExpenses / swr;
    
    yearlyData.push({
      year: y,
      corpus: Math.round(currentCorpus),
      target: Math.round(fireTargetFuture)
    });

    if (currentCorpus >= fireTargetFuture && yearsToFire === 0) {
      yearsToFire = y;
    }
  }

  return { fireTargetToday, yearsToFire, yearlyData };
};
