import { useState } from "react";
import { useSurebet2Way } from "@/app/hooks/useSurebet2Way";
import { Card, CardContent } from "@/components/ui/card";
import BetSaveSection from "@/app/components/BetSaveSection";
import OddsStakeRow from "@/app/components/OddsStakeRow";
import TotalStakeRow from "@/app/components/TotalStakeRow";
import ProfitDisplay from "@/app/components/ProfitDisplay";
import CalculatorHeader from "@/app/components/CalculatorHeader";

import { StakeField2Way } from "@/app/types/surebet";

const SureBetCalculator2Way = () => {
    const [odds1, setOdds1] = useState("2");
    const [odds2, setOdds2] = useState("2");
    const [odds1Type, setOdds1Type] = useState("");
    const [odds2Type, setOdds2Type] = useState("");
    const [totalStake, setTotalStake] = useState("10000");
    const [stake1, setStake1] = useState(0);
    const [stake2, setStake2] = useState(0);
    const [fixedField, setFixedField] = useState<StakeField2Way>('total');

    // Kalkulációk kiszervezve hook-ba
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
        setOdds1(bet.odds1);
        setOdds2(bet.odds2);
        setOdds1Type(bet.odds1Type);
        setOdds2Type(bet.odds2Type);
        setStake1(bet.stake1);
        setStake2(bet.stake2);
        setTotalStake(bet.totalStake);
        setFixedField(bet.fixedField);
    }; // Ez így maradhat, mert a hook automatikusan újraszámol mindent.

    return (
        <Card className="w-full max-w-md mx-auto">
            <CalculatorHeader title="2-Way Calculator" value={profitPercentage} />
            <CardContent className="relative grid gap-4">
                <OddsStakeRow
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
                <OddsStakeRow
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
                        odds1Type,
                        odds2Type,
                        stake1: calcStake1,
                        stake2: calcStake2,
                        totalStake: calcTotalStake,
                        fixedField
                    }}
                    storageKey="savedBets2Way"
                    setFieldsFromBet={setFieldsFromBet}
                />
            </CardContent>
        </Card>
    );
};

export default SureBetCalculator2Way;
