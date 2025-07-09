import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

import { AnyStakeField } from "@/app/types/surebet";

interface OddsStakeRowProps<T extends AnyStakeField = AnyStakeField> {
  oddsType: string;
  setOddsType: (val: string) => void;
  odds: string;
  setOdds: (val: string) => void;
  stake: number;
  setStake: (val: number) => void;
  labelOdds: string;
  labelStake: string;
  oddsId: string;
  stakeId: string;
  fixedField: T;
  setFixedField: (val: T) => void;
  stakeFieldName: T;
}

function OddsStakeRow<T extends AnyStakeField = AnyStakeField>({
  oddsType,
  setOddsType,
  odds,
  setOdds,
  stake,
  setStake,
  labelOdds,
  labelStake,
  oddsId,
  stakeId,
  fixedField,
  setFixedField,
  stakeFieldName
}: OddsStakeRowProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label htmlFor={oddsId}>{labelOdds}</Label>
        <div className="flex items-center gap-2">
          <select
            value={oddsType}
            onChange={e => setOddsType(e.target.value)}
            className="border rounded px-1 py-0.5 h-8"
            style={{ minWidth: '2.5rem' }}
          >
            <option value=""></option>
            <option value="T">T</option>
            <option value="V">V</option>
            <option value="B">B</option>
          </select>
          <Input
            type="number"
            id={oddsId}
            value={odds}
            onChange={e => setOdds(e.target.value)}
            step={0.01}
            onFocus={e => e.target.select()}
          />
        </div>

      </div>
      <div>
        <Label htmlFor={stakeId}>{labelStake}</Label>
        <Input
          type="number"
          id={stakeId}
          value={stake.toFixed(0)}
          onChange={e => {
            setFixedField(stakeFieldName);
            const newStake = parseFloat(e.target.value);
            if (!isNaN(newStake)) {
              setStake(newStake);
            }
          }}
          className={`w-full px-2 py-1 border rounded ${fixedField === stakeFieldName ? 'bg-white dark:bg-gray-700' : ''}`}
          min="0"
          onFocus={e => e.target.select()}
        />
      </div>
    </div>
  );
}

export default OddsStakeRow;
