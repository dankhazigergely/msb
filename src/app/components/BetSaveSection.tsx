import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input component
import { Trash2, Share2 } from "lucide-react";

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
  betName: string;
  setBetName: (name: string) => void;
  storageKey: string;
  setFieldsFromBet: (bet: any) => void;
}

const BetSaveSection: React.FC<BetSaveSectionProps> = ({
  betFields, betName, setBetName, storageKey, setFieldsFromBet
}) => {

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
    localStorage.setItem(storageKey, JSON.stringify(updatedBets));
  };

  const [copied, setCopied] = React.useState(false);

  return (
    <>
      <div className="flex gap-2 pt-0">
        <Input
          type="text"
          id="betNameInput" // Added id
          name="betName"    // Added name
          value={betName}
          onChange={e => setBetName(e.target.value)}
          placeholder="Name"
          // Use similar classes as other Inputs, or rely on Input component's default styling
          // The Input component should already be styled for dark mode.
          className="flex-1 h-10" // Adjusted to match Button height, specific px/py/border/rounded are part of Input
        />
        <Button onClick={handleSaveBet} className="flex-1 h-10">
          Save
        </Button>
        <Button
          onClick={() => {
            const params = new URLSearchParams();
            Object.entries(betFields).forEach(([key, value]) => {
              if (
                value !== undefined &&
                value !== null &&
                value !== "" &&
                (key.startsWith("odds") || key.startsWith("stake"))
              ) {
                params.append(key, value.toString());
              }
            });
            const trimmedName = betName.trim();
            if (trimmedName) {
              params.append("name", trimmedName);
            }
            const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
            navigator.clipboard.writeText(url).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          variant="link"
          size="icon"
          className="h-10"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        {copied && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl shadow-lg z-50 font-semibold text-center animate-fade-in">
            Copied to clipboard!
          </div>
        )}
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
