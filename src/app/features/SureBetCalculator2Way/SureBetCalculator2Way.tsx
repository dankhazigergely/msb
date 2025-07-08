import { useEffect } from "react";
import { useSurebet2Way } from "@/app/hooks/useSurebet2Way";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button"; // Button import removed
import BetSaveSection from "@/app/components/BetSaveSection";
import OddsStakeRow from "@/app/components/OddsStakeRow";
import TotalStakeRow from "@/app/components/TotalStakeRow";
import ProfitDisplay from "@/app/components/ProfitDisplay";
import CalculatorHeader from "@/app/components/CalculatorHeader";
import { StakeField2Way } from "@/app/types/surebet";
import { CalculatorState2Way } from "@/app/page"; // Importáljuk a közös állapot típust

interface SureBetCalculator2WayProps {
  initialParams?: Record<string, string>;
  calculatorState: CalculatorState2Way;
  setCalculatorState: React.Dispatch<React.SetStateAction<CalculatorState2Way>>;
  resetCalculatorState: () => void;
}

const SureBetCalculator2Way: React.FC<SureBetCalculator2WayProps> = ({
  initialParams,
  calculatorState,
  setCalculatorState,
  resetCalculatorState,
}) => {
  const {
    odds1,
    odds2,
    odds1Type,
    odds2Type,
    totalStake,
    stake1,
    stake2,
    fixedField,
    name,
  } = calculatorState;

  // Wrapper függvények az állapotfrissítéshez, hogy a setCalculatorState-et használjuk
  const setOdds1 = (value: string) => setCalculatorState(prev => ({ ...prev, odds1: value }));
  const setOdds2 = (value: string) => setCalculatorState(prev => ({ ...prev, odds2: value }));
  const setOdds1Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds1Type: value }));
  const setOdds2Type = (value: string) => setCalculatorState(prev => ({ ...prev, odds2Type: value }));
  const setTotalStake = (value: string) => setCalculatorState(prev => ({ ...prev, totalStake: value, fixedField: 'total' }));
  const setStake1 = (value: number) => setCalculatorState(prev => ({ ...prev, stake1: value, fixedField: 'stake1' }));
  const setStake2 = (value: number) => setCalculatorState(prev => ({ ...prev, stake2: value, fixedField: 'stake2' }));
  const setFixedField = (value: StakeField2Way) => setCalculatorState(prev => ({ ...prev, fixedField: value }));
  const setName = (value: string) => setCalculatorState(prev => ({ ...prev, name: value }));


  // initialParams feldolgozása mountkor vagy amikor initialParams megváltozik
  useEffect(() => {
    if (!initialParams) return;

    let newState = { ...calculatorState };
    if (initialParams.odds1) newState.odds1 = initialParams.odds1;
    if (initialParams.odds2) newState.odds2 = initialParams.odds2;
    // oddsType-okat nem kezelünk initialParams-ból, mert azok mentés specifikusak
    if (initialParams.stake1) newState.stake1 = Number(initialParams.stake1);
    if (initialParams.stake2) newState.stake2 = Number(initialParams.stake2);
    if (initialParams.name) newState.name = initialParams.name;
    // Ha tét van megadva, akkor az legyen a fixált, egyébként a totalStake
    if (initialParams.stake1 || initialParams.stake2) {
        newState.fixedField = initialParams.stake1 ? 'stake1' : 'stake2';
    } else if (initialParams.totalStake) {
        newState.totalStake = initialParams.totalStake;
        newState.fixedField = 'total';
    }
    setCalculatorState(newState);
  }, [initialParams]); // Figyeljünk az initialParams változására


  const { stake1: calcStake1, stake2: calcStake2, totalStake: calcTotalStake, profit, profitPercentage } = useSurebet2Way({
    odds1,
    odds2,
    totalStake,
    stake1,
    stake2,
    fixedField,
  });

  // Segédfüggvény a bet visszatöltéséhez
  const setFieldsFromBet = (bet: any) => {
    setCalculatorState(prev => ({
        ...prev,
        odds1: bet.odds1,
        odds2: bet.odds2,
        odds1Type: bet.odds1Type || "", // Biztosítjuk, hogy string legyen
        odds2Type: bet.odds2Type || "", // Biztosítjuk, hogy string legyen
        stake1: Number(bet.stake1) || 0,
        stake2: Number(bet.stake2) || 0,
        totalStake: String(bet.totalStake) || "0",
        fixedField: bet.fixedField,
        name: bet.name || prev.name // Ha a bet tartalmaz nevet, azt használjuk, egyébként a régit
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CalculatorHeader title="2-Way Calculator" value={profitPercentage} onReset={resetCalculatorState} />
      <CardContent className="relative grid gap-4 pt-4">
        <OddsStakeRow
          oddsType={odds1Type}
          setOddsType={setOdds1Type}
          odds={odds1}
          setOdds={setOdds1}
          stake={calcStake1}
          setStake={setStake1}
          labelOdds="Odds 1"
          labelStake="Stake 1"
          oddsId="odds1-2way"
          stakeId="stake1-2way"
          fixedField={fixedField}
          setFixedField={setFixedField}
          stakeFieldName="stake1"
        />
        <OddsStakeRow
          oddsType={odds2Type}
          setOddsType={setOdds2Type}
          odds={odds2}
          setOdds={setOdds2}
          stake={calcStake2}
          setStake={setStake2}
          labelOdds="Odds 2"
          labelStake="Stake 2"
          oddsId="odds2-2way"
          stakeId="stake2-2way"
          fixedField={fixedField}
          setFixedField={setFixedField}
          stakeFieldName="stake2"
        />
        <TotalStakeRow
          totalStake={calcTotalStake}
          setTotalStake={setTotalStake}
          fixedField={fixedField}
          setFixedField={setFixedField}
        />
        <ProfitDisplay profit={profit} />
        {/* Removed the old Reset button div */}
        <BetSaveSection
          betFields={{
            odds1,
            odds2,
            odds1Type,
            odds2Type,
            stake1: calcStake1,
            stake2: calcStake2,
            totalStake: calcTotalStake,
            fixedField,
          }}
          betName={name}
          setBetName={setName}
          storageKey="savedBets2Way"
          setFieldsFromBet={setFieldsFromBet}
        />
      </CardContent>
    </Card>
  );
};

export default SureBetCalculator2Way;
