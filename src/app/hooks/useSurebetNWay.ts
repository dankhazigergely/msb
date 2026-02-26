import { useState, useEffect } from "react";

// Generikus N-Way surebet hook, tömb-alapú adatszerkezettel
interface UseSurebetNWayProps {
    odds: string[];        // N darab odds string
    stakes: number[];      // N darab stake szám
    totalStake: string;    // Össz tét string
    fixedField: 'total' | number; // 'total' vagy 0..N-1 index
}

interface UseSurebetNWayResult {
    stakes: number[];      // Kiszámított tétek
    totalStake: string;    // Kiszámított össz tét
    profit: number;        // Profit összeg
    profitPercentage: number; // Profit százalék
}

export function useSurebetNWay({
    odds,
    stakes,
    totalStake,
    fixedField,
}: UseSurebetNWayProps): UseSurebetNWayResult {
    const n = odds.length;

    const [result, setResult] = useState<UseSurebetNWayResult>({
        stakes: new Array(n).fill(0),
        totalStake: "0",
        profit: 0,
        profitPercentage: 0,
    });

    useEffect(() => {
        // Odds értékek parse-olása
        const numOdds = odds.map(o => parseFloat(o));

        // Ha bármelyik odds érvénytelen, profit/profitPercentage = 0
        if (numOdds.some(o => isNaN(o))) {
            setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
            return;
        }

        // Összes odds szorzata
        const productAll = numOdds.reduce((acc, o) => acc * o, 1);

        // product_i = productAll / odds_i (minden odds szorzata kivéve az i-ediket)
        const products = numOdds.map((_, i) => {
            let p = 1;
            for (let j = 0; j < n; j++) {
                if (j !== i) p *= numOdds[j];
            }
            return p;
        });

        const denom = products.reduce((acc, p) => acc + p, 0);
        const profitPercentage = (productAll / denom - 1) * 100;

        if (fixedField === 'total') {
            const numTotalStake = parseFloat(totalStake);
            if (isNaN(numTotalStake)) {
                setResult(r => ({ ...r, profit: 0, profitPercentage: 0 }));
                return;
            }
            const calcStakes = products.map(p => Math.round((numTotalStake * p) / denom));
            const profit = calcStakes[0] * numOdds[0] - numTotalStake;
            setResult({
                stakes: calcStakes,
                totalStake: numTotalStake.toFixed(0),
                profit,
                profitPercentage,
            });
        } else {
            // fixedField egy index (0..N-1) – az adott stake fix
            const fixedIdx = fixedField;
            const sFixed = stakes[fixedIdx];
            const pFixed = products[fixedIdx];

            const calcStakes = products.map((p, i) => {
                if (i === fixedIdx) return sFixed;
                return Math.round((sFixed * p) / pFixed);
            });

            const total = calcStakes.reduce((acc, s) => acc + s, 0);
            const profit = calcStakes[0] * numOdds[0] - total;
            setResult({
                stakes: calcStakes,
                totalStake: total.toFixed(0),
                profit,
                profitPercentage,
            });
        }
    }, [odds, stakes, totalStake, fixedField, n]);

    return result;
}
