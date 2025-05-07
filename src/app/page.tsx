"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SureBetCalculator2Way from "./features/SureBetCalculator2Way";
import SureBetCalculator3Way from "./features/SureBetCalculator3Way";
import SureBetCalculator4Way from "./features/SureBetCalculator4Way";

import { useEffect, useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("2-way");
  const [initialParams, setInitialParams] = useState<Record<string, string> | undefined>(undefined);

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    const hasAny = Object.keys(params).length > 0;
    if (hasAny) {
      setInitialParams(params);
      if (params.odds4) setActiveTab("4-way");
      else if (params.odds3) setActiveTab("3-way");
      else setActiveTab("2-way");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setInitialParams(undefined);
      setActiveTab("2-way");
    }
  }, []);

  useEffect(() => {
    if (initialParams) {
      setTimeout(() => setInitialParams(undefined), 0);
    }
  }, [initialParams]);

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
          {activeTab === "2-way" && initialParams ? (
            <SureBetCalculator2Way initialParams={initialParams} />
          ) : (
            <SureBetCalculator2Way />
          )}
        </TabsContent>
        <TabsContent value="3-way">
          {activeTab === "3-way" && initialParams ? (
            <SureBetCalculator3Way initialParams={initialParams} />
          ) : (
            <SureBetCalculator3Way />
          )}
        </TabsContent>
        <TabsContent value="4-way">
          {activeTab === "4-way" && initialParams ? (
            <SureBetCalculator4Way initialParams={initialParams} />
          ) : (
            <SureBetCalculator4Way />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
