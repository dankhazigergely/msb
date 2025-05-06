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
      className={`w-full px-2 py-1 border rounded ${fixedField === 'total' ? 'bg-white' : ''} ${className}`}
      min={min}
      onFocus={e => e.target.select()}
    />
  </div>
  );
}

export default TotalStakeRow;
