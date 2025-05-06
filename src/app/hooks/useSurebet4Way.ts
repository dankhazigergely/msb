import { useState, useEffect } from "react";
import { StakeField4Way } from "@/app/types/surebet";

interface UseSurebet4WayProps {
  odds1: string;
  odds2: string;
  odds3: string;
  odds4: string;
  totalStake: string;
  stake1: number;
  stake2: number;
  stake3: number;
  stake4: number;
  fixedField: StakeField4Way;
}

interface UseSurebet4WayResult {
  stake1: number;
  stake2: number;
  stake3: number;
  stake4: number;
  totalStake: string;
  profit: number;
  profitPercentage: number;
}

export function useSurebet4Way({
  odds1,
  odds2,
  odds3,
  odds4,
  totalStake,
  stake1,
  stake2,
  stake3,
  stake4,
  fixedField
}: UseSurebet4WayProps): UseSurebet4WayResult {
  const [result, setResult] = useState<UseSurebet4WayResult>({
    stake1: 0,
    stake2: 0,
    stake3: 0,
    stake4: 0,
    totalStake: "0",
    profit: 0,
    profitPercentage: 0,
  });

  useEffect(() => {
    const numOdds1 = parseFloat(odds1);
    const numOdds2 = parseFloat(odds2);
    const numOdds3 = parseFloat(odds3);
    const numOdds4 = parseFloat(odds4);
    if (isNaN(numOdds1) || isNaN(numOdds2) || isNaN(numOdds3) || isNaN(numOdds4)) {
      setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
      return;
    }
    const denom = numOdds1 * numOdds2 * numOdds3 + numOdds2 * numOdds3 * numOdds4 + numOdds1 * numOdds3 * numOdds4 + numOdds1 * numOdds2 * numOdds4;
    if (fixedField === "total") {
      const numTotalStake = parseFloat(totalStake);
      if (isNaN(numTotalStake)) {
        setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
        return;
      }
      const stake1Calculated = Math.round((numTotalStake * numOdds2 * numOdds3 * numOdds4) / denom);
      const stake2Calculated = Math.round((numTotalStake * numOdds1 * numOdds3 * numOdds4) / denom);
      const stake3Calculated = Math.round((numTotalStake * numOdds1 * numOdds2 * numOdds4) / denom);
      const stake4Calculated = Math.round((numTotalStake * numOdds1 * numOdds2 * numOdds3) / denom);
      const profit = stake1Calculated * numOdds1 - numTotalStake;
      const profitPercentage = ((numOdds1 * numOdds2 * numOdds3 * numOdds4) / denom - 1) * 100;
      setResult({
        stake1: stake1Calculated,
        stake2: stake2Calculated,
        stake3: stake3Calculated,
        stake4: stake4Calculated,
        totalStake: numTotalStake.toFixed(0),
        profit,
        profitPercentage,
      });
    } else if (fixedField === "stake1") {
      const stake1Val = stake1;
      const stake2Calculated = Math.round((stake1Val * numOdds1 * numOdds3 * numOdds4) / (numOdds2 * numOdds3 * numOdds4));
      const stake3Calculated = Math.round((stake1Val * numOdds1 * numOdds2 * numOdds4) / (numOdds2 * numOdds3 * numOdds4));
      const stake4Calculated = Math.round((stake1Val * numOdds1 * numOdds2 * numOdds3) / (numOdds2 * numOdds3 * numOdds4));
      const total = stake1Val + stake2Calculated + stake3Calculated + stake4Calculated;
      const profit = stake1Val * numOdds1 - total;
      const profitPercentage = ((numOdds1 * numOdds2 * numOdds3 * numOdds4) / denom - 1) * 100;
      setResult({
        stake1: stake1Val,
        stake2: stake2Calculated,
        stake3: stake3Calculated,
        stake4: stake4Calculated,
        totalStake: total.toFixed(0),
        profit,
        profitPercentage,
      });
    } else if (fixedField === "stake2") {
      const stake2Val = stake2;
      const stake1Calculated = Math.round((stake2Val * numOdds2 * numOdds3 * numOdds4) / (numOdds1 * numOdds3 * numOdds4));
      const stake3Calculated = Math.round((stake2Val * numOdds1 * numOdds2 * numOdds4) / (numOdds1 * numOdds3 * numOdds4));
      const stake4Calculated = Math.round((stake2Val * numOdds1 * numOdds2 * numOdds3) / (numOdds1 * numOdds3 * numOdds4));
      const total = stake1Calculated + stake2Val + stake3Calculated + stake4Calculated;
      const profit = stake1Calculated * numOdds1 - total;
      const profitPercentage = ((numOdds1 * numOdds2 * numOdds3 * numOdds4) / denom - 1) * 100;
      setResult({
        stake1: stake1Calculated,
        stake2: stake2Val,
        stake3: stake3Calculated,
        stake4: stake4Calculated,
        totalStake: total.toFixed(0),
        profit,
        profitPercentage,
      });
    } else if (fixedField === "stake3") {
      const stake3Val = stake3;
      const stake1Calculated = Math.round((stake3Val * numOdds2 * numOdds3 * numOdds4) / (numOdds1 * numOdds2 * numOdds4));
      const stake2Calculated = Math.round((stake3Val * numOdds1 * numOdds3 * numOdds4) / (numOdds1 * numOdds2 * numOdds4));
      const stake4Calculated = Math.round((stake3Val * numOdds1 * numOdds2 * numOdds3) / (numOdds1 * numOdds2 * numOdds4));
      const total = stake1Calculated + stake2Calculated + stake3Val + stake4Calculated;
      const profit = stake1Calculated * numOdds1 - total;
      const profitPercentage = ((numOdds1 * numOdds2 * numOdds3 * numOdds4) / denom - 1) * 100;
      setResult({
        stake1: stake1Calculated,
        stake2: stake2Calculated,
        stake3: stake3Val,
        stake4: stake4Calculated,
        totalStake: total.toFixed(0),
        profit,
        profitPercentage,
      });
    } else if (fixedField === "stake4") {
      const stake4Val = stake4;
      const stake1Calculated = Math.round((stake4Val * numOdds2 * numOdds3 * numOdds4) / (numOdds1 * numOdds2 * numOdds3));
      const stake2Calculated = Math.round((stake4Val * numOdds1 * numOdds3 * numOdds4) / (numOdds1 * numOdds2 * numOdds3));
      const stake3Calculated = Math.round((stake4Val * numOdds1 * numOdds2 * numOdds4) / (numOdds1 * numOdds2 * numOdds3));
      const total = stake1Calculated + stake2Calculated + stake3Calculated + stake4Val;
      const profit = stake1Calculated * numOdds1 - total;
      const profitPercentage = ((numOdds1 * numOdds2 * numOdds3 * numOdds4) / denom - 1) * 100;
      setResult({
        stake1: stake1Calculated,
        stake2: stake2Calculated,
        stake3: stake3Calculated,
        stake4: stake4Val,
        totalStake: total.toFixed(0),
        profit,
        profitPercentage,
      });
    }
  }, [odds1, odds2, odds3, odds4, totalStake, stake1, stake2, stake3, stake4, fixedField]);

  return result;
}
