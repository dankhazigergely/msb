import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { AnyStakeField } from "@/app/types/surebet";

interface TotalStakeRowProps<T extends AnyStakeField = AnyStakeField> {
  totalStake: string;
  setTotalStake: (val: string) => void;
  fixedField: T;
  setFixedField: (val: T) => void;
  min?: number;
  className?: string;
}

function TotalStakeRow<T extends AnyStakeField = AnyStakeField>({
  totalStake,
  setTotalStake,
  fixedField,
  setFixedField,
  min = 0,
  className = ""
}: TotalStakeRowProps<T>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="totalStake">Total</Label>
      <Input
        type="number"
        id="totalStake"
      value={totalStake}
      onChange={e => {
        setFixedField('total' as T);
        const newTotalStake = parseFloat(e.target.value);
        if (!isNaN(newTotalStake)) {
          setTotalStake(newTotalStake.toFixed(0));
        }
      }}
      // Apply dark mode sensitive background. Default to card/input background.
      // If fixedField is 'total', explicitly set light mode to white, dark mode to a slightly different shade or keep default.
      // For simplicity, we'll remove the explicit bg-white and let the input component's default dark mode styling take over.
      // The Input component from shadcn/ui should handle dark mode correctly if not overridden.
      // The original logic was: ${fixedField === 'total' ? 'bg-white' : ''}
      // We need to ensure that in dark mode, it doesn't become bg-white.
      // The Input component uses `bg-background` by default. Let's rely on that.
      // If specific styling for active 'total' field is needed, it should be dark-mode aware.
      // For now, removing the explicit bg-white should allow it to inherit themed background.
      className={`w-full px-2 py-1 border rounded ${className}`}
      min={min}
      onFocus={e => e.target.select()}
    />
  </div>
  );
}

export default TotalStakeRow;
