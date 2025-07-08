"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

// A simple SVG calculator icon
const CalculatorSvgIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="8" y1="6" x2="16" y2="6"></line>
    <line x1="8" y1="10" x2="16" y2="10"></line>
    <line x1="8" y1="14" x2="10" y2="14"></line>
    <line x1="12" y1="14" x2="14" y2="14"></line>
    <line x1="8" y1="18" x2="10" y2="18"></line>
    <line x1="12" y1="18" x2="14" y2="18"></line>
    <line x1="16" y1="14" x2="16" y2="18"></line>
  </svg>
);


interface CalculatorIconProps {
  isCalculatorOpen: boolean;
  toggleCalculator: () => void;
}

const CalculatorIcon: React.FC<CalculatorIconProps> = ({ isCalculatorOpen, toggleCalculator }) => {
  return (
    <Button
      onClick={toggleCalculator}
      className="fixed bottom-4 right-4 w-14 h-14 md:w-12 md:h-12 rounded-full shadow-xl flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white z-50 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label={isCalculatorOpen ? "Számológép bezárása" : "Számológép megnyitása"}
      title={isCalculatorOpen ? "Számológép bezárása" : "Számológép megnyitása"}
    >
      <CalculatorSvgIcon />
    </Button>
  );
};

export default CalculatorIcon;
