import React from "react";

interface CalculatorHeaderProps {
  title: string;
  value: number;
  valueLabel?: string;
  className?: string;
}

const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  title,
  value,
  valueLabel = "",
  className = ""
}) => (
  <div className={`relative px-6 pt-6 pb-2 ${className}`}>
    <h2 className="text-3xl font-bold mb-2 pr-32">{title}</h2>
    <div className="absolute top-6 right-8 text-sm" style={{ color: value >= 0 ? 'green' : 'red' }}>
      {valueLabel ? `${valueLabel}: ` : null}{value.toFixed(2)}%
    </div>
  </div>
);

export default CalculatorHeader;
