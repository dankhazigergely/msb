import { useState, useEffect } from "react";
import { StakeField6Way } from "@/app/types/surebet";

interface UseSurebet6WayProps {
    odds1: string;
    odds2: string;
    odds3: string;
    odds4: string;
    odds5: string;
    odds6: string;
    totalStake: string;
    stake1: number;
    stake2: number;
    stake3: number;
    stake4: number;
    stake5: number;
    stake6: number;
    fixedField: StakeField6Way;
}

interface UseSurebet6WayResult {
    stake1: number;
    stake2: number;
    stake3: number;
    stake4: number;
    stake5: number;
    stake6: number;
    totalStake: string;
    profit: number;
    profitPercentage: number;
}

export function useSurebet6Way({
    odds1,
    odds2,
    odds3,
    odds4,
    odds5,
    odds6,
    totalStake,
    stake1,
    stake2,
    stake3,
    stake4,
    stake5,
    stake6,
    fixedField
}: UseSurebet6WayProps): UseSurebet6WayResult {
    const [result, setResult] = useState<UseSurebet6WayResult>({
        stake1: 0,
        stake2: 0,
        stake3: 0,
        stake4: 0,
        stake5: 0,
        stake6: 0,
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
        const n6 = parseFloat(odds6);
        if (isNaN(n1) || isNaN(n2) || isNaN(n3) || isNaN(n4) || isNaN(n5) || isNaN(n6)) {
            setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
            return;
        }
        // Nevező: összeg, ahol mindig egy odds hiányzik a szorzatból
        const p1 = n2 * n3 * n4 * n5 * n6; // n1 hiányzik
        const p2 = n1 * n3 * n4 * n5 * n6; // n2 hiányzik
        const p3 = n1 * n2 * n4 * n5 * n6; // n3 hiányzik
        const p4 = n1 * n2 * n3 * n5 * n6; // n4 hiányzik
        const p5 = n1 * n2 * n3 * n4 * n6; // n5 hiányzik
        const p6 = n1 * n2 * n3 * n4 * n5; // n6 hiányzik
        const denom = p1 + p2 + p3 + p4 + p5 + p6;
        const productAll = n1 * n2 * n3 * n4 * n5 * n6;
        const profitPercentage = (productAll / denom - 1) * 100;

        if (fixedField === "total") {
            const numTotalStake = parseFloat(totalStake);
            if (isNaN(numTotalStake)) {
                setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
                return;
            }
            const s1 = Math.round((numTotalStake * p1) / denom);
            const s2 = Math.round((numTotalStake * p2) / denom);
            const s3 = Math.round((numTotalStake * p3) / denom);
            const s4 = Math.round((numTotalStake * p4) / denom);
            const s5 = Math.round((numTotalStake * p5) / denom);
            const s6 = Math.round((numTotalStake * p6) / denom);
            const profit = s1 * n1 - numTotalStake;
            setResult({
                stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: s5, stake6: s6,
                totalStake: numTotalStake.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake1") {
            const sFixed = stake1;
            const s2 = Math.round((sFixed * p2) / p1);
            const s3 = Math.round((sFixed * p3) / p1);
            const s4 = Math.round((sFixed * p4) / p1);
            const s5 = Math.round((sFixed * p5) / p1);
            const s6 = Math.round((sFixed * p6) / p1);
            const total = sFixed + s2 + s3 + s4 + s5 + s6;
            const profit = sFixed * n1 - total;
            setResult({
                stake1: sFixed, stake2: s2, stake3: s3, stake4: s4, stake5: s5, stake6: s6,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake2") {
            const sFixed = stake2;
            const s1 = Math.round((sFixed * p1) / p2);
            const s3 = Math.round((sFixed * p3) / p2);
            const s4 = Math.round((sFixed * p4) / p2);
            const s5 = Math.round((sFixed * p5) / p2);
            const s6 = Math.round((sFixed * p6) / p2);
            const total = s1 + sFixed + s3 + s4 + s5 + s6;
            const profit = s1 * n1 - total;
            setResult({
                stake1: s1, stake2: sFixed, stake3: s3, stake4: s4, stake5: s5, stake6: s6,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake3") {
            const sFixed = stake3;
            const s1 = Math.round((sFixed * p1) / p3);
            const s2 = Math.round((sFixed * p2) / p3);
            const s4 = Math.round((sFixed * p4) / p3);
            const s5 = Math.round((sFixed * p5) / p3);
            const s6 = Math.round((sFixed * p6) / p3);
            const total = s1 + s2 + sFixed + s4 + s5 + s6;
            const profit = s1 * n1 - total;
            setResult({
                stake1: s1, stake2: s2, stake3: sFixed, stake4: s4, stake5: s5, stake6: s6,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake4") {
            const sFixed = stake4;
            const s1 = Math.round((sFixed * p1) / p4);
            const s2 = Math.round((sFixed * p2) / p4);
            const s3 = Math.round((sFixed * p3) / p4);
            const s5 = Math.round((sFixed * p5) / p4);
            const s6 = Math.round((sFixed * p6) / p4);
            const total = s1 + s2 + s3 + sFixed + s5 + s6;
            const profit = s1 * n1 - total;
            setResult({
                stake1: s1, stake2: s2, stake3: s3, stake4: sFixed, stake5: s5, stake6: s6,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake5") {
            const sFixed = stake5;
            const s1 = Math.round((sFixed * p1) / p5);
            const s2 = Math.round((sFixed * p2) / p5);
            const s3 = Math.round((sFixed * p3) / p5);
            const s4 = Math.round((sFixed * p4) / p5);
            const s6 = Math.round((sFixed * p6) / p5);
            const total = s1 + s2 + s3 + s4 + sFixed + s6;
            const profit = s1 * n1 - total;
            setResult({
                stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: sFixed, stake6: s6,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        } else if (fixedField === "stake6") {
            const sFixed = stake6;
            const s1 = Math.round((sFixed * p1) / p6);
            const s2 = Math.round((sFixed * p2) / p6);
            const s3 = Math.round((sFixed * p3) / p6);
            const s4 = Math.round((sFixed * p4) / p6);
            const s5 = Math.round((sFixed * p5) / p6);
            const total = s1 + s2 + s3 + s4 + s5 + sFixed;
            const profit = s1 * n1 - total;
            setResult({
                stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: s5, stake6: sFixed,
                totalStake: total.toFixed(0),
                profit, profitPercentage,
            });
        }
    }, [odds1, odds2, odds3, odds4, odds5, odds6, totalStake, stake1, stake2, stake3, stake4, stake5, stake6, fixedField]);

    return result;
}
