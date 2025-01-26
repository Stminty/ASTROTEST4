import React, { useState } from 'react';

const PercentageCalculator = () => {
  const [basicValue1, setBasicValue1] = useState('');
  const [basicValue2, setBasicValue2] = useState('');
  const [basicResult, setBasicResult] = useState('');
  const [commonValue1, setCommonValue1] = useState('');
  const [commonValue2, setCommonValue2] = useState('');
  const [commonResult, setCommonResult] = useState('');
  const [calculation, setCalculation] = useState('');
  const [diffValue1, setDiffValue1] = useState('');
  const [diffValue2, setDiffValue2] = useState('');
  const [diffResult, setDiffResult] = useState('');
  const [changeValue1, setChangeValue1] = useState('');
  const [changeValue2, setChangeValue2] = useState('');
  const [changeResult, setChangeResult] = useState('');
  const [changeDirection, setChangeDirection] = useState('increase');
  const [whatIsValue1, setWhatIsValue1] = useState('');
  const [whatIsValue2, setWhatIsValue2] = useState('');
  const [whatIsResult, setWhatIsResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showExplanation, setShowExplanation] = useState({});

  const addToHistory = (calc) => {
    setHistory(prevHistory => [calc, ...prevHistory.slice(0, 9)]);
  };

  const calculateBasic = () => {
    const val1 = parseFloat(basicValue1);
    const val2 = parseFloat(basicValue2);
    if (!isNaN(val1) && !isNaN(val2)) {
      const result = (val1 * val2 / 100).toFixed(2);
      setBasicResult(result);
      addToHistory(`${val1}% of ${val2} = ${result}`);
    }
  };

  const calculateCommon = () => {
    const val1 = parseFloat(commonValue1);
    const val2 = parseFloat(commonValue2);
    if (!isNaN(val1) && !isNaN(val2)) {
      const result = ((val1 / val2) * 100).toFixed(2);
      setCommonResult(result);
      addToHistory(`${val1} is ${result}% of ${val2}`);
    }
  };

  const calculateDifference = () => {
    const val1 = parseFloat(diffValue1);
    const val2 = parseFloat(diffValue2);
    if (!isNaN(val1) && !isNaN(val2)) {
      const result = Math.abs(((val2 - val1) / val1) * 100).toFixed(2);
      setDiffResult(result);
      addToHistory(`Difference between ${val1} and ${val2} is ${result}%`);
    }
  };

  const calculateChange = () => {
    const val1 = parseFloat(changeValue1);
    const val2 = parseFloat(changeValue2);
    if (!isNaN(val1) && !isNaN(val2)) {
      const result = changeDirection === 'increase' 
        ? val1 * (1 + val2/100)
        : val1 * (1 - val2/100);
      setChangeResult(result.toFixed(2));
      addToHistory(`${val1} ${changeDirection}d by ${val2}% = ${result.toFixed(2)}`);
    }
  };

  const calculateWhatIs = () => {
    const val1 = parseFloat(whatIsValue1);
    const val2 = parseFloat(whatIsValue2);
    if (!isNaN(val1) && !isNaN(val2)) {
      const result = ((val1 * 100) / val2).toFixed(2);
      setWhatIsResult(result);
      addToHistory(`${val1} as a % of ${val2} = ${result}%`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Basic Calculator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Basic Percentage Calculator</h3>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={basicValue1}
            onChange={(e) => setBasicValue1(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="Value"
          />
          <span>% of</span>
          <input
            type="number"
            value={basicValue2}
            onChange={(e) => setBasicValue2(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="Value"
          />
          <button
            onClick={() => {
              calculateBasic();
              setShowExplanation({...showExplanation, basic: true});
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Calculate
          </button>
          {basicResult && (
            <div>
              <div className="text-lg">= {basicResult}</div>
              {showExplanation.basic && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-2">Formula: (Percentage × Value) ÷ 100</p>
                  <p className="text-sm text-gray-600">Working: ({basicValue1} × {basicValue2}) ÷ 100 = {basicResult}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Common Phrases Calculator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">What is the percentage?</h3>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={commonValue1}
            onChange={(e) => setCommonValue1(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="Value 1"
          />
          <span>is what % of</span>
          <input
            type="number"
            value={commonValue2}
            onChange={(e) => setCommonValue2(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="Value 2"
          />
          <button
            onClick={() => {
              calculateCommon();
              setShowExplanation({...showExplanation, common: true});
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Calculate
          </button>
          {commonResult && (
            <div>
              <div className="text-lg">= {commonResult}%</div>
              {showExplanation.common && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-2">Formula: (Value1 ÷ Value2) × 100</p>
                  <p className="text-sm text-gray-600">Working: ({commonValue1} ÷ {commonValue2}) × 100 = {commonResult}%</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Percentage Difference Calculator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Percentage Difference Calculator</h3>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={diffValue1}
            onChange={(e) => setDiffValue1(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="Value 1"
          />
          <input
            type="number"
            value={diffValue2}
            onChange={(e) => setDiffValue2(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="Value 2"
          />
          <button
            onClick={() => {
              calculateDifference();
              setShowExplanation({...showExplanation, diff: true});
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Calculate
          </button>
          {diffResult && (
            <div>
              <div className="text-lg">= {diffResult}%</div>
              {showExplanation.diff && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-2">Formula: |Value2 - Value1| ÷ Value1 × 100</p>
                  <p className="text-sm text-gray-600">Working: |{diffValue2} - {diffValue1}| ÷ {diffValue1} × 100 = {diffResult}%</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Percentage Change Calculator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Percentage Change Calculator</h3>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={changeValue1}
            onChange={(e) => setChangeValue1(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="Original"
          />
          <select 
            value={changeDirection}
            onChange={(e) => setChangeDirection(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </select>
          <input
            type="number"
            value={changeValue2}
            onChange={(e) => setChangeValue2(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="%"
          />
          <span>%</span>
          <button
            onClick={() => {
              calculateChange();
              setShowExplanation({...showExplanation, change: true});
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Calculate
          </button>
          {changeResult && (
            <div>
              <div className="text-lg">= {changeResult}</div>
              {showExplanation.change && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-2">
                    Formula: Value × (1 {changeDirection === 'increase' ? '+' : '-'} Percentage/100)
                  </p>
                  <p className="text-sm text-gray-600">
                    Working: {changeValue1} × (1 {changeDirection === 'increase' ? '+' : '-'} {changeValue2}/100) = {changeResult}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* What is Calculator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">What is a Number as a Percentage of Another</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span>What is</span>
          <input
            type="number"
            value={whatIsValue1}
            onChange={(e) => setWhatIsValue1(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="Value"
          />
          <span>as a % of</span>
          <input
            type="number"
            value={whatIsValue2}
            onChange={(e) => setWhatIsValue2(e.target.value)}
            className="w-24 p-2 border rounded"
            placeholder="Value"
          />
          <button
            onClick={() => {
              calculateWhatIs();
              setShowExplanation({...showExplanation, whatIs: true});
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Calculate
          </button>
          {whatIsResult && (
            <div>
              <div className="text-lg">= {whatIsResult}%</div>
              {showExplanation.whatIs && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-2">Formula: (Value1 ÷ Value2) × 100</p>
                  <p className="text-sm text-gray-600">Working: ({whatIsValue1} ÷ {whatIsValue2}) × 100 = {whatIsResult}%</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Calculations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Recent Calculations</h3>
        <div className="max-h-40 overflow-y-auto">
          {history.map((calc, index) => (
            <div key={index} className="text-sm text-gray-600 py-1 border-b">
              {calc}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PercentageCalculator;