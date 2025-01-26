import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
    setEquation(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op) => {
    setDisplay(op);
    setEquation(prev => prev + op);
  };

  const handleEqual = () => {
    try {
      const result = evaluate(equation);
      const newEntry = `${equation} = ${result}`;
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]);
      setDisplay(result.toString());
      setEquation(result.toString());
    } catch (error) {
      setDisplay('Error');
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (['+', '-', '*', '/', '.', '%'].includes(e.key)) {
        e.preventDefault();
        handleOperator(e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleEqual();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clearEntry();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [equation]);

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

      <div className="grid grid-cols-4 gap-2">
        <button onClick={() => clearEntry()} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
          C
        </button>
        <button onClick={backspace} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
          ←
        </button>
        <button onClick={() => handleOperator('%')} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
          %
        </button>
        <button onClick={() => handleOperator('/')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          ÷
        </button>

        <button onClick={() => handleNumber('7')} className="bg-white p-2 rounded hover:bg-gray-200">7</button>
        <button onClick={() => handleNumber('8')} className="bg-white p-2 rounded hover:bg-gray-200">8</button>
        <button onClick={() => handleNumber('9')} className="bg-white p-2 rounded hover:bg-gray-200">9</button>
        <button onClick={() => handleOperator('*')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">×</button>

        <button onClick={() => handleNumber('4')} className="bg-white p-2 rounded hover:bg-gray-200">4</button>
        <button onClick={() => handleNumber('5')} className="bg-white p-2 rounded hover:bg-gray-200">5</button>
        <button onClick={() => handleNumber('6')} className="bg-white p-2 rounded hover:bg-gray-200">6</button>
        <button onClick={() => handleOperator('-')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">-</button>

        <button onClick={() => handleNumber('1')} className="bg-white p-2 rounded hover:bg-gray-200">1</button>
        <button onClick={() => handleNumber('2')} className="bg-white p-2 rounded hover:bg-gray-200">2</button>
        <button onClick={() => handleNumber('3')} className="bg-white p-2 rounded hover:bg-gray-200">3</button>
        <button onClick={() => handleOperator('+')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">+</button>

        <button onClick={() => handleNumber('0')} className="bg-white p-2 rounded hover:bg-gray-200 col-span-2">0</button>
        <button onClick={() => handleNumber('.')} className="bg-white p-2 rounded hover:bg-gray-200">.</button>
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

export default Calculator;