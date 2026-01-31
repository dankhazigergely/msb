import { useState, useEffect } from "react";
import { StakeField9Way } from "@/app/types/surebet";

interface UseSurebet9WayProps {
    odds1: string;
    odds2: string;
    odds3: string;
    odds4: string;
    odds5: string;
    odds6: string;
    odds7: string;
    odds8: string;
    odds9: string;
    totalStake: string;
    stake1: number;
    stake2: number;
    stake3: number;
    stake4: number;
    stake5: number;
    stake6: number;
    stake7: number;
    stake8: number;
    stake9: number;
    fixedField: StakeField9Way;
}

interface UseSurebet9WayResult {
    stake1: number;
    stake2: number;
    stake3: number;
    stake4: number;
    stake5: number;
    stake6: number;
    stake7: number;
    stake8: number;
    stake9: number;
    totalStake: string;
    profit: number;
    profitPercentage: number;
}

export function useSurebet9Way({
    odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8, odds9,
    totalStake,
    stake1, stake2, stake3, stake4, stake5, stake6, stake7, stake8, stake9,
    fixedField
}: UseSurebet9WayProps): UseSurebet9WayResult {
    const [result, setResult] = useState<UseSurebet9WayResult>({
        stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0, stake7: 0, stake8: 0, stake9: 0,
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
        const n7 = parseFloat(odds7);
        const n8 = parseFloat(odds8);
        const n9 = parseFloat(odds9);
        if (isNaN(n1) || isNaN(n2) || isNaN(n3) || isNaN(n4) || isNaN(n5) || isNaN(n6) || isNaN(n7) || isNaN(n8) || isNaN(n9)) {
            setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
            return;
        }
        // Számítjuk a szorzatokat (minden odds szorzata kivéve egy)
        const p1 = n2 * n3 * n4 * n5 * n6 * n7 * n8 * n9;
        const p2 = n1 * n3 * n4 * n5 * n6 * n7 * n8 * n9;
        const p3 = n1 * n2 * n4 * n5 * n6 * n7 * n8 * n9;
        const p4 = n1 * n2 * n3 * n5 * n6 * n7 * n8 * n9;
        const p5 = n1 * n2 * n3 * n4 * n6 * n7 * n8 * n9;
        const p6 = n1 * n2 * n3 * n4 * n5 * n7 * n8 * n9;
        const p7 = n1 * n2 * n3 * n4 * n5 * n6 * n8 * n9;
        const p8 = n1 * n2 * n3 * n4 * n5 * n6 * n7 * n9;
        const p9 = n1 * n2 * n3 * n4 * n5 * n6 * n7 * n8;
        const denom = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
        const productAll = n1 * n2 * n3 * n4 * n5 * n6 * n7 * n8 * n9;
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
            const s7 = Math.round((numTotalStake * p7) / denom);
            const s8 = Math.round((numTotalStake * p8) / denom);
            const s9 = Math.round((numTotalStake * p9) / denom);
            const profit = s1 * n1 - numTotalStake;
            setResult({
                stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: s5, stake6: s6, stake7: s7, stake8: s8, stake9: s9,
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
            const s7 = Math.round((sFixed * p7) / p1);
            const s8 = Math.round((sFixed * p8) / p1);
            const s9 = Math.round((sFixed * p9) / p1);
            const total = sFixed + s2 + s3 + s4 + s5 + s6 + s7 + s8 + s9;
            const profit = sFixed * n1 - total;
            setResult({ stake1: sFixed, stake2: s2, stake3: s3, stake4: s4, stake5: s5, stake6: s6, stake7: s7, stake8: s8, stake9: s9, totalStake: total.toFixed(0), profit, profitPercentage });
        } else if (fixedField === "stake2") {
            const sFixed = stake2;
            const s1 = Math.round((sFixed * p1) / p2);
            const s3 = Math.round((sFixed * p3) / p2);
            const s4 = Math.round((sFixed * p4) / p2);
            const s5 = Math.round((sFixed * p5) / p2);
            const s6 = Math.round((sFixed * p6) / p2);
            const s7 = Math.round((sFixed * p7) / p2);
            const s8 = Math.round((sFixed * p8) / p2);
            const s9 = Math.round((sFixed * p9) / p2);
            const total = s1 + sFixed + s3 + s4 + s5 + s6 + s7 + s8 + s9;
            const profit = s1 * n1 - total;
            setResult({ stake1: s1, stake2: sFixed, stake3: s3, stake4: s4, stake5: s5, stake6: s6, stake7: s7, stake8: s8, stake9: s9, totalStake: total.toFixed(0), profit, profitPercentage });
        } else if (fixedField === "stake3") {
            const sFixed = stake3;
            const s1 = Math.round((sFixed * p1) / p3);
            const s2 = Math.round((sFixed * p2) / p3);
            const s4 = Math.round((sFixed * p4) / p3);
            const s5 = Math.round((sFixed * p5) / p3);
            const s6 = Math.round((sFixed * p6) / p3);
            const s7 = Math.round((sFixed * p7) / p3);
            const s8 = Math.round((sFixed * p8) / p3);
            const s9 = Math.round((sFixed * p9) / p3);
            const total = s1 + s2 + sFixed + s4 + s5 + s6 + s7 + s8 + s9;
            const profit = s1 * n1 - total;
            setResult({ stake1: s1, stake2: s2, stake3: sFixed, stake4: s4, stake5: s5, stake6: s6, stake7: s7, stake8: s8, stake9: s9, totalStake: total.toFixed(0), profit, profitPercentage });
        } else if (fixedField === "stake4") {
            const sFixed = stake4;
            const s1 = Math.round((sFixed * p1) / p4);
            const s2 = Math.round((sFixed * p2) / p4);
            const s3 = Math.round((sFixed * p3) / p4);
            const s5 = Math.round((sFixed * p5) / p4);
            const s6 = Math.round((sFixed * p6) / p4);
            const s7 = Math.round((sFixed * p7) / p4);
            const s8 = Math.round((sFixed * p8) / p4);
            const s9 = Math.round((sFixed * p9) / p4);
            const total = s1 + s2 + s3 + sFixed + s5 + s6 + s7 + s8 + s9;
            const profit = s1 * n1 - total;
            setResult({ stake1: s1, stake2: s2, stake3: s3, stake4: sFixed, stake5: s5, stake6: s6, stake7: s7, stake8: s8, stake9: s9, totalStake: total.toFixed(0), profit, profitPercentage });
        } else if (fixedField === "stake5") {
            const sFixed = stake5;
            const s1 = Math.round((sFixed * p1) / p5);
            const s2 = Math.round((sFixed * p2) / p5);
            const s3 = Math.round((sFixed * p3) / p5);
            const s4 = Math.round((sFixed * p4) / p5);
            const s6 = Math.round((sFixed * p6) / p5);
            const s7 = Math.round((sFixed * p7) / p5);
            const s8 = Math.round((sFixed * p8) / p5);
            const s9 = Math.round((sFixed * p9) / p5);
            const total = s1 + s2 + s3 + s4 + sFixed + s6 + s7 + s8 + s9;
            const profit = s1 * n1 - total;
            setResult({ stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: sFixed, stake6: s6, stake7: s7, stake8: s8, stake9: s9, totalStake: total.toFixed(0), profit, profitPercentage });
        } else if (fixedField === "stake6") {
            const sFixed = stake6;
            const s1 = Math.round((sFixed * p1) / p6);
            const s2 = Math.round((sFixed * p2) / p6);
            const s3 = Math.round((sFixed * p3) / p6);
            const s4 = Math.round((sFixed * p4) / p6);
            const s5 = Math.round((sFixed * p5) / p6);
            const s7 = Math.round((sFixed * p7) / p6);
            const s8 = Math.round((sFixed * p8) / p6);
            const s9 = Math.round((sFixed * p9) / p6);
            const total = s1 + s2 + s3 + s4 + s5 + sFixed + s7 + s8 + s9;
            const profit = s1 * n1 - total;
            setResult({ stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: s5, stake6: sFixed, stake7: s7, stake8: s8, stake9: s9, totalStake: total.toFixed(0), profit, profitPercentage });
        } else if (fixedField === "stake7") {
            const sFixed = stake7;
            const s1 = Math.round((sFixed * p1) / p7);
            const s2 = Math.round((sFixed * p2) / p7);
            const s3 = Math.round((sFixed * p3) / p7);
            const s4 = Math.round((sFixed * p4) / p7);
            const s5 = Math.round((sFixed * p5) / p7);
            const s6 = Math.round((sFixed * p6) / p7);
            const s8 = Math.round((sFixed * p8) / p7);
            const s9 = Math.round((sFixed * p9) / p7);
            const total = s1 + s2 + s3 + s4 + s5 + s6 + sFixed + s8 + s9;
            const profit = s1 * n1 - total;
            setResult({ stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: s5, stake6: s6, stake7: sFixed, stake8: s8, stake9: s9, totalStake: total.toFixed(0), profit, profitPercentage });
        } else if (fixedField === "stake8") {
            const sFixed = stake8;
            const s1 = Math.round((sFixed * p1) / p8);
            const s2 = Math.round((sFixed * p2) / p8);
            const s3 = Math.round((sFixed * p3) / p8);
            const s4 = Math.round((sFixed * p4) / p8);
            const s5 = Math.round((sFixed * p5) / p8);
            const s6 = Math.round((sFixed * p6) / p8);
            const s7 = Math.round((sFixed * p7) / p8);
            const s9 = Math.round((sFixed * p9) / p8);
            const total = s1 + s2 + s3 + s4 + s5 + s6 + s7 + sFixed + s9;
            const profit = s1 * n1 - total;
            setResult({ stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: s5, stake6: s6, stake7: s7, stake8: sFixed, stake9: s9, totalStake: total.toFixed(0), profit, profitPercentage });
        } else if (fixedField === "stake9") {
            const sFixed = stake9;
            const s1 = Math.round((sFixed * p1) / p9);
            const s2 = Math.round((sFixed * p2) / p9);
            const s3 = Math.round((sFixed * p3) / p9);
            const s4 = Math.round((sFixed * p4) / p9);
            const s5 = Math.round((sFixed * p5) / p9);
            const s6 = Math.round((sFixed * p6) / p9);
            const s7 = Math.round((sFixed * p7) / p9);
            const s8 = Math.round((sFixed * p8) / p9);
            const total = s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8 + sFixed;
            const profit = s1 * n1 - total;
            setResult({ stake1: s1, stake2: s2, stake3: s3, stake4: s4, stake5: s5, stake6: s6, stake7: s7, stake8: s8, stake9: sFixed, totalStake: total.toFixed(0), profit, profitPercentage });
        }
    }, [odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8, odds9, totalStake, stake1, stake2, stake3, stake4, stake5, stake6, stake7, stake8, stake9, fixedField]);

    return result;
}
