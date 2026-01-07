import { useEffect } from "react";
import { useSurebet5Way } from "@/app/hooks/useSurebet5Way";
import { Card, CardContent } from "@/components/ui/card";
import BetSaveSection from "@/app/components/BetSaveSection";
import OddsStakeRow from "@/app/components/OddsStakeRow";
import TotalStakeRow from "@/app/components/TotalStakeRow";
import ProfitDisplay from "@/app/components/ProfitDisplay";
import CalculatorHeader from "@/app/components/CalculatorHeader";
import { StakeField5Way } from "@/app/types/surebet";
import { CalculatorState5Way } from "@/app/page";

interface SureBetCalculator5WayProps {
    initialParams?: Record<string, string>;
    calculatorState: CalculatorState5Way;
    setCalculatorState: React.Dispatch<React.SetStateAction<CalculatorState5Way>>;
    resetCalculatorState: () => void;
}

const SureBetCalculator5Way: React.FC<SureBetCalculator5WayProps> = ({
    initialParams,
    calculatorState,
    setCalculatorState,
    resetCalculatorState,
}) => {
    const {
        odds1, odds2, odds3, odds4, odds5,
        odds1Type, odds2Type, odds3Type, odds4Type, odds5Type,
        totalStake,
        stake1, stake2, stake3, stake4, stake5,
        fixedField, name
    } = calculatorState;

    const setOdds1 = (value: string) => setCalculatorState(prev => ({ ...prev, odds1: value }));
    const setOdds2 = (value: string) => setCalculatorState(prev => ({ ...prev, odds2: value }));
    const setOdds3 = (value: string) => setCalculatorState(prev => ({ ...prev, odds3: value }));
    const setOdds4 = (value: string) => setCalculatorState(prev => ({ ...prev, odds4: value }));
    const setOdds5 = (value: string) => setCalculatorState(prev => ({ ...prev, odds5: value }));
    const setOdds1Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds1Type: value }));
    const setOdds2Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds2Type: value }));
    const setOdds3Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds3Type: value }));
    const setOdds4Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds4Type: value }));
    const setOdds5Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds5Type: value }));
    const setTotalStake = (value: string) => setCalculatorState(prev => ({ ...prev, totalStake: value, fixedField: 'total' }));
    const setStake1 = (value: number) => setCalculatorState(prev => ({ ...prev, stake1: value, fixedField: 'stake1' }));
    const setStake2 = (value: number) => setCalculatorState(prev => ({ ...prev, stake2: value, fixedField: 'stake2' }));
    const setStake3 = (value: number) => setCalculatorState(prev => ({ ...prev, stake3: value, fixedField: 'stake3' }));
    const setStake4 = (value: number) => setCalculatorState(prev => ({ ...prev, stake4: value, fixedField: 'stake4' }));
    const setStake5 = (value: number) => setCalculatorState(prev => ({ ...prev, stake5: value, fixedField: 'stake5' }));
    const setFixedField = (value: StakeField5Way) => setCalculatorState(prev => ({ ...prev, fixedField: value }));
    const setName = (value: string) => setCalculatorState(prev => ({ ...prev, name: value }));

    useEffect(() => {
        if (!initialParams) return;
        let newState = { ...calculatorState };
        if (initialParams.odds1) newState.odds1 = initialParams.odds1;
        if (initialParams.odds2) newState.odds2 = initialParams.odds2;
        if (initialParams.odds3) newState.odds3 = initialParams.odds3;
        if (initialParams.odds4) newState.odds4 = initialParams.odds4;
        if (initialParams.odds5) newState.odds5 = initialParams.odds5;
        if (initialParams.stake1) newState.stake1 = Number(initialParams.stake1);
        if (initialParams.stake2) newState.stake2 = Number(initialParams.stake2);
        if (initialParams.stake3) newState.stake3 = Number(initialParams.stake3);
        if (initialParams.stake4) newState.stake4 = Number(initialParams.stake4);
        if (initialParams.stake5) newState.stake5 = Number(initialParams.stake5);
        if (initialParams.name) newState.name = initialParams.name;
        if (initialParams.stake1 || initialParams.stake2 || initialParams.stake3 || initialParams.stake4 || initialParams.stake5) {
            newState.fixedField = initialParams.stake1 ? 'stake1' : initialParams.stake2 ? 'stake2' : initialParams.stake3 ? 'stake3' : initialParams.stake4 ? 'stake4' : 'stake5';
        } else if (initialParams.totalStake) {
            newState.totalStake = initialParams.totalStake;
            newState.fixedField = 'total';
        }
        setCalculatorState(newState);
    }, [initialParams]);

    const { stake1: calcStake1, stake2: calcStake2, stake3: calcStake3, stake4: calcStake4, stake5: calcStake5, totalStake: calcTotalStake, profit, profitPercentage } = useSurebet5Way({
        odds1, odds2, odds3, odds4, odds5,
        totalStake,
        stake1, stake2, stake3, stake4, stake5,
        fixedField,
    });

    const setFieldsFromBet = (bet: any) => {
        setCalculatorState(prev => ({
            ...prev,
            odds1: bet.odds1,
            odds2: bet.odds2,
            odds3: bet.odds3,
            odds4: bet.odds4,
            odds5: bet.odds5,
            odds1Type: bet.odds1Type || "",
            odds2Type: bet.odds2Type || "",
            odds3Type: bet.odds3Type || "",
            odds4Type: bet.odds4Type || "",
            odds5Type: bet.odds5Type || "",
            stake1: Number(bet.stake1) || 0,
            stake2: Number(bet.stake2) || 0,
            stake3: Number(bet.stake3) || 0,
            stake4: Number(bet.stake4) || 0,
            stake5: Number(bet.stake5) || 0,
            totalStake: String(bet.totalStake) || "0",
            fixedField: bet.fixedField,
            name: bet.name || prev.name
        }));
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CalculatorHeader title="5-Way Calculator" value={profitPercentage} onReset={resetCalculatorState} />
            <CardContent className="relative grid gap-4 pt-4">
                <OddsStakeRow<StakeField5Way>
                    oddsType={odds1Type} setOddsType={setOdds1Type}
                    odds={odds1} setOdds={setOdds1}
                    stake={calcStake1} setStake={setStake1}
                    labelOdds="Odds 1" labelStake="Stake 1"
                    oddsId="odds1-5way" stakeId="stake1-5way"
                    fixedField={fixedField} setFixedField={setFixedField}
                    stakeFieldName="stake1"
                />
                <OddsStakeRow<StakeField5Way>
                    oddsType={odds2Type} setOddsType={setOdds2Type}
                    odds={odds2} setOdds={setOdds2}
                    stake={calcStake2} setStake={setStake2}
                    labelOdds="Odds 2" labelStake="Stake 2"
                    oddsId="odds2-5way" stakeId="stake2-5way"
                    fixedField={fixedField} setFixedField={setFixedField}
                    stakeFieldName="stake2"
                />
                <OddsStakeRow<StakeField5Way>
                    oddsType={odds3Type} setOddsType={setOdds3Type}
                    odds={odds3} setOdds={setOdds3}
                    stake={calcStake3} setStake={setStake3}
                    labelOdds="Odds 3" labelStake="Stake 3"
                    oddsId="odds3-5way" stakeId="stake3-5way"
                    fixedField={fixedField} setFixedField={setFixedField}
                    stakeFieldName="stake3"
                />
                <OddsStakeRow<StakeField5Way>
                    oddsType={odds4Type} setOddsType={setOdds4Type}
                    odds={odds4} setOdds={setOdds4}
                    stake={calcStake4} setStake={setStake4}
                    labelOdds="Odds 4" labelStake="Stake 4"
                    oddsId="odds4-5way" stakeId="stake4-5way"
                    fixedField={fixedField} setFixedField={setFixedField}
                    stakeFieldName="stake4"
                />
                <OddsStakeRow<StakeField5Way>
                    oddsType={odds5Type} setOddsType={setOdds5Type}
                    odds={odds5} setOdds={setOdds5}
                    stake={calcStake5} setStake={setStake5}
                    labelOdds="Odds 5" labelStake="Stake 5"
                    oddsId="odds5-5way" stakeId="stake5-5way"
                    fixedField={fixedField} setFixedField={setFixedField}
                    stakeFieldName="stake5"
                />
                <TotalStakeRow
                    totalStake={calcTotalStake} setTotalStake={setTotalStake}
                    fixedField={fixedField} setFixedField={setFixedField}
                />
                <ProfitDisplay profit={profit} />
                <BetSaveSection
                    betFields={{
                        odds1, odds2, odds3, odds4, odds5,
                        odds1Type, odds2Type, odds3Type, odds4Type, odds5Type,
                        stake1: calcStake1, stake2: calcStake2, stake3: calcStake3, stake4: calcStake4, stake5: calcStake5,
                        totalStake: calcTotalStake,
                        fixedField
                    }}
                    betName={name} setBetName={setName}
                    storageKey="savedBets5Way"
                    setFieldsFromBet={setFieldsFromBet}
                />
            </CardContent>
        </Card>
    );
};

export default SureBetCalculator5Way;
