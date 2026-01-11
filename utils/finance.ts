
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

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
