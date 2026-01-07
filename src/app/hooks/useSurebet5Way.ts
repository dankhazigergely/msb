import { useState, useEffect } from "react";
import { StakeField5Way } from "@/app/types/surebet";

interface UseSurebet5WayProps {
    odds1: string;
    odds2: string;
    odds3: string;
    odds4: string;
    odds5: string;
    totalStake: string;
    stake1: number;
    stake2: number;
    stake3: number;
    stake4: number;
    stake5: number;
    fixedField: StakeField5Way;
}

interface UseSurebet5WayResult {
    stake1: number;
    stake2: number;
    stake3: number;
    stake4: number;
    stake5: number;
    totalStake: string;
    profit: number;
    profitPercentage: number;
}

export function useSurebet5Way({
    odds1,
    odds2,
    odds3,
    odds4,
    odds5,
    totalStake,
    stake1,
    stake2,
    stake3,
    stake4,
    stake5,
    fixedField
}: UseSurebet5WayProps): UseSurebet5WayResult {
    const [result, setResult] = useState<UseSurebet5WayResult>({
        stake1: 0,
        stake2: 0,
        stake3: 0,
        stake4: 0,
        stake5: 0,
        totalStake: "0",
        profit: 0,
        profitPercentage: 0,
    });

    useEffect(() => {
        const n1 = parseFloat(odds1);
        const n2 = parseFloat(odds2);
        const n3 = parseFloat(odds3);
        const n4 = parseFloat(odds4);
        const n5 = parseFloat(odds5);
        if (isNaN(n1) || isNaN(n2) || isNaN(n3) || isNaN(n4) || isNaN(n5)) {
            setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
            return;
        }
        // Nevező: összeg, ahol mindig egy odds hiányzik a szorzatból
        // denom = n2*n3*n4*n5 + n1*n3*n4*n5 + n1*n2*n4*n5 + n1*n2*n3*n5 + n1*n2*n3*n4
        const denom = n2 * n3 * n4 * n5 + n1 * n3 * n4 * n5 + n1 * n2 * n4 * n5 + n1 * n2 * n3 * n5 + n1 * n2 * n3 * n4;
        const productAll = n1 * n2 * n3 * n4 * n5;
        const profitPercentage = (productAll / denom - 1) * 100;

        if (fixedField === "total") {
            const numTotalStake = parseFloat(totalStake);
            if (isNaN(numTotalStake)) {
                setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
                return;
            }
            const s1 = Math.round((numTotalStake * n2 * n3 * n4 * n5) / denom);
            const s2 = Math.round((numTotalStake * n1 * n3 * n4 * n5) / denom);
            const s3 = Math.round((numTotalStake * n1 * n2 * n4 * n5) / denom);
            const s4 = Math.round((numTotalStake * n1 * n2 * n3 * n5) / denom);
            const s5 = Math.round((numTotalStake * n1 * n2 * n3 * n4) / denom);
            const profit = s1 * n1 - numTotalStake;
            setResult({
                stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: s5,
                totalStake: numTotalStake.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake1") {
            const sFixed = stake1;
            const denomOther = n2 * n3 * n4 * n5;
            const s2 = Math.round((sFixed * n1 * n3 * n4 * n5) / denomOther);
            const s3 = Math.round((sFixed * n1 * n2 * n4 * n5) / denomOther);
            const s4 = Math.round((sFixed * n1 * n2 * n3 * n5) / denomOther);
            const s5 = Math.round((sFixed * n1 * n2 * n3 * n4) / denomOther);
            const total = sFixed + s2 + s3 + s4 + s5;
            const profit = sFixed * n1 - total;
            setResult({
                stake1: sFixed, stake2: s2, stake3: s3, stake4: s4, stake5: s5,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake2") {
            const sFixed = stake2;
            const denomOther = n1 * n3 * n4 * n5;
            const s1 = Math.round((sFixed * n2 * n3 * n4 * n5) / denomOther);
            const s3 = Math.round((sFixed * n1 * n2 * n4 * n5) / denomOther);
            const s4 = Math.round((sFixed * n1 * n2 * n3 * n5) / denomOther);
            const s5 = Math.round((sFixed * n1 * n2 * n3 * n4) / denomOther);
            const total = s1 + sFixed + s3 + s4 + s5;
            const profit = s1 * n1 - total;
            setResult({
                stake1: s1, stake2: sFixed, stake3: s3, stake4: s4, stake5: s5,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake3") {
            const sFixed = stake3;
            const denomOther = n1 * n2 * n4 * n5;
            const s1 = Math.round((sFixed * n2 * n3 * n4 * n5) / denomOther);
            const s2 = Math.round((sFixed * n1 * n3 * n4 * n5) / denomOther);
            const s4 = Math.round((sFixed * n1 * n2 * n3 * n5) / denomOther);
            const s5 = Math.round((sFixed * n1 * n2 * n3 * n4) / denomOther);
            const total = s1 + s2 + sFixed + s4 + s5;
            const profit = s1 * n1 - total;
            setResult({
                stake1: s1, stake2: s2, stake3: sFixed, stake4: s4, stake5: s5,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake4") {
            const sFixed = stake4;
            const denomOther = n1 * n2 * n3 * n5;
            const s1 = Math.round((sFixed * n2 * n3 * n4 * n5) / denomOther);
            const s2 = Math.round((sFixed * n1 * n3 * n4 * n5) / denomOther);
            const s3 = Math.round((sFixed * n1 * n2 * n4 * n5) / denomOther);
            const s5 = Math.round((sFixed * n1 * n2 * n3 * n4) / denomOther);
            const total = s1 + s2 + s3 + sFixed + s5;
            const profit = s1 * n1 - total;
            setResult({
                stake1: s1, stake2: s2, stake3: s3, stake4: sFixed, stake5: s5,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake5") {
            const sFixed = stake5;
            const denomOther = n1 * n2 * n3 * n4;
            const s1 = Math.round((sFixed * n2 * n3 * n4 * n5) / denomOther);
            const s2 = Math.round((sFixed * n1 * n3 * n4 * n5) / denomOther);
            const s3 = Math.round((sFixed * n1 * n2 * n4 * n5) / denomOther);
            const s4 = Math.round((sFixed * n1 * n2 * n3 * n5) / denomOther);
            const total = s1 + s2 + s3 + s4 + sFixed;
            const profit = s1 * n1 - total;
            setResult({
                stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: sFixed,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        }
    }, [odds1, odds2, odds3, odds4, odds5, totalStake, stake1, stake2, stake3, stake4, stake5, fixedField]);

    return result;
}
