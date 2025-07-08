"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [isResultDisplayed, setIsResultDisplayed] = useState<boolean>(false); // New state

  // Load state from localStorage
  useEffect(() => {
    const storedInput = localStorage.getItem('calculatorInput');
    const storedHistory = localStorage.getItem('calculatorHistory');
    const storedPreviousValue = localStorage.getItem('calculatorPreviousValue');
    const storedOperator = localStorage.getItem('calculatorOperator');

    if (storedInput) setInput(storedInput);
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    if (storedPreviousValue) setPreviousValue(storedPreviousValue);
    if (storedOperator) setOperator(storedOperator);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('calculatorInput', input);
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    if (previousValue) localStorage.setItem('calculatorPreviousValue', previousValue);
    else localStorage.removeItem('calculatorPreviousValue');
    if (operator) localStorage.setItem('calculatorOperator', operator);
    else localStorage.removeItem('calculatorOperator');
    localStorage.setItem('isResultDisplayed', JSON.stringify(isResultDisplayed));
  }, [input, history, previousValue, operator, isResultDisplayed]);

  const handleNumberClick = (num: string) => {
    if (isResultDisplayed) {
      setInput(num);
      setPreviousValue(null); // Clear previous context for history display
      setOperator(null);      // Clear previous context for history display
      setIsResultDisplayed(false);
    } else {
      if (num === '.' && input.includes('.')) return;
      setInput((prev) => prev + num);
    }
  };

  const handleOperatorClick = (op: string) => {
    const currentInputValue = input;

    if (currentInputValue !== '' && !isResultDisplayed) {
      // Case 1: User has typed a number, and it's not a result display. E.g., "5", then presses "+".
      // Or, "5 + 2", then presses "*".
      if (previousValue && operator) {
        // This is a chained operation, like "5 + 2" then "*".
        // previousValue="5", operator="+", currentInputValue="2"

        // IMPORTANT: calculateResult will update `input` to the result AND RETURN IT.
        const resultOfPrevCalc = calculateResult();
        // After calculateResult:
        // `input` is the result (e.g., "7"),
        // `previousValue` is also the result ("7"),
        // `operator` is null,
        // `isResultDisplayed` is true.

        // Now, set up the new operation (op) using the returned result.
        if (resultOfPrevCalc !== undefined) { // Check if calculation happened
            setPreviousValue(resultOfPrevCalc);
            setOperator(op);
            setHistory(prev => [...prev, `${resultOfPrevCalc} ${op}`]);
            setInput(''); // Clear input for the next number of the new operation
            setIsResultDisplayed(false); // Not displaying a final result anymore.
        }
        // If calculateResult didn't run (e.g. div by zero error already handled), input might be "Error"
        // In that case, we might not want to proceed with setting up a new operation.
        // The current structure: calculateResult sets input to "Error", and isResultDisplayed to true.
        // So, a subsequent number click would clear "Error". An operator click would try to use "Error" as previousValue if not handled.
        // Let's assume for now that if resultOfPrevCalc is undefined (e.g. div by zero), the error state is sufficient.
      } else {
        // This is the first operator in a calculation. E.g., user types "5", then "+".
        // currentInputValue="5"
        setPreviousValue(currentInputValue);
        setOperator(op);
        setHistory(prev => [...prev, `${currentInputValue} ${op}`]);
        setInput('');
        setIsResultDisplayed(false);
      }
    } else if (previousValue !== null) {
      // Case 2: Current input is empty OR is a result display (isResultDisplayed is true).
      // AND there's a previousValue.
      // This handles:
      //   a) Changing an operator: "5 +" then user clicks "-" (currentInputValue is empty). previousValue="5".
      //   b) Operating on a result: "5 + 2 = 7" (currentInputValue="7", isResultDisplayed=true), then user clicks "*". previousValue="7".

      // The value to use for the operation is either the current input (if it's a result) or the stored previousValue.
      const valueToUseAsOperand = (isResultDisplayed && currentInputValue !== '') ? currentInputValue : previousValue;

      setPreviousValue(valueToUseAsOperand);
      setOperator(op);
      setInput(''); // Clear input for the next number
      setIsResultDisplayed(false); // Not displaying a final result anymore.

      setHistory(prev => {
        const newHistory = [...prev];
        const lastEntry = newHistory[newHistory.length - 1];
        // If last entry was an operator setup (e.g. "5 +"), replace it with "5 -"
        if (lastEntry && (lastEntry.trim().endsWith(' +') || lastEntry.trim().endsWith(' -') || lastEntry.trim().endsWith(' *') || lastEntry.trim().endsWith(' /'))) {
          if(!lastEntry.includes("=")) { // Avoid replacing "5 + 2 = 7" with "7 op" if changing op right after equals.
             newHistory[newHistory.length - 1] = `${valueToUseAsOperand} ${op}`;
             return newHistory;
          }
        }
        // Otherwise, add the new operation to history (e.g., after an equals: "7 *")
        newHistory.push(`${valueToUseAsOperand} ${op}`);
        return newHistory;
      });
    }
    // If currentInputValue is empty and previousValue is null, do nothing (e.g. AC then operator)
  };

  const calculateResult = () => {
    if (previousValue === null || operator === null || input === '') return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(input);
    let result: number;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          setInput('Error');
          setPreviousValue(null);
          setOperator(null);
          setHistory((prevHist) => [...prevHist, `${prev} ${operator} ${current} = Error`]);
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    const calculationString = `${previousValue} ${operator} ${input} = ${result}`;
    setHistory((prevHist) => [...prevHist, calculationString]);
    setInput(result.toString());
    setPreviousValue(result.toString()); // for chained operations
    // setOperator(null); // Keep operator for chained operations or clear it? User expectation?
                         // For now, let's clear it, next operator click will set it.
                         // Or, if user types a number next, it starts a new calculation.
                         // Let's refine this: if user presses another operator, it uses the result.
                         // If user presses a number, it should start a new input.
                         // The current setup means after '=', previousValue is the result.
                         // If an operator is clicked next, it will use this result as previousValue.
                         // If a number is clicked, it appends to the result. This needs fixing.

    const resultStr = result.toString();
    setInput(resultStr);
    setPreviousValue(resultStr);
    setOperator(null);
    setIsResultDisplayed(true);
    return resultStr; // Return the result
  };

  const handleEqualsClick = () => {
    if (operator && previousValue && input !== '') {
        calculateResult();
        // After equals, the result is in 'input', 'previousValue' is also the result.
        // 'operator' is null, 'isResultDisplayed' is true.
        // Next number click will clear 'input' due to 'isResultDisplayed'.
        // Next operator click will use 'input' (the result) as 'previousValue'.
    }
  };

  // Not used in the UI directly, but AC (handleClearAllClick) covers its main purpose.
  // const handleClearEntryClick = () => {
  //   setInput('');
  //   setIsResultDisplayed(false);
  // };

  const handleClearAllClick = () => {
    setInput('');
    setPreviousValue(null);
    setOperator(null);
    setHistory([]);
    setIsResultDisplayed(false); // Reset this flag as well
    localStorage.removeItem('calculatorInput');
    localStorage.removeItem('calculatorHistory');
    localStorage.removeItem('calculatorPreviousValue');
    localStorage.removeItem('calculatorOperator');
    // localStorage.removeItem('isResultDisplayed');
  };

  const handleDeleteClick = () => {
    if (isResultDisplayed) { // If result is shown, DEL should act like CE for the current input
      setInput('');
      setIsResultDisplayed(false);
    } else {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-16 md:right-4 bg-white p-3 sm:p-4 rounded-lg shadow-2xl border border-gray-300 w-full max-w-xs sm:w-80 z-50 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md sm:text-lg font-semibold text-gray-700">Számológép</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">X</Button>
      </div>

      {/* Display Area */}
      <div className="bg-gray-50 p-2 rounded mb-3 text-right min-h-[70px] sm:min-h-[80px] flex flex-col justify-end border border-gray-200 shadow-inner">
        <div className="text-xs text-gray-500 truncate h-5">
          {history.length > 0 ? history[history.length -1] : (previousValue && operator ? `${previousValue} ${operator}` : "")}
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 break-all">{input || '0'}</div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        <Button onClick={handleClearAllClick} className="col-span-2 bg-red-500 hover:bg-red-600 text-white py-3 sm:py-2 text-sm sm:text-base">AC</Button>
        <Button onClick={handleDeleteClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 sm:py-2 text-sm sm:text-base">DEL</Button>
        <Button onClick={() => handleOperatorClick('/')} className="bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-2 text-lg sm:text-xl">&divide;</Button>

        <Button onClick={() => handleNumberClick('7')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">7</Button>
        <Button onClick={() => handleNumberClick('8')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">8</Button>
        <Button onClick={() => handleNumberClick('9')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">9</Button>
        <Button onClick={() => handleOperatorClick('*')} className="bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-2 text-lg sm:text-xl">&times;</Button>

        <Button onClick={() => handleNumberClick('4')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">4</Button>
        <Button onClick={() => handleNumberClick('5')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">5</Button>
        <Button onClick={() => handleNumberClick('6')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">6</Button>
        <Button onClick={() => handleOperatorClick('-')} className="bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-2 text-lg sm:text-xl">&minus;</Button>

        <Button onClick={() => handleNumberClick('1')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">1</Button>
        <Button onClick={() => handleNumberClick('2')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">2</Button>
        <Button onClick={() => handleNumberClick('3')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">3</Button>
        <Button onClick={() => handleOperatorClick('+')} className="bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-2 text-lg sm:text-xl">+</Button>

        <Button onClick={() => handleNumberClick('0')} className="col-span-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">0</Button>
        <Button onClick={() => handleNumberClick('.')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 sm:py-2 text-lg sm:text-xl">.</Button>
        <Button onClick={handleEqualsClick} className="bg-green-500 hover:bg-green-600 text-white py-3 sm:py-2 text-lg sm:text-xl">=</Button>
      </div>

      {/* History Area */}
      <div className="mt-3 max-h-24 sm:max-h-28 overflow-y-auto text-xs text-gray-700 p-2 bg-gray-50 rounded border border-gray-200">
        <p className="font-semibold mb-1 text-gray-600">Előzmények:</p>
        {history.length === 0 && <p className="text-gray-500 italic">Nincs még előzmény.</p>}
        {history.slice().reverse().map((item, index) => (
          <div key={index} className="truncate py-0.5 hover:bg-gray-100 rounded px-1">{item}</div>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
