import { useEffect } from "react";
import { useSurebet8Way } from "@/app/hooks/useSurebet8Way";
import { Card, CardContent } from "@/components/ui/card";
import BetSaveSection from "@/app/components/BetSaveSection";
import OddsStakeRow from "@/app/components/OddsStakeRow";
import TotalStakeRow from "@/app/components/TotalStakeRow";
import ProfitDisplay from "@/app/components/ProfitDisplay";
import CalculatorHeader from "@/app/components/CalculatorHeader";
import { StakeField8Way } from "@/app/types/surebet";
import { CalculatorState8Way } from "@/app/page";

interface SureBetCalculator8WayProps {
    initialParams?: Record<string, string>;
    calculatorState: CalculatorState8Way;
    setCalculatorState: React.Dispatch<React.SetStateAction<CalculatorState8Way>>;
    resetCalculatorState: () => void;
}

const SureBetCalculator8Way: React.FC<SureBetCalculator8WayProps> = ({
    initialParams,
    calculatorState,
    setCalculatorState,
    resetCalculatorState,
}) => {
    const {
        odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8,
        odds1Type, odds2Type, odds3Type, odds4Type, odds5Type, odds6Type, odds7Type, odds8Type,
        totalStake,
        stake1, stake2, stake3, stake4, stake5, stake6, stake7, stake8,
        fixedField, name
    } = calculatorState;

    const setOdds1 = (value: string) => setCalculatorState(prev => ({ ...prev, odds1: value }));
    const setOdds2 = (value: string) => setCalculatorState(prev => ({ ...prev, odds2: value }));
    const setOdds3 = (value: string) => setCalculatorState(prev => ({ ...prev, odds3: value }));
    const setOdds4 = (value: string) => setCalculatorState(prev => ({ ...prev, odds4: value }));
    const setOdds5 = (value: string) => setCalculatorState(prev => ({ ...prev, odds5: value }));
    const setOdds6 = (value: string) => setCalculatorState(prev => ({ ...prev, odds6: value }));
    const setOdds7 = (value: string) => setCalculatorState(prev => ({ ...prev, odds7: value }));
    const setOdds8 = (value: string) => setCalculatorState(prev => ({ ...prev, odds8: value }));
    const setOdds1Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds1Type: value }));
    const setOdds2Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds2Type: value }));
    const setOdds3Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds3Type: value }));
    const setOdds4Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds4Type: value }));
    const setOdds5Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds5Type: value }));
    const setOdds6Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds6Type: value }));
    const setOdds7Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds7Type: value }));
    const setOdds8Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds8Type: value }));
    const setTotalStake = (value: string) => setCalculatorState(prev => ({ ...prev, totalStake: value, fixedField: 'total' }));
    const setStake1 = (value: number) => setCalculatorState(prev => ({ ...prev, stake1: value, fixedField: 'stake1' }));
    const setStake2 = (value: number) => setCalculatorState(prev => ({ ...prev, stake2: value, fixedField: 'stake2' }));
    const setStake3 = (value: number) => setCalculatorState(prev => ({ ...prev, stake3: value, fixedField: 'stake3' }));
    const setStake4 = (value: number) => setCalculatorState(prev => ({ ...prev, stake4: value, fixedField: 'stake4' }));
    const setStake5 = (value: number) => setCalculatorState(prev => ({ ...prev, stake5: value, fixedField: 'stake5' }));
    const setStake6 = (value: number) => setCalculatorState(prev => ({ ...prev, stake6: value, fixedField: 'stake6' }));
    const setStake7 = (value: number) => setCalculatorState(prev => ({ ...prev, stake7: value, fixedField: 'stake7' }));
    const setStake8 = (value: number) => setCalculatorState(prev => ({ ...prev, stake8: value, fixedField: 'stake8' }));
    const setFixedField = (value: StakeField8Way) => setCalculatorState(prev => ({ ...prev, fixedField: value }));
    const setName = (value: string) => setCalculatorState(prev => ({ ...prev, name: value }));

    useEffect(() => {
        if (!initialParams) return;
        let newState = { ...calculatorState };
        if (initialParams.odds1) newState.odds1 = initialParams.odds1;
        if (initialParams.odds2) newState.odds2 = initialParams.odds2;
        if (initialParams.odds3) newState.odds3 = initialParams.odds3;
        if (initialParams.odds4) newState.odds4 = initialParams.odds4;
        if (initialParams.odds5) newState.odds5 = initialParams.odds5;
        if (initialParams.odds6) newState.odds6 = initialParams.odds6;
        if (initialParams.odds7) newState.odds7 = initialParams.odds7;
        if (initialParams.odds8) newState.odds8 = initialParams.odds8;
        if (initialParams.stake1) newState.stake1 = Number(initialParams.stake1);
        if (initialParams.stake2) newState.stake2 = Number(initialParams.stake2);
        if (initialParams.stake3) newState.stake3 = Number(initialParams.stake3);
        if (initialParams.stake4) newState.stake4 = Number(initialParams.stake4);
        if (initialParams.stake5) newState.stake5 = Number(initialParams.stake5);
        if (initialParams.stake6) newState.stake6 = Number(initialParams.stake6);
        if (initialParams.stake7) newState.stake7 = Number(initialParams.stake7);
        if (initialParams.stake8) newState.stake8 = Number(initialParams.stake8);
        if (initialParams.name) newState.name = initialParams.name;
        if (initialParams.stake1 || initialParams.stake2 || initialParams.stake3 || initialParams.stake4 || initialParams.stake5 || initialParams.stake6 || initialParams.stake7 || initialParams.stake8) {
            newState.fixedField = initialParams.stake1 ? 'stake1' : initialParams.stake2 ? 'stake2' : initialParams.stake3 ? 'stake3' : initialParams.stake4 ? 'stake4' : initialParams.stake5 ? 'stake5' : initialParams.stake6 ? 'stake6' : initialParams.stake7 ? 'stake7' : 'stake8';
        } else if (initialParams.totalStake) {
            newState.totalStake = initialParams.totalStake;
            newState.fixedField = 'total';
        }
        setCalculatorState(newState);
    }, [initialParams]);

    const { stake1: calcStake1, stake2: calcStake2, stake3: calcStake3, stake4: calcStake4, stake5: calcStake5, stake6: calcStake6, stake7: calcStake7, stake8: calcStake8, totalStake: calcTotalStake, profit, profitPercentage } = useSurebet8Way({
        odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8,
        totalStake,
        stake1, stake2, stake3, stake4, stake5, stake6, stake7, stake8,
        fixedField,
    });

    const setFieldsFromBet = (bet: any) => {
        setCalculatorState(prev => ({
            ...prev,
            odds1: bet.odds1, odds2: bet.odds2, odds3: bet.odds3, odds4: bet.odds4, odds5: bet.odds5, odds6: bet.odds6, odds7: bet.odds7, odds8: bet.odds8,
            odds1Type: bet.odds1Type || "", odds2Type: bet.odds2Type || "", odds3Type: bet.odds3Type || "", odds4Type: bet.odds4Type || "", odds5Type: bet.odds5Type || "", odds6Type: bet.odds6Type || "", odds7Type: bet.odds7Type || "", odds8Type: bet.odds8Type || "",
            stake1: Number(bet.stake1) || 0, stake2: Number(bet.stake2) || 0, stake3: Number(bet.stake3) || 0, stake4: Number(bet.stake4) || 0, stake5: Number(bet.stake5) || 0, stake6: Number(bet.stake6) || 0, stake7: Number(bet.stake7) || 0, stake8: Number(bet.stake8) || 0,
            totalStake: String(bet.totalStake) || "0",
            fixedField: bet.fixedField,
            name: bet.name || prev.name
        }));
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CalculatorHeader title="8-Way Calculator" value={profitPercentage} onReset={resetCalculatorState} />
            <CardContent className="relative grid gap-4 pt-4">
                <OddsStakeRow<StakeField8Way> oddsType={odds1Type} setOddsType={setOdds1Type} odds={odds1} setOdds={setOdds1} stake={calcStake1} setStake={setStake1} labelOdds="Odds 1" labelStake="Stake 1" oddsId="odds1-8way" stakeId="stake1-8way" fixedField={fixedField} setFixedField={setFixedField} stakeFieldName="stake1" />
                <OddsStakeRow<StakeField8Way> oddsType={odds2Type} setOddsType={setOdds2Type} odds={odds2} setOdds={setOdds2} stake={calcStake2} setStake={setStake2} labelOdds="Odds 2" labelStake="Stake 2" oddsId="odds2-8way" stakeId="stake2-8way" fixedField={fixedField} setFixedField={setFixedField} stakeFieldName="stake2" />
                <OddsStakeRow<StakeField8Way> oddsType={odds3Type} setOddsType={setOdds3Type} odds={odds3} setOdds={setOdds3} stake={calcStake3} setStake={setStake3} labelOdds="Odds 3" labelStake="Stake 3" oddsId="odds3-8way" stakeId="stake3-8way" fixedField={fixedField} setFixedField={setFixedField} stakeFieldName="stake3" />
                <OddsStakeRow<StakeField8Way> oddsType={odds4Type} setOddsType={setOdds4Type} odds={odds4} setOdds={setOdds4} stake={calcStake4} setStake={setStake4} labelOdds="Odds 4" labelStake="Stake 4" oddsId="odds4-8way" stakeId="stake4-8way" fixedField={fixedField} setFixedField={setFixedField} stakeFieldName="stake4" />
                <OddsStakeRow<StakeField8Way> oddsType={odds5Type} setOddsType={setOdds5Type} odds={odds5} setOdds={setOdds5} stake={calcStake5} setStake={setStake5} labelOdds="Odds 5" labelStake="Stake 5" oddsId="odds5-8way" stakeId="stake5-8way" fixedField={fixedField} setFixedField={setFixedField} stakeFieldName="stake5" />
                <OddsStakeRow<StakeField8Way> oddsType={odds6Type} setOddsType={setOdds6Type} odds={odds6} setOdds={setOdds6} stake={calcStake6} setStake={setStake6} labelOdds="Odds 6" labelStake="Stake 6" oddsId="odds6-8way" stakeId="stake6-8way" fixedField={fixedField} setFixedField={setFixedField} stakeFieldName="stake6" />
                <OddsStakeRow<StakeField8Way> oddsType={odds7Type} setOddsType={setOdds7Type} odds={odds7} setOdds={setOdds7} stake={calcStake7} setStake={setStake7} labelOdds="Odds 7" labelStake="Stake 7" oddsId="odds7-8way" stakeId="stake7-8way" fixedField={fixedField} setFixedField={setFixedField} stakeFieldName="stake7" />
                <OddsStakeRow<StakeField8Way> oddsType={odds8Type} setOddsType={setOdds8Type} odds={odds8} setOdds={setOdds8} stake={calcStake8} setStake={setStake8} labelOdds="Odds 8" labelStake="Stake 8" oddsId="odds8-8way" stakeId="stake8-8way" fixedField={fixedField} setFixedField={setFixedField} stakeFieldName="stake8" />
                <TotalStakeRow totalStake={calcTotalStake} setTotalStake={setTotalStake} fixedField={fixedField} setFixedField={setFixedField} />
                <ProfitDisplay profit={profit} />
                <BetSaveSection
                    betFields={{ odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8, odds1Type, odds2Type, odds3Type, odds4Type, odds5Type, odds6Type, odds7Type, odds8Type, stake1: calcStake1, stake2: calcStake2, stake3: calcStake3, stake4: calcStake4, stake5: calcStake5, stake6: calcStake6, stake7: calcStake7, stake8: calcStake8, totalStake: calcTotalStake, fixedField }}
                    betName={name} setBetName={setName}
                    storageKey="savedBets8Way"
                    setFieldsFromBet={setFieldsFromBet}
                />
            </CardContent>
        </Card>
    );
};

export default SureBetCalculator8Way;
