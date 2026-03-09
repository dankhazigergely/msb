"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SureBetCalculatorNWay, { createDefaultNWayState, CalculatorStateNWay } from "./features/SureBetCalculatorNWay";

export default function Home() {
  const [wayCount, setWayCount] = useState(2);
  const [calculatorState, setCalculatorState] = useState<CalculatorStateNWay>(() => createDefaultNWayState(2));
  const [initialParams, setInitialParams] = useState<Record<string, string> | undefined>(undefined);
  const [menuExpanded, setMenuExpanded] = useState(false);
  // N-Way (10-20) select állapot
  const [nWaySelectCount, setNWaySelectCount] = useState(10);

  // Tárolt állapotok way count-onként
  const statesRef = useRef<Map<number, CalculatorStateNWay>>(new Map([[2, createDefaultNWayState(2)]]));

  // calculatorState változásakor mindig frissítjük a map-et
  const setCalculatorStateAndStore = useCallback((stateOrUpdater: CalculatorStateNWay | ((prev: CalculatorStateNWay) => CalculatorStateNWay)) => {
    setCalculatorState(prev => {
      const newState = typeof stateOrUpdater === 'function' ? stateOrUpdater(prev) : stateOrUpdater;
      statesRef.current.set(wayCount, newState);
      return newState;
    });
  }, [wayCount]);

  // Way count változásnál állapot megőrzése/visszaállítása
  const handleWayCountChange = (newCount: number) => {
    // Mentsük az aktuális állapotot
    statesRef.current.set(wayCount, calculatorState);
    setWayCount(newCount);
    // Ha volt korábban mentett állapot, azt állítsuk vissza
    const saved = statesRef.current.get(newCount);
    if (saved) {
      setCalculatorState(saved);
    } else {
      const defaultState = createDefaultNWayState(newCount);
      statesRef.current.set(newCount, defaultState);
      setCalculatorState(defaultState);
    }
  };

  // N-Way select változás kezelése
  const handleNWaySelectChange = (newCount: number) => {
    setNWaySelectCount(newCount);
    handleWayCountChange(newCount);
  };

  // URL paraméterek feldolgozása
  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    const hasAny = Object.keys(params).length > 0;
    if (hasAny) {
      let maxOddsIdx = 0;
      for (let i = 20; i >= 1; i--) {
        if (params[`odds${i}`]) { maxOddsIdx = i; break; }
      }
      const count = Math.max(maxOddsIdx, 2);
      if (count >= 10) {
        setNWaySelectCount(count);
      }
      setWayCount(count);
      const defaultState = createDefaultNWayState(count);
      statesRef.current.set(count, defaultState);
      setCalculatorState(defaultState);
      setInitialParams(params);
      if (count >= 5) setMenuExpanded(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (initialParams) {
      setTimeout(() => setInitialParams(undefined), 0);
    }
  }, [initialParams]);

  const resetCalculatorState = () => {
    const defaultState = createDefaultNWayState(wayCount);
    statesRef.current.set(wayCount, defaultState);
    setCalculatorState(defaultState);
  };

  // Aktív tab detektálás a "..." gomb stílusához
  const isHigherTabActive = wayCount >= 5;
  const isNWayActive = wayCount >= 10;

  const tabButtonClass = (active: boolean, sizeClasses: string = "px-3 py-2") =>
    `flex-1 flex justify-center items-center ${sizeClasses} rounded-full shadow transition border ${active
      ? "bg-blue-600 text-white shadow-md border-blue-600"
      : "bg-white hover:bg-blue-100 hover:text-blue-700 border-gray-200 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600"
    }`;

  return (
    <div className="container mx-auto py-2">
      {/* Gombok */}
      <div className="flex gap-1.5 p-3 mb-2 justify-between max-w-md mx-auto h-auto w-full">
        {[2, 3, 4].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => handleWayCountChange(n)}
            className={tabButtonClass(wayCount === n)}
          >
            {n}
          </button>
        ))}
        {menuExpanded ? (
          <>
            {[5, 6, 7, 8, 9].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => handleWayCountChange(n)}
                className={tabButtonClass(wayCount === n)}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setNWaySelectCount(prev => wayCount >= 10 ? wayCount : prev);
                handleWayCountChange(isNWayActive ? wayCount : nWaySelectCount);
              }}
              className={tabButtonClass(isNWayActive)}
            >
              10+
            </button>
            <button
              type="button"
              onClick={() => setMenuExpanded(false)}
              className="flex-1 px-3 py-2 rounded-full bg-gray-200 shadow hover:bg-gray-300 transition font-semibold border border-gray-300 dark:bg-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-500"
            >
              ←
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setMenuExpanded(true)}
            className={`flex-1 px-3 py-2 rounded-full shadow transition font-semibold border ${isHigherTabActive
              ? "bg-blue-600 text-white shadow-md border-blue-600"
              : "bg-gray-200 hover:bg-gray-300 border-gray-300 dark:bg-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-500"
              }`}
          >
            ...
          </button>
        )}
      </div>

      {/* Második menüsor (10-20), csak ha 9+ aktív */}
      {isNWayActive && (
        <div className="flex gap-1 p-3 pt-0 mb-2 justify-between max-w-md mx-auto h-auto w-full">
          {Array.from({ length: 11 }, (_, i) => i + 10).map(n => (
            <button
              key={n}
              type="button"
              onClick={() => handleNWaySelectChange(n)}
              className={tabButtonClass(wayCount === n, "px-0 py-1.5 text-xs sm:px-1")}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {/* Kalkulátor */}
      <SureBetCalculatorNWay
        count={wayCount}
        initialParams={initialParams}
        calculatorState={calculatorState}
        setCalculatorState={setCalculatorStateAndStore}
        resetCalculatorState={resetCalculatorState}
      />
    </div>
  );
}
