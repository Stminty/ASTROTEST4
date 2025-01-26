import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [activeTab, setActiveTab] = useState("summary");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const calculateAmortizationSchedule = (principal, monthlyRate, months, monthlyPay) => {
    let balance = principal;
    let schedule = [];
    let totalInterestPaid = 0;
    
    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPay - interestPayment;
      
      totalInterestPaid += interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month,
        payment: monthlyPay,
        principalPayment,
        interestPayment,
        totalInterestPaid,
        remainingBalance: balance > 0 ? balance : 0,
      });
    }
    
    return schedule;
  };

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount) - (parseFloat(downPayment) || 0);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const months = parseFloat(loanTerm) * 12;

    if (principal > 0 && annualRate > 0 && months > 0) {
      const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                     (Math.pow(1 + monthlyRate, months) - 1);
      const total = monthly * months;
      const totalInt = total - principal;
      
      setMonthlyPayment(monthly);
      setTotalPayment(total);
      setTotalInterest(totalInt);
      setAmortizationSchedule(calculateAmortizationSchedule(principal, monthlyRate, months, monthly));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const paymentBreakdown = [
    { name: 'Principal', value: loanAmount ? parseFloat(loanAmount) - (parseFloat(downPayment) || 0) : 0 },
    { name: 'Interest', value: totalInterest || 0 }
  ];

  const COLORS = ['#3B82F6', '#EF4444'];

  return (
    <Card className="mx-auto max-w-4xl">
      <CardContent className="p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 -mx-6 -mt-6 mb-6 p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white mb-2">Mortgage Calculator</h2>
          <p className="text-blue-100">Calculate your monthly mortgage payments</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loan Amount ($)</label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Down Payment ($)</label>
              <Input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="Enter down payment"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Annual Interest Rate (%)</label>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter interest rate"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Loan Term (Years)</label>
              <Input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="Enter loan term"
              />
            </div>
          </div>

          <Button 
            onClick={calculateMortgage}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Calculate Mortgage
          </Button>

          {monthlyPayment && (
            <div className="mt-8">
              <Tabs className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger 
                    active={activeTab === "summary"}
                    onClick={() => handleTabChange("summary")}
                    className={activeTab === "summary" ? "bg-white" : ""}
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    active={activeTab === "charts"}
                    onClick={() => handleTabChange("charts")}
                    className={activeTab === "charts" ? "bg-white" : ""}
                  >
                    Charts
                  </TabsTrigger>
                  <TabsTrigger 
                    active={activeTab === "schedule"}
                    onClick={() => handleTabChange("schedule")}
                    className={activeTab === "schedule" ? "bg-white" : ""}
                  >
                    Amortization
                  </TabsTrigger>
                </TabsList>

                <TabsContent active={activeTab === "summary"} className={activeTab !== "summary" ? "hidden" : ""}>
                  <Card>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Monthly Payment</h3>
                        <p className="text-3xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Payment</h3>
                        <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalPayment)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Interest</h3>
                        <p className="text-3xl font-bold text-red-500">{formatCurrency(totalInterest)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Principal Amount</h3>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatCurrency(parseFloat(loanAmount) - (parseFloat(downPayment) || 0))}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent active={activeTab === "charts"} className={activeTab !== "charts" ? "hidden" : ""}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64">
                          <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">
                            Payment Breakdown
                          </h3>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={paymentBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {paymentBreakdown.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="h-64">
                          <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">
                            Balance Over Time
                          </h3>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={amortizationSchedule.filter((_, index) => index % 12 === 0)}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip formatter={(value) => formatCurrency(value)} />
                              <Bar dataKey="remainingBalance" fill="#3B82F6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent active={activeTab === "schedule"} className={activeTab !== "schedule" ? "hidden" : ""}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Month</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Payment</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Principal</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Interest</th>
                              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {amortizationSchedule.map((row) => (
                              <tr key={row.month} className="border-b">
                                <td className="p-4">{row.month}</td>
                                <td className="p-4">{formatCurrency(row.payment)}</td>
                                <td className="p-4">{formatCurrency(row.principalPayment)}</td>
                                <td className="p-4">{formatCurrency(row.interestPayment)}</td>
                                <td className="p-4">{formatCurrency(row.remainingBalance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator;