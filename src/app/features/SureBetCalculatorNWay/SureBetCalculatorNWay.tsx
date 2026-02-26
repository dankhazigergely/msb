import { useEffect, useMemo, useCallback } from "react";
import { useSurebetNWay } from "@/app/hooks/useSurebetNWay";
import { Card, CardContent } from "@/components/ui/card";
import BetSaveSection from "@/app/components/BetSaveSection";
import OddsStakeRow from "@/app/components/OddsStakeRow";
import TotalStakeRow from "@/app/components/TotalStakeRow";
import ProfitDisplay from "@/app/components/ProfitDisplay";
import CalculatorHeader from "@/app/components/CalculatorHeader";
import { StakeFieldNWay } from "@/app/types/surebet";

// Kalkulátor állapot típus
export interface CalculatorStateNWay {
    odds: string[];
    oddsTypes: string[];
    stakes: number[];
    totalStake: string;
    fixedField: 'total' | number;
    name: string;
}

// Alapértelmezett állapot generáló
export function createDefaultNWayState(count: number): CalculatorStateNWay {
    return {
        odds: new Array(count).fill(String(count)),
        oddsTypes: new Array(count).fill(""),
        stakes: new Array(count).fill(0),
        totalStake: "10000",
        fixedField: 'total',
        name: "",
    };
}

interface SureBetCalculatorNWayProps {
    count: number; // Kimenetek száma (10-20)
    initialParams?: Record<string, string>;
    calculatorState: CalculatorStateNWay;
    setCalculatorState: React.Dispatch<React.SetStateAction<CalculatorStateNWay>>;
    resetCalculatorState: () => void;
}

const SureBetCalculatorNWay: React.FC<SureBetCalculatorNWayProps> = ({
    count,
    initialParams,
    calculatorState,
    setCalculatorState,
    resetCalculatorState,
}) => {
    const { odds, oddsTypes, stakes, totalStake, fixedField, name } = calculatorState;

    // Setter függvények generálása
    const setOdds = useCallback((index: number, value: string) => {
        setCalculatorState(prev => {
            const newOdds = [...prev.odds];
            newOdds[index] = value;
            return { ...prev, odds: newOdds };
        });
    }, [setCalculatorState]);

    const setOddsType = useCallback((index: number, value: string) => {
        setCalculatorState(prev => {
            const newTypes = [...prev.oddsTypes];
            newTypes[index] = value;
            return { ...prev, oddsTypes: newTypes };
        });
    }, [setCalculatorState]);

    const setStake = useCallback((index: number, value: number) => {
        setCalculatorState(prev => {
            const newStakes = [...prev.stakes];
            newStakes[index] = value;
            return { ...prev, stakes: newStakes, fixedField: index };
        });
    }, [setCalculatorState]);

    const setTotalStake = useCallback((value: string) => {
        setCalculatorState(prev => ({ ...prev, totalStake: value, fixedField: 'total' }));
    }, [setCalculatorState]);

    const setName = useCallback((value: string) => {
        setCalculatorState(prev => ({ ...prev, name: value }));
    }, [setCalculatorState]);

    // URL paraméterek feldolgozása
    useEffect(() => {
        if (!initialParams) return;
        const newState = { ...calculatorState };
        const newOdds = [...newState.odds];
        const newStakes = [...newState.stakes];
        let hasFixedStake = false;
        let fixedStakeIdx = 0;

        for (let i = 0; i < count; i++) {
            const oddsKey = `odds${i + 1}`;
            const stakeKey = `stake${i + 1}`;
            if (initialParams[oddsKey]) newOdds[i] = initialParams[oddsKey];
            if (initialParams[stakeKey]) {
                newStakes[i] = Number(initialParams[stakeKey]);
                if (!hasFixedStake) {
                    hasFixedStake = true;
                    fixedStakeIdx = i;
                }
            }
        }
        newState.odds = newOdds;
        newState.stakes = newStakes;
        if (initialParams.name) newState.name = initialParams.name;
        if (hasFixedStake) {
            newState.fixedField = fixedStakeIdx;
        } else if (initialParams.totalStake) {
            newState.totalStake = initialParams.totalStake;
            newState.fixedField = 'total';
        }
        setCalculatorState(newState);
    }, [initialParams]);

    // Hook hívás
    const hookResult = useSurebetNWay({
        odds,
        stakes,
        totalStake,
        fixedField,
    });

    // fixedField átalakítása StakeFieldNWay típusra az OddsStakeRow-hoz
    const fixedFieldAsStakeField: StakeFieldNWay = fixedField === 'total'
        ? 'total'
        : `stake${fixedField + 1}` as StakeFieldNWay;

    const setFixedFieldFromStakeField = useCallback((val: StakeFieldNWay) => {
        if (val === 'total') {
            setCalculatorState(prev => ({ ...prev, fixedField: 'total' }));
        } else {
            const idx = parseInt(val.replace('stake', '')) - 1;
            setCalculatorState(prev => ({ ...prev, fixedField: idx }));
        }
    }, [setCalculatorState]);

    // BetSaveSection-höz betFields objektum összeállítása
    const betFields = useMemo(() => {
        const fields: Record<string, any> = {};
        for (let i = 0; i < count; i++) {
            fields[`odds${i + 1}`] = odds[i];
            fields[`odds${i + 1}Type`] = oddsTypes[i];
            fields[`stake${i + 1}`] = hookResult.stakes[i];
        }
        fields.totalStake = hookResult.totalStake;
        fields.fixedField = fixedField;
        fields.count = count;
        return fields;
    }, [odds, oddsTypes, hookResult.stakes, hookResult.totalStake, fixedField, count]);

    // Mentett fogadás visszatöltése
    const setFieldsFromBet = useCallback((bet: any) => {
        const betCount = bet.count || count;
        const newOdds: string[] = [];
        const newOddsTypes: string[] = [];
        const newStakes: number[] = [];
        for (let i = 0; i < betCount; i++) {
            newOdds.push(bet[`odds${i + 1}`] || String(betCount));
            newOddsTypes.push(bet[`odds${i + 1}Type`] || "");
            newStakes.push(Number(bet[`stake${i + 1}`]) || 0);
        }
        setCalculatorState({
            odds: newOdds,
            oddsTypes: newOddsTypes,
            stakes: newStakes,
            totalStake: String(bet.totalStake) || "0",
            fixedField: bet.fixedField ?? 'total',
            name: bet.name || "",
        });
    }, [count, setCalculatorState]);

    // Sorok renderelése
    const rows = useMemo(() => {
        const items = [];
        for (let i = 0; i < count; i++) {
            const stakeFieldName = `stake${i + 1}` as StakeFieldNWay;
            items.push(
                <OddsStakeRow<StakeFieldNWay>
                    key={i}
                    oddsType={oddsTypes[i]}
                    setOddsType={(val) => setOddsType(i, val)}
                    odds={odds[i]}
                    setOdds={(val) => setOdds(i, val)}
                    stake={hookResult.stakes[i] ?? 0}
                    setStake={(val) => setStake(i, val)}
                    labelOdds={`Odds ${i + 1}`}
                    labelStake={`Stake ${i + 1}`}
                    oddsId={`odds${i + 1}-nway`}
                    stakeId={`stake${i + 1}-nway`}
                    fixedField={fixedFieldAsStakeField}
                    setFixedField={setFixedFieldFromStakeField}
                    stakeFieldName={stakeFieldName}
                />
            );
        }
        return items;
    }, [count, odds, oddsTypes, hookResult.stakes, fixedFieldAsStakeField, setOdds, setOddsType, setStake, setFixedFieldFromStakeField]);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CalculatorHeader title={`${count}-Way Calculator`} value={hookResult.profitPercentage} onReset={resetCalculatorState} />
            <CardContent className="relative grid gap-4 pt-4">
                {rows}
                <TotalStakeRow totalStake={hookResult.totalStake} setTotalStake={setTotalStake} fixedField={fixedFieldAsStakeField} setFixedField={setFixedFieldFromStakeField} />
                <ProfitDisplay profit={hookResult.profit} />
                <BetSaveSection
                    betFields={betFields}
                    betName={name}
                    setBetName={setName}
                    storageKey={`savedBetsNWay_${count}`}
                    setFieldsFromBet={setFieldsFromBet}
                />
            </CardContent>
        </Card>
    );
};

export default SureBetCalculatorNWay;
