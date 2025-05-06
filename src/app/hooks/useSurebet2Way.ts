import { useState, useEffect } from "react";
import { StakeField2Way } from "@/app/types/surebet";

interface UseSurebet2WayProps {
  odds1: string;
  odds2: string;
  totalStake: string;
  stake1: number;
  stake2: number;
  fixedField: StakeField2Way;
}

interface UseSurebet2WayResult {
  stake1: number;
  stake2: number;
  totalStake: string;
  profit: number;
  profitPercentage: number;
}

export function useSurebet2Way({
  odds1,
  odds2,
  totalStake,
  stake1,
  stake2,
  fixedField
}: UseSurebet2WayProps): UseSurebet2WayResult {
  const [result, setResult] = useState<UseSurebet2WayResult>({
    stake1: 0,
    stake2: 0,
    totalStake: "0",
    profit: 0,
    profitPercentage: 0,
  });

  useEffect(() => {
    const numOdds1 = parseFloat(odds1);
    const numOdds2 = parseFloat(odds2);
    if (isNaN(numOdds1) || isNaN(numOdds2)) {
      setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
      return;
    }
    if (fixedField === "total") {
      const numTotalStake = parseFloat(totalStake);
      if (isNaN(numTotalStake)) {
        setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
        return;
      }
      const stake1Calculated = Math.round((numTotalStake * numOdds2) / (numOdds1 + numOdds2));
      const stake2Calculated = Math.round((numTotalStake * numOdds1) / (numOdds1 + numOdds2));
      const profit = stake1Calculated * numOdds1 - numTotalStake;
      const profitPercentage = ((numOdds1 * numOdds2) / (numOdds1 + numOdds2) - 1) * 100;
      setResult({
        stake1: stake1Calculated,
        stake2: stake2Calculated,
        totalStake: numTotalStake.toFixed(0),
        profit,
        profitPercentage,
      });
    } else if (fixedField === "stake1") {
      const stake1Val = stake1;
      const stake2Calculated = Math.round((stake1Val * numOdds1) / numOdds2);
      const total = stake1Val + stake2Calculated;
      const profit = stake1Val * numOdds1 - total;
      const profitPercentage = ((numOdds1 * numOdds2) / (numOdds1 + numOdds2) - 1) * 100;
      setResult({
        stake1: stake1Val,
        stake2: stake2Calculated,
        totalStake: total.toFixed(0),
        profit,
        profitPercentage,
      });
    } else if (fixedField === "stake2") {
      const stake2Val = stake2;
      const stake1Calculated = Math.round((stake2Val * numOdds2) / numOdds1);
      const total = stake2Val + stake1Calculated;
      const profit = stake1Calculated * numOdds1 - total;
      const profitPercentage = ((numOdds1 * numOdds2) / (numOdds1 + numOdds2) - 1) * 100;
      setResult({
        stake1: stake1Calculated,
        stake2: stake2Val,
        totalStake: total.toFixed(0),
        profit,
        profitPercentage,
      });
    }
  }, [odds1, odds2, totalStake, stake1, stake2, fixedField]);

  return result;
}
