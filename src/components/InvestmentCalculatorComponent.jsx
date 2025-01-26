import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ETFs = [
  { symbol: 'SPY', name: 'S&P 500 ETF', avgReturn: 10.5, volatility: 15 },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', avgReturn: 12.5, volatility: 20 },
  { symbol: 'VTI', name: 'Total Stock Market ETF', avgReturn: 10.2, volatility: 14 },
  { symbol: 'AGG', name: 'US Aggregate Bond ETF', avgReturn: 4.5, volatility: 5 },
  { symbol: 'VGK', name: 'European Stock ETF', avgReturn: 8.5, volatility: 16 },
  { symbol: 'EEM', name: 'Emerging Markets ETF', avgReturn: 9.5, volatility: 22 },
];

const generateMonteCarloPath = (initial, monthly, returnRate, volatility, years) => {
  let balance = initial;
  let yearlyData = [];
  let totalContributed = initial;

  for (let year = 0; year <= years; year++) {
    yearlyData.push({
      year,
      balance: balance,
      contributions: totalContributed
    });

    const yearlyContributions = monthly * 12;
    totalContributed += yearlyContributions;
    
    const randomReturn = returnRate + (Math.random() - 0.5) * 2 * volatility / 100;
    const yearlyReturn = (balance + yearlyContributions / 2) * (randomReturn / 100);
    balance = balance + yearlyContributions + yearlyReturn;
  }

  return yearlyData;
};

const InvestmentCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState('10000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [selectedETF, setSelectedETF] = useState('');
  const [investmentLength, setInvestmentLength] = useState('30');
  const [results, setResults] = useState([]);
  const [monteCarloResults, setMonteCarloResults] = useState([]);
  const [finalAmount, setFinalAmount] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showMonteCarlo, setShowMonteCarlo] = useState(false);

  const handleETFChange = (symbol) => {
    if (symbol) {
      const etf = ETFs.find(e => e.symbol === symbol);
      setAnnualReturn(etf.avgReturn.toString());
      setSelectedETF(symbol);
    } else {
      setSelectedETF('');
    }
  };

  const calculateReturns = (includeMonteCarlo = false) => {
    const initial = parseFloat(initialInvestment);
    const monthly = parseFloat(monthlyContribution);
    const returnRate = parseFloat(annualReturn);
    const years = parseFloat(investmentLength);
    const selectedETFData = ETFs.find(e => e.symbol === selectedETF);
    const volatility = selectedETFData ? selectedETFData.volatility : returnRate * 0.5;
    
    let balance = initial;
    let yearlyData = [];
    let totalContributed = initial;

    for (let year = 0; year <= years; year++) {
      yearlyData.push({
        year,
        balance: balance,
        contributions: totalContributed
      });

      const yearlyContributions = monthly * 12;
      totalContributed += yearlyContributions;
      
      const yearlyReturn = (balance + yearlyContributions / 2) * (returnRate / 100);
      balance = balance + yearlyContributions + yearlyReturn;
    }

    setResults(yearlyData);
    setFinalAmount(balance);
    setTotalContributions(totalContributed);
    setTotalEarnings(balance - totalContributed);

    if (includeMonteCarlo) {
      const simulations = [];
      for (let i = 0; i < 5; i++) {
        const path = generateMonteCarloPath(initial, monthly, returnRate, volatility, years);
        path.forEach((point, index) => {
          point[`simulation${i}`] = point.balance;
        });
        simulations.push(path);
      }
      setMonteCarloResults(simulations[0].map((point, i) => ({
        ...point,
        simulation1: simulations[1][i].balance,
        simulation2: simulations[2][i].balance,
        simulation3: simulations[3][i].balance,
        simulation4: simulations[4][i].balance,
      })));
      setShowMonteCarlo(true);
    } else {
      setMonteCarloResults([]);
      setShowMonteCarlo(false);
    }
  };

  useEffect(() => {
    calculateReturns();
  }, [initialInvestment, monthlyContribution, annualReturn, investmentLength]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Initial Investment
            </label>
            <input
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              className="w-full p-2 border rounded text-right"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Monthly Contribution
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              className="w-full p-2 border rounded text-right"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Annual Return (%)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={annualReturn}
                onChange={(e) => {
                  setAnnualReturn(e.target.value);
                  setSelectedETF('');
                }}
                className="w-full p-2 border rounded text-right"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Investment Length (Years)
            </label>
            <input
              type="number"
              value={investmentLength}
              onChange={(e) => setInvestmentLength(e.target.value)}
              className="w-full p-2 border rounded text-right"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select ETF (Optional)
          </label>
          <select
            value={selectedETF}
            onChange={(e) => handleETFChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Custom Return Rate</option>
            {ETFs.map(etf => (
              <option key={etf.symbol} value={etf.symbol}>
                {etf.symbol} - {etf.name} (Avg. {etf.avgReturn}%)
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">Final Amount</div>
            <div className="text-2xl font-bold">{formatCurrency(finalAmount)}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">Total Contributions</div>
            <div className="text-2xl font-bold">{formatCurrency(totalContributions)}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600">Total Earnings</div>
            <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => calculateReturns(!showMonteCarlo)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showMonteCarlo ? 'Hide' : 'Show'} Monte Carlo Simulation
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={showMonteCarlo ? monteCarloResults : results}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'bottom' }} 
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                width={100}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend />
              {!showMonteCarlo && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    name="Portfolio Value" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="contributions" 
                    name="Total Contributions" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                  />
                </>
              )}
              {showMonteCarlo && (
                <>
                  <Line type="monotone" dataKey="simulation0" name="Simulation 1" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="simulation1" name="Simulation 2" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="simulation2" name="Simulation 3" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="simulation3" name="Simulation 4" stroke="#EC4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="simulation4" name="Simulation 5" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="contributions" name="Total Contributions" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;