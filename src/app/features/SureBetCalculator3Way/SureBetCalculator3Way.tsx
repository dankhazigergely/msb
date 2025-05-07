import { useState, useEffect } from "react";
import { useSurebet3Way } from "@/app/hooks/useSurebet3Way";
import { Card, CardContent } from "@/components/ui/card";
import BetSaveSection from "@/app/components/BetSaveSection";
import OddsStakeRow from "@/app/components/OddsStakeRow";
import TotalStakeRow from "@/app/components/TotalStakeRow";
import ProfitDisplay from "@/app/components/ProfitDisplay";
import CalculatorHeader from "@/app/components/CalculatorHeader";
import { StakeField3Way } from "@/app/types/surebet";

interface SureBetCalculator3WayProps {
  initialParams?: Record<string, string>;
}

const SureBetCalculator3Way: React.FC<SureBetCalculator3WayProps> = ({ initialParams }) => {
    const [fixedField, setFixedField] = useState<StakeField3Way>('total');
    const [odds1, setOdds1] = useState("3");
    const [odds2, setOdds2] = useState("3");
    const [odds3, setOdds3] = useState("3");
    const [odds1Type, setOdds1Type] = useState("");
    const [odds2Type, setOdds2Type] = useState("");
    const [odds3Type, setOdds3Type] = useState("");
    const [totalStake, setTotalStake] = useState("10000");
    const [stake1, setStake1] = useState(0);
    const [stake2, setStake2] = useState(0);
    const [stake3, setStake3] = useState(0);
    const [name, setName] = useState("");

    // initialParams feldolgozása mountkor
    useEffect(() => {
        if (!initialParams) return;
        if (initialParams.odds1) setOdds1(initialParams.odds1);
        if (initialParams.odds2) setOdds2(initialParams.odds2);
        if (initialParams.odds3) setOdds3(initialParams.odds3);
        if (initialParams.stake1) setStake1(Number(initialParams.stake1));
        if (initialParams.stake2) setStake2(Number(initialParams.stake2));
        if (initialParams.stake3) setStake3(Number(initialParams.stake3));
        if (initialParams.name) setName(initialParams.name);
        setFixedField('stake1');
    }, [initialParams]);

    // Kalkulációk kiszervezve hook-ba
    const { stake1: calcStake1, stake2: calcStake2, stake3: calcStake3, totalStake: calcTotalStake, profit, profitPercentage } = useSurebet3Way({
        odds1,
        odds2,
        odds3,
        totalStake,
        stake1,
        stake2,
        stake3,
        fixedField,
    });

    // Segédfüggvény a bet visszatöltéséhez
    const setFieldsFromBet = (bet: any) => {
        setOdds1(bet.odds1);
        setOdds2(bet.odds2);
        setOdds3(bet.odds3);
        setOdds1Type(bet.odds1Type);
        setOdds2Type(bet.odds2Type);
        setOdds3Type(bet.odds3Type);
        setStake1(bet.stake1);
        setStake2(bet.stake2);
        setStake3(bet.stake3);
        setTotalStake(bet.totalStake);
        setFixedField(bet.fixedField);
    }; // A hook automatikusan újraszámol mindent.

    return (
        <Card className="w-full max-w-md mx-auto">
            <CalculatorHeader title="3-Way Calculator" value={profitPercentage} />
            <CardContent className="relative grid gap-4">
                <OddsStakeRow<StakeField3Way>
                    oddsType={odds1Type}
                    setOddsType={setOdds1Type}
                    odds={odds1}
                    setOdds={setOdds1}
                    stake={calcStake1}
                    setStake={setStake1}
                    labelOdds="Odds 1"
                    labelStake="Stake 1"
                    oddsId="odds1"
                    stakeId="stake1"
                    fixedField={fixedField}
                    setFixedField={setFixedField}
                    stakeFieldName="stake1"
                />
                <OddsStakeRow<StakeField3Way>
                    oddsType={odds2Type}
                    setOddsType={setOdds2Type}
                    odds={odds2}
                    setOdds={setOdds2}
                    stake={calcStake2}
                    setStake={setStake2}
                    labelOdds="Odds 2"
                    labelStake="Stake 2"
                    oddsId="odds2"
                    stakeId="stake2"
                    fixedField={fixedField}
                    setFixedField={setFixedField}
                    stakeFieldName="stake2"
                />
                <OddsStakeRow<StakeField3Way>
                    oddsType={odds3Type}
                    setOddsType={setOdds3Type}
                    odds={odds3}
                    setOdds={setOdds3}
                    stake={calcStake3}
                    setStake={setStake3}
                    labelOdds="Odds 3"
                    labelStake="Stake 3"
                    oddsId="odds3"
                    stakeId="stake3"
                    fixedField={fixedField}
                    setFixedField={setFixedField}
                    stakeFieldName="stake3"
                />
                <TotalStakeRow
                    totalStake={calcTotalStake}
                    setTotalStake={setTotalStake}
                    fixedField={fixedField}
                    setFixedField={setFixedField}
                />
                <ProfitDisplay profit={profit} />
                <BetSaveSection
                    betFields={{
                        odds1,
                        odds2,
                        odds3,
                        odds1Type,
                        odds2Type,
                        odds3Type,
                        stake1: calcStake1,
                        stake2: calcStake2,
                        stake3: calcStake3,
                        totalStake: calcTotalStake,
                        fixedField
                    }}
                    betName={name}
                    setBetName={setName}
                    storageKey="savedBets3Way"
                    setFieldsFromBet={setFieldsFromBet}
                />
            </CardContent>
        </Card>
    );
};

export default SureBetCalculator3Way;
