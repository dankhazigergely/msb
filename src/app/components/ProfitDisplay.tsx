import React from "react";

interface ProfitDisplayProps {
  profit: number;
  className?: string;
  label?: string;
}

const ProfitDisplay: React.FC<ProfitDisplayProps> = ({ profit, className = "", label = "Profit" }) => (
  <div className={`flex justify-between p-6 pt-0 font-bold ${className}`}>
    {label}: <span style={{ color: profit >= 0 ? "green" : "red" }}>{profit.toFixed(2)}</span>
  </div>
);

export default ProfitDisplay;
