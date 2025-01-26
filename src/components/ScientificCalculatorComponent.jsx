import React, { useState, useEffect, useCallback } from 'react';
import { evaluate } from 'mathjs';

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [angleUnit, setAngleUnit] = useState('deg'); // deg or rad
  const [shift, setShift] = useState(false);

  const handleNumber = (num) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
    setEquation(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op) => {
    setDisplay(op);
    setEquation(prev => prev + op);
  };

  const handleFunction = (func) => {
    if (shift) {
      switch(func) {
        case 'sin': func = 'asin'; break;
        case 'cos': func = 'acos'; break;
        case 'tan': func = 'atan'; break;
        case 'log': func = '10^'; break;
        case 'ln': func = 'e^'; break;
      }
      setShift(false);
    }
    
    // Handle trig functions with proper angle conversion
    const angleConversion = angleUnit === 'deg' ? '* pi/180' : '';
    
    switch(func) {
      case 'sin':
      case 'cos':
      case 'tan':
        setEquation(prev => `${func}((${prev})${angleConversion})`);
        break;
      case 'asin':
      case 'acos':
      case 'atan':
        setEquation(prev => `(${func}(${prev})${angleUnit === 'deg' ? ' * 180/pi' : ''})`);
        break;
      case 'log':
        setEquation(prev => `log10(${prev})`);
        break;
      case 'ln':
        setEquation(prev => `log(${prev})`);
        break;
      case '10^':
        setEquation(prev => `10^(${prev})`);
        break;
      case 'e^':
        setEquation(prev => `e^(${prev})`);
        break;
      case 'sqrt':
        setEquation(prev => `sqrt(${prev})`);
        break;
      case 'pi':
        setEquation(prev => prev === '0' ? 'pi' : prev + '*pi');
        break;
      case 'e':
        setEquation(prev => prev === '0' ? 'e' : prev + '*e');
        break;
      default:
        setEquation(prev => `${func}(${prev})`);
    }
  };

  const handleEqual = () => {
    try {
      // Format equation for mathjs
      let processedEquation = equation;
      
      // Handle factorial
      if (processedEquation.includes('!')) {
        processedEquation = processedEquation.replace(/(\d+)!/g, 'factorial($1)');
      }
      
      const result = evaluate(processedEquation);
      
      // Format the result
      let displayResult;
      if (Math.abs(result) < 0.000001 || Math.abs(result) > 999999999) {
        displayResult = result.toExponential(6);
      } else {
        displayResult = Number(result.toFixed(8)).toString();
      }
      
      const newEntry = `${equation} = ${displayResult}`;
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]);
      setDisplay(displayResult);
      setEquation(displayResult);
    } catch (error) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1000);
      setEquation('');
    }
  };

  const clearEntry = () => {
    setDisplay('0');
    setEquation('');
  };

  const backspace = () => {
    setDisplay(prev => prev.slice(0, -1) || '0');
    setEquation(prev => prev.slice(0, -1) || '0');
  };

  const handleMemory = (operation) => {
    // Add memory operations here
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-100 rounded-lg p-4 shadow-lg">
      <div className="mb-4">
        <div className="bg-white p-2 rounded mb-2 h-8 text-right text-sm text-gray-600">
          {equation || '0'}
        </div>
        <div className="bg-white p-2 rounded h-12 text-right text-2xl font-bold">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {/* Angle unit and shift toggles */}
        <button
          onClick={() => setAngleUnit(prev => prev === 'deg' ? 'rad' : 'deg')}
          className="bg-gray-300 p-2 rounded hover:bg-gray-400"
        >
          {angleUnit.toUpperCase()}
        </button>
        <button
          onClick={() => setShift(!shift)}
          className={`p-2 rounded ${shift ? 'bg-yellow-300' : 'bg-gray-300'} hover:bg-gray-400`}
        >
          SHIFT
        </button>
        <button onClick={() => handleFunction('pi')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">π</button>
        <button onClick={() => handleFunction('e')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">e</button>
        <button onClick={backspace} className="bg-gray-300 p-2 rounded hover:bg-gray-400">←</button>

        {/* Functions */}
        <button onClick={() => handleFunction(shift ? 'asin' : 'sin')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
          {shift ? 'asin' : 'sin'}
        </button>
        <button onClick={() => handleFunction(shift ? 'acos' : 'cos')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
          {shift ? 'acos' : 'cos'}
        </button>
        <button onClick={() => handleFunction(shift ? 'atan' : 'tan')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
          {shift ? 'atan' : 'tan'}
        </button>
        <button onClick={() => handleFunction('sqrt')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">√</button>
        <button onClick={() => handleFunction('abs')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">|x|</button>

        {/* More functions */}
        <button onClick={() => handleFunction(shift ? '10^' : 'log')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
          {shift ? '10^x' : 'log'}
        </button>
        <button onClick={() => handleFunction(shift ? 'e^' : 'ln')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
          {shift ? 'e^x' : 'ln'}
        </button>
        <button onClick={() => handleOperator('^')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">x^y</button>
        <button onClick={() => handleOperator('!')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">n!</button>
        <button onClick={() => handleOperator('mod')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">mod</button>

        {/* Numbers and basic operators */}
        <button onClick={() => handleNumber('7')} className="bg-white p-2 rounded hover:bg-gray-200">7</button>
        <button onClick={() => handleNumber('8')} className="bg-white p-2 rounded hover:bg-gray-200">8</button>
        <button onClick={() => handleNumber('9')} className="bg-white p-2 rounded hover:bg-gray-200">9</button>
        <button onClick={() => handleOperator('(')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">(</button>
        <button onClick={() => handleOperator(')')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">)</button>

        <button onClick={() => handleNumber('4')} className="bg-white p-2 rounded hover:bg-gray-200">4</button>
        <button onClick={() => handleNumber('5')} className="bg-white p-2 rounded hover:bg-gray-200">5</button>
        <button onClick={() => handleNumber('6')} className="bg-white p-2 rounded hover:bg-gray-200">6</button>
        <button onClick={() => handleOperator('*')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">×</button>
        <button onClick={() => handleOperator('/')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">÷</button>

        <button onClick={() => handleNumber('1')} className="bg-white p-2 rounded hover:bg-gray-200">1</button>
        <button onClick={() => handleNumber('2')} className="bg-white p-2 rounded hover:bg-gray-200">2</button>
        <button onClick={() => handleNumber('3')} className="bg-white p-2 rounded hover:bg-gray-200">3</button>
        <button onClick={() => handleOperator('+')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">+</button>
        <button onClick={() => handleOperator('-')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">−</button>

        <button onClick={() => handleNumber('0')} className="bg-white p-2 rounded hover:bg-gray-200">0</button>
        <button onClick={() => handleNumber('.')} className="bg-white p-2 rounded hover:bg-gray-200">.</button>
        <button onClick={clearEntry} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">C</button>
        <button onClick={() => setEquation('')} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">CE</button>
        <button onClick={handleEqual} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">=</button>
      </div>

      <div className="mt-4">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="text-blue-500 hover:text-blue-600 mb-2"
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
        
        {showHistory && (
          <div className="bg-white rounded p-2 max-h-40 overflow-y-auto">
            {history.map((entry, index) => (
              <div key={index} className="text-sm text-gray-600 py-1 border-b">
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScientificCalculator;