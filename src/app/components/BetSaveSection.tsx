import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const betLabelFn = (bet: any) => {
  const oddsParts = [];
  if (bet.odds1) oddsParts.push(`${bet.odds1Type || '-'} ${bet.odds1}`);
  if (bet.odds2) oddsParts.push(`${bet.odds2Type || '-'} ${bet.odds2}`);
  if (bet.odds3) oddsParts.push(`${bet.odds3Type || '-'} ${bet.odds3}`);
  if (bet.odds4) oddsParts.push(`${bet.odds4Type || '-'} ${bet.odds4}`);
  return (
    <>
      <span className="font-bold">{bet.name}</span>
      <span className="text-xs">{` (${oddsParts.join(' / ')} / ${bet.totalStake})`}</span>
    </>
  );
};

interface BetSaveSectionProps {
  betFields: Record<string, any>;
  storageKey: string;
  setFieldsFromBet: (bet: any) => void;
}

const BetSaveSection: React.FC<BetSaveSectionProps> = ({
  betFields, storageKey, setFieldsFromBet
}) => {
  const [betName, setBetName] = React.useState("");
  const [savedBets, setSavedBets] = React.useState<any[]>([]);

  React.useEffect(() => {
    const storedBets = localStorage.getItem(storageKey);
    if (storedBets) setSavedBets(JSON.parse(storedBets));
  }, [storageKey]);
  const handleSaveBet = () => {
    const trimmedName = betName.trim() || `Bet ${savedBets.length + 1}`;
    const newBet = { name: trimmedName, ...betFields };
    const filteredBets = savedBets.filter(bet => bet.name !== trimmedName);
    const updatedBets = [...filteredBets, newBet];
    setSavedBets(updatedBets);
    setBetName("");
    localStorage.setItem(storageKey, JSON.stringify(updatedBets));
  };

  return (
    <>
      <div className="flex gap-2 pt-0">
        <input
          type="text"
          value={betName}
          onChange={e => setBetName(e.target.value)}
          placeholder="Name"
          className="flex-1 px-2 py-1 border rounded h-10"
        />
        <Button onClick={handleSaveBet} className="flex-1 h-10">
          Save
        </Button>
      </div>
      <div>
        {savedBets.map((bet, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <Button onClick={() => {
                setFieldsFromBet(bet);
                setBetName(bet.name || "");
              }} className="flex-1 justify-start text-left">
              {betLabelFn(bet)}
            </Button>
            <Button onClick={() => {
              const updatedBets = savedBets.filter((_, i) => i !== index);
              setSavedBets(updatedBets);
              localStorage.setItem(storageKey, JSON.stringify(updatedBets));
            }} variant="destructive" size="icon" className="ml-2">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default BetSaveSection;
