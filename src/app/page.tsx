"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SureBetCalculator2Way from "./features/SureBetCalculator2Way";
import SureBetCalculator3Way from "./features/SureBetCalculator3Way";
import SureBetCalculator4Way from "./features/SureBetCalculator4Way";
import { StakeField2Way, StakeField3Way, StakeField4Way } from "@/app/types/surebet";

import { useEffect, useState } from "react";

// Alapértelmezett állapotok definiálása
const defaultCalculatorState2Way = {
  odds1: "2",
  odds2: "2",
  odds1Type: "",
  odds2Type: "",
  totalStake: "10000",
  stake1: 0,
  stake2: 0,
  fixedField: "total" as StakeField2Way,
  name: "",
};

const defaultCalculatorState3Way = {
  odds1: "3",
  odds2: "3",
  odds3: "3",
  odds1Type: "",
  odds2Type: "",
  odds3Type: "",
  totalStake: "10000",
  stake1: 0,
  stake2: 0,
  stake3: 0,
  fixedField: "total" as StakeField3Way,
  name: "",
};

const defaultCalculatorState4Way = {
  odds1: "4",
  odds2: "4",
  odds3: "4",
  odds4: "4",
  odds1Type: "",
  odds2Type: "",
  odds3Type: "",
  odds4Type: "",
  totalStake: "10000",
  stake1: 0,
  stake2: 0,
  stake3: 0,
  stake4: 0,
  fixedField: "total" as StakeField4Way,
  name: "",
};

export type CalculatorState2Way = typeof defaultCalculatorState2Way;
export type CalculatorState3Way = typeof defaultCalculatorState3Way;
export type CalculatorState4Way = typeof defaultCalculatorState4Way;

export default function Home() {
  const [activeTab, setActiveTab] = useState("2-way");
  const [initialParams, setInitialParams] = useState<Record<string, string> | undefined>(undefined);

  // Kalkulátorok állapotának közös kezelése
  const [calculatorState2Way, setCalculatorState2Way] = useState<CalculatorState2Way>(defaultCalculatorState2Way);
  const [calculatorState3Way, setCalculatorState3Way] = useState<CalculatorState3Way>(defaultCalculatorState3Way);
  const [calculatorState4Way, setCalculatorState4Way] = useState<CalculatorState4Way>(defaultCalculatorState4Way);

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    const hasAny = Object.keys(params).length > 0;
    if (hasAny) {
      setInitialParams(params); // Ezt továbbra is beállítjuk, hogy a kalkulátorok feldolgozhassák
      if (params.odds4) setActiveTab("4-way");
      else if (params.odds3) setActiveTab("3-way");
      else setActiveTab("2-way");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setInitialParams(undefined);
      // Alapértelmezett tab beállítása, ha nincsenek paraméterek
      // setActiveTab("2-way"); // Ezt már a useState hook alapértelmezett értéke kezeli
    }
  }, []);

  // Az initialParams feldolgozása és törlése, hogy ne befolyásolja a tabváltásokat
  useEffect(() => {
    if (initialParams) {
      // Itt lehetne közvetlenül frissíteni a megfelelő kalkulátor állapotát az initialParams alapján,
      // de egyszerűbb, ha ezt a kalkulátor komponensek maguk kezelik, ahogy eddig is.
      // A lényeg, hogy az initialParams-t csak egyszer használjuk fel.
      setTimeout(() => setInitialParams(undefined), 0);
    }
  }, [initialParams]);

  const resetCalculatorState = (calculatorType: '2-way' | '3-way' | '4-way') => {
    switch (calculatorType) {
      case '2-way':
        setCalculatorState2Way(defaultCalculatorState2Way);
        break;
      case '3-way':
        setCalculatorState3Way(defaultCalculatorState3Way);
        break;
      case '4-way':
        setCalculatorState4Way(defaultCalculatorState4Way);
        break;
    }
  };

  return (
    <div className="container mx-auto py-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex gap-4 p-4 mb-2 justify-center">
          <TabsTrigger value="2-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
            2-Way
          </TabsTrigger>
          <TabsTrigger value="3-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
            3-Way
          </TabsTrigger>
          <TabsTrigger value="4-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
            4-Way
          </TabsTrigger>
        </TabsList>
        <TabsContent value="2-way">
          <SureBetCalculator2Way
            initialParams={activeTab === "2-way" ? initialParams : undefined}
            calculatorState={calculatorState2Way}
            setCalculatorState={setCalculatorState2Way}
            resetCalculatorState={() => resetCalculatorState('2-way')}
          />
        </TabsContent>
        <TabsContent value="3-way">
          <SureBetCalculator3Way
            initialParams={activeTab === "3-way" ? initialParams : undefined}
            calculatorState={calculatorState3Way}
            setCalculatorState={setCalculatorState3Way}
            resetCalculatorState={() => resetCalculatorState('3-way')}
          />
        </TabsContent>
        <TabsContent value="4-way">
          <SureBetCalculator4Way
            initialParams={activeTab === "4-way" ? initialParams : undefined}
            calculatorState={calculatorState4Way}
            setCalculatorState={setCalculatorState4Way}
            resetCalculatorState={() => resetCalculatorState('4-way')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
