import React, { useState, useEffect } from 'react';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('100000');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [payment, setPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [showAmortization, setShowAmortization] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const years = parseFloat(loanTerm);

    if (principal > 0 && annualRate > 0 && years > 0) {
      let periods, rate;
      
      if (paymentFrequency === 'weekly') {
        periods = years * 52;
        rate = annualRate / 52;
      } else {
        periods = years * 12;
        rate = annualRate / 12;
      }

      const payment = principal * (rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1);
      const totalPaid = payment * periods;
      
      setPayment(payment);
      setTotalPayment(totalPaid);
      setTotalInterest(totalPaid - principal);

      let balance = principal;
      let schedule = [];

      for (let i = 1; i <= periods; i++) {
        const interest = balance * rate;
        const principalPaid = payment - interest;
        balance -= principalPaid;

        if (i <= 500) { // Limit displayed periods for performance
          schedule.push({
            period: i,
            payment: payment,
            principal: principalPaid,
            interest: interest,
            balance: Math.max(0, balance)
          });
        }
      }

      setAmortizationSchedule(schedule);
    }
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, paymentFrequency]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700">
              Loan Amount
            </label>
            <input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full p-2 border rounded text-right"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              id="interestRate"
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full p-2 border rounded text-right"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700">
              Loan Term (Years)
            </label>
            <input
              id="loanTerm"
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full p-2 border rounded text-right"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700">
              Payment Frequency
            </label>
            <select
              id="paymentFrequency"
              value={paymentFrequency}
              onChange={(e) => setPaymentFrequency(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">{paymentFrequency === 'weekly' ? 'Weekly' : 'Monthly'} Payment</div>
            <div className="text-2xl font-bold">{formatCurrency(payment)}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">Total Payment</div>
            <div className="text-2xl font-bold">{formatCurrency(totalPayment)}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600">Total Interest</div>
            <div className="text-2xl font-bold">{formatCurrency(totalInterest)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={() => setShowAmortization(!showAmortization)}
          className="mb-4 text-blue-500 hover:text-blue-600"
        >
          {showAmortization ? 'Hide Amortization Schedule' : 'Show Amortization Schedule'}
        </button>

        {showAmortization && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {paymentFrequency === 'weekly' ? 'Week' : 'Month'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {amortizationSchedule.map((row) => (
                  <tr key={row.period}>
                    <td className="px-6 py-4 whitespace-nowrap">{row.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(row.payment)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(row.principal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(row.interest)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;