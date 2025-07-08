import React from 'react';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

interface ResetButtonProps {
  onClick: () => void;
  className?: string;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick, className = "" }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full text-red-500 hover:text-red-700 ${className}`} // Added text-red-500 and hover state
      onClick={onClick}
      aria-label="Reset"
    >
      <XIcon className="h-5 w-5" />
    </Button>
  );
};

export default ResetButton;
