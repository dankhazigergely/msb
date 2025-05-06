"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SureBetCalculator2Way from "./features/SureBetCalculator2Way";
import SureBetCalculator3Way from "./features/SureBetCalculator3Way";
import SureBetCalculator4Way from "./features/SureBetCalculator4Way";

export default function Home() {
  return (
    <div className="container mx-auto py-2">
      <Tabs defaultValue="2-way" className="w-full">
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
          <SureBetCalculator2Way />
        </TabsContent>
        <TabsContent value="3-way">
          <SureBetCalculator3Way />
        </TabsContent>
        <TabsContent value="4-way">
          <SureBetCalculator4Way />
        </TabsContent>
      </Tabs>
    </div>
  );
}


