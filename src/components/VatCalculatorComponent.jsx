import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const VATCalculator = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [amount, setAmount] = useState('');
  const [vatRate, setVatRate] = useState('20'); // Default UK VAT rate
  const [calculationType, setCalculationType] = useState('addVAT'); // 'addVAT' or 'removeVAT'
  const [results, setResults] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const calculateVAT = () => {
    const baseAmount = parseFloat(amount);
    const rate = parseFloat(vatRate) / 100;

    if (baseAmount > 0 && rate > 0) {
      if (calculationType === 'addVAT') {
        const vatAmount = baseAmount * rate;
        const totalAmount = baseAmount + vatAmount;
        setResults({
          baseAmount,
          vatAmount,
          totalAmount,
          type: 'addVAT'
        });
      } else {
        // Remove VAT (work backwards)
        const baseAmount = parseFloat(amount) / (1 + rate);
        const vatAmount = parseFloat(amount) - baseAmount;
        setResults({
          baseAmount,
          vatAmount,
          totalAmount: parseFloat(amount),
          type: 'removeVAT'
        });
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getChartData = () => {
    if (!results) return [];
    return [
      { name: 'Net Amount', value: results.baseAmount },
      { name: 'VAT', value: results.vatAmount }
    ];
  };

  const COLORS = ['#3B82F6', '#EF4444'];

  return (
    <Card className="mx-auto max-w-4xl">
      <CardContent className="p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 -mx-6 -mt-6 mb-6 p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white mb-2">VAT Calculator</h2>
          <p className="text-blue-100">Calculate VAT for your transactions</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (£)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">VAT Rate (%)</label>
              <Input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                placeholder="Enter VAT rate"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => {
                setCalculationType('addVAT');
                setTimeout(calculateVAT, 0);
              }}
              className={`flex-1 ${calculationType === 'addVAT' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              Add VAT
            </Button>
            <Button 
              onClick={() => {
                setCalculationType('removeVAT');
                setTimeout(calculateVAT, 0);
              }}
              className={`flex-1 ${calculationType === 'removeVAT' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              Remove VAT
            </Button>
          </div>

          {results && (
            <div className="mt-8">
              <Tabs className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger 
                    active={activeTab === "summary"}
                    onClick={() => handleTabChange("summary")}
                    className={activeTab === "summary" ? "bg-white" : ""}
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    active={activeTab === "breakdown"}
                    onClick={() => handleTabChange("breakdown")}
                    className={activeTab === "breakdown" ? "bg-white" : ""}
                  >
                    Breakdown
                  </TabsTrigger>
                </TabsList>

                <TabsContent 
                  active={activeTab === "summary"} 
                  className={activeTab !== "summary" ? "hidden" : ""}
                >
                  <Card>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Net Amount</h3>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatCurrency(results.baseAmount)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">VAT Amount</h3>
                        <p className="text-3xl font-bold text-red-500">
                          {formatCurrency(results.vatAmount)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Gross Amount</h3>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(results.totalAmount)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent 
                  active={activeTab === "breakdown"} 
                  className={activeTab !== "breakdown" ? "hidden" : ""}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64">
                          <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">
                            Amount Breakdown
                          </h3>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getChartData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {getChartData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Calculation Details</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              VAT Rate: {vatRate}%
                            </p>
                            <p className="text-sm text-gray-600">
                              {calculationType === 'addVAT' 
                                ? 'VAT was added to the net amount'
                                : 'VAT was removed from the gross amount'}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Breakdown</h3>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="text-gray-600">Net Amount:</span>
                                <span className="float-right font-medium">{formatCurrency(results.baseAmount)}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-600">VAT Amount:</span>
                                <span className="float-right font-medium">{formatCurrency(results.vatAmount)}</span>
                              </p>
                              <div className="border-t pt-2 mt-2">
                                <p className="text-sm font-medium">
                                  <span className="text-gray-800">Gross Amount:</span>
                                  <span className="float-right">{formatCurrency(results.totalAmount)}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
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

export default VATCalculator;