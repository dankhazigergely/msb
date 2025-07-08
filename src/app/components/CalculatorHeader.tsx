import React from "react";

// Removed duplicate React import
import ResetButton from "./ResetButton"; // Import the new ResetButton component

interface CalculatorHeaderProps {
  title: string;
  value: number;
  valueLabel?: string;
  className?: string;
  onReset?: () => void; // Add the new onReset prop
}

const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  title,
  value,
  valueLabel = "",
  className = "",
  onReset, // Destructure the new prop
}) => (
  <div className={`relative px-6 pt-6 pb-2 ${className}`}>
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold mb-2 pr-4">{title}</h2> {/* Reduced pr for spacing */}
      {onReset && (
        <ResetButton onClick={onReset} className="mb-2" /> // Render ResetButton if onReset is provided
      )}
    </div>
    <div className="absolute top-6 right-8 text-sm" style={{ color: value >= 0 ? 'green' : 'red' }}>
      {valueLabel ? `${valueLabel}: ` : null}{value.toFixed(2)}%
    </div>
  </div>
);

export default CalculatorHeader;
