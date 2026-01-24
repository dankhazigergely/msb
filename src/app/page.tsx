"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SureBetCalculator2Way from "./features/SureBetCalculator2Way";
import SureBetCalculator3Way from "./features/SureBetCalculator3Way";
import SureBetCalculator4Way from "./features/SureBetCalculator4Way";
import SureBetCalculator5Way from "./features/SureBetCalculator5Way";
import SureBetCalculator6Way from "./features/SureBetCalculator6Way";
import SureBetCalculator7Way from "./features/SureBetCalculator7Way";
import SureBetCalculator8Way from "./features/SureBetCalculator8Way";
import { StakeField2Way, StakeField3Way, StakeField4Way, StakeField5Way, StakeField6Way, StakeField7Way, StakeField8Way } from "@/app/types/surebet";

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

const defaultCalculatorState5Way = {
  odds1: "5",
  odds2: "5",
  odds3: "5",
  odds4: "5",
  odds5: "5",
  odds1Type: "",
  odds2Type: "",
  odds3Type: "",
  odds4Type: "",
  odds5Type: "",
  totalStake: "10000",
  stake1: 0,
  stake2: 0,
  stake3: 0,
  stake4: 0,
  stake5: 0,
  fixedField: "total" as StakeField5Way,
  name: "",
};

const defaultCalculatorState6Way = {
  odds1: "6",
  odds2: "6",
  odds3: "6",
  odds4: "6",
  odds5: "6",
  odds6: "6",
  odds1Type: "",
  odds2Type: "",
  odds3Type: "",
  odds4Type: "",
  odds5Type: "",
  odds6Type: "",
  totalStake: "10000",
  stake1: 0,
  stake2: 0,
  stake3: 0,
  stake4: 0,
  stake5: 0,
  stake6: 0,
  fixedField: "total" as StakeField6Way,
  name: "",
};

const defaultCalculatorState7Way = {
  odds1: "7",
  odds2: "7",
  odds3: "7",
  odds4: "7",
  odds5: "7",
  odds6: "7",
  odds7: "7",
  odds1Type: "",
  odds2Type: "",
  odds3Type: "",
  odds4Type: "",
  odds5Type: "",
  odds6Type: "",
  odds7Type: "",
  totalStake: "10000",
  stake1: 0,
  stake2: 0,
  stake3: 0,
  stake4: 0,
  stake5: 0,
  stake6: 0,
  stake7: 0,
  fixedField: "total" as StakeField7Way,
  name: "",
};

const defaultCalculatorState8Way = {
  odds1: "8",
  odds2: "8",
  odds3: "8",
  odds4: "8",
  odds5: "8",
  odds6: "8",
  odds7: "8",
  odds8: "8",
  odds1Type: "",
  odds2Type: "",
  odds3Type: "",
  odds4Type: "",
  odds5Type: "",
  odds6Type: "",
  odds7Type: "",
  odds8Type: "",
  totalStake: "10000",
  stake1: 0,
  stake2: 0,
  stake3: 0,
  stake4: 0,
  stake5: 0,
  stake6: 0,
  stake7: 0,
  stake8: 0,
  fixedField: "total" as StakeField8Way,
  name: "",
};

export type CalculatorState2Way = typeof defaultCalculatorState2Way;
export type CalculatorState3Way = typeof defaultCalculatorState3Way;
export type CalculatorState4Way = typeof defaultCalculatorState4Way;
export type CalculatorState5Way = typeof defaultCalculatorState5Way;
export type CalculatorState6Way = typeof defaultCalculatorState6Way;
export type CalculatorState7Way = typeof defaultCalculatorState7Way;
export type CalculatorState8Way = typeof defaultCalculatorState8Way;

export default function Home() {
  const [activeTab, setActiveTab] = useState("2-way");
  const [initialParams, setInitialParams] = useState<Record<string, string> | undefined>(undefined);

  // Kalkulátorok állapotának közös kezelése
  const [calculatorState2Way, setCalculatorState2Way] = useState<CalculatorState2Way>(defaultCalculatorState2Way);
  const [calculatorState3Way, setCalculatorState3Way] = useState<CalculatorState3Way>(defaultCalculatorState3Way);
  const [calculatorState4Way, setCalculatorState4Way] = useState<CalculatorState4Way>(defaultCalculatorState4Way);
  const [calculatorState5Way, setCalculatorState5Way] = useState<CalculatorState5Way>(defaultCalculatorState5Way);
  const [calculatorState6Way, setCalculatorState6Way] = useState<CalculatorState6Way>(defaultCalculatorState6Way);
  const [calculatorState7Way, setCalculatorState7Way] = useState<CalculatorState7Way>(defaultCalculatorState7Way);
  const [calculatorState8Way, setCalculatorState8Way] = useState<CalculatorState8Way>(defaultCalculatorState8Way);

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    const hasAny = Object.keys(params).length > 0;
    if (hasAny) {
      setInitialParams(params);
      if (params.odds8) setActiveTab("8-way");
      else if (params.odds7) setActiveTab("7-way");
      else if (params.odds6) setActiveTab("6-way");
      else if (params.odds5) setActiveTab("5-way");
      else if (params.odds4) setActiveTab("4-way");
      else if (params.odds3) setActiveTab("3-way");
      else setActiveTab("2-way");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setInitialParams(undefined);
    }
  }, []);

  useEffect(() => {
    if (initialParams) {
      setTimeout(() => setInitialParams(undefined), 0);
    }
  }, [initialParams]);

  const resetCalculatorState = (calculatorType: '2-way' | '3-way' | '4-way' | '5-way' | '6-way' | '7-way' | '8-way') => {
    switch (calculatorType) {
      case '2-way': setCalculatorState2Way(defaultCalculatorState2Way); break;
      case '3-way': setCalculatorState3Way(defaultCalculatorState3Way); break;
      case '4-way': setCalculatorState4Way(defaultCalculatorState4Way); break;
      case '5-way': setCalculatorState5Way(defaultCalculatorState5Way); break;
      case '6-way': setCalculatorState6Way(defaultCalculatorState6Way); break;
      case '7-way': setCalculatorState7Way(defaultCalculatorState7Way); break;
      case '8-way': setCalculatorState8Way(defaultCalculatorState8Way); break;
    }
  };

  return (
    <div className="container mx-auto py-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex gap-2 p-4 mb-2 justify-center max-w-md mx-auto h-auto bg-transparent">
          <TabsTrigger value="2-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md dark:bg-neutral-700 dark:text-neutral-400 dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
            2
          </TabsTrigger>
          <TabsTrigger value="3-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md dark:bg-neutral-700 dark:text-neutral-400 dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
            3
          </TabsTrigger>
          <TabsTrigger value="4-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md dark:bg-neutral-700 dark:text-neutral-400 dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
            4
          </TabsTrigger>
          <TabsTrigger value="5-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md dark:bg-neutral-700 dark:text-neutral-400 dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
            5
          </TabsTrigger>
          <TabsTrigger value="6-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md dark:bg-neutral-700 dark:text-neutral-400 dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
            6
          </TabsTrigger>
          <TabsTrigger value="7-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md dark:bg-neutral-700 dark:text-neutral-400 dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
            7
          </TabsTrigger>
          <TabsTrigger value="8-way" className="px-6 py-2 rounded-full bg-white shadow hover:bg-blue-100 hover:text-blue-700 transition font-semibold border border-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md dark:bg-neutral-700 dark:text-neutral-400 dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
            8
          </TabsTrigger>
        </TabsList>
        <TabsContent value="2-way">
          <SureBetCalculator2Way initialParams={activeTab === "2-way" ? initialParams : undefined} calculatorState={calculatorState2Way} setCalculatorState={setCalculatorState2Way} resetCalculatorState={() => resetCalculatorState('2-way')} />
        </TabsContent>
        <TabsContent value="3-way">
          <SureBetCalculator3Way initialParams={activeTab === "3-way" ? initialParams : undefined} calculatorState={calculatorState3Way} setCalculatorState={setCalculatorState3Way} resetCalculatorState={() => resetCalculatorState('3-way')} />
        </TabsContent>
        <TabsContent value="4-way">
          <SureBetCalculator4Way initialParams={activeTab === "4-way" ? initialParams : undefined} calculatorState={calculatorState4Way} setCalculatorState={setCalculatorState4Way} resetCalculatorState={() => resetCalculatorState('4-way')} />
        </TabsContent>
        <TabsContent value="5-way">
          <SureBetCalculator5Way initialParams={activeTab === "5-way" ? initialParams : undefined} calculatorState={calculatorState5Way} setCalculatorState={setCalculatorState5Way} resetCalculatorState={() => resetCalculatorState('5-way')} />
        </TabsContent>
        <TabsContent value="6-way">
          <SureBetCalculator6Way initialParams={activeTab === "6-way" ? initialParams : undefined} calculatorState={calculatorState6Way} setCalculatorState={setCalculatorState6Way} resetCalculatorState={() => resetCalculatorState('6-way')} />
        </TabsContent>
        <TabsContent value="7-way">
          <SureBetCalculator7Way initialParams={activeTab === "7-way" ? initialParams : undefined} calculatorState={calculatorState7Way} setCalculatorState={setCalculatorState7Way} resetCalculatorState={() => resetCalculatorState('7-way')} />
        </TabsContent>
        <TabsContent value="8-way">
          <SureBetCalculator8Way initialParams={activeTab === "8-way" ? initialParams : undefined} calculatorState={calculatorState8Way} setCalculatorState={setCalculatorState8Way} resetCalculatorState={() => resetCalculatorState('8-way')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
