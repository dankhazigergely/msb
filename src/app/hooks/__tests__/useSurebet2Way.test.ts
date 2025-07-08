import { renderHook } from '@testing-library/react';
import { useSurebet2Way } from '../useSurebet2Way';
import { StakeField2Way } from '@/app/types/surebet';

describe('useSurebet2Way', () => {
  // Test suite for fixedField = 'total'
  describe("when fixedField is 'total'", () => {
    it('should calculate correctly for equal odds', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '2.0',
          odds2: '2.0',
          totalStake: '100',
          stake1: 0, // Initial value, should be recalculated
          stake2: 0, // Initial value, should be recalculated
          fixedField: 'total' as StakeField2Way,
        })
      );
      expect(result.current.stake1).toBe(50);
      expect(result.current.stake2).toBe(50);
      expect(result.current.totalStake).toBe('100');
      expect(result.current.profit).toBeCloseTo(0);
      expect(result.current.profitPercentage).toBeCloseTo(0);
    });

    it('should calculate correctly for different odds leading to profit', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '1.5',
          odds2: '3.5',
          totalStake: '100',
          stake1: 0,
          stake2: 0,
          fixedField: 'total' as StakeField2Way,
        })
      );
      expect(result.current.stake1).toBe(70);
      expect(result.current.stake2).toBe(30);
      expect(result.current.totalStake).toBe('100');
      expect(result.current.profit).toBeCloseTo(5);
      expect(result.current.profitPercentage).toBeCloseTo(5);
    });

    it('should handle invalid totalStake', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '2.0',
          odds2: '2.0',
          totalStake: 'abc',
          stake1: 0,
          stake2: 0,
          fixedField: 'total' as StakeField2Way,
        })
      );
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBe(0);
      expect(result.current.stake1).toBe(0);
      expect(result.current.stake2).toBe(0);
    });
  });

  // Test suite for fixedField = 'stake1'
  describe("when fixedField is 'stake1'", () => {
    it('should calculate correctly', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '1.5',
          odds2: '3.0',
          totalStake: '0', // Initial, should be recalculated
          stake1: 60,
          stake2: 0, // Initial, should be recalculated
          fixedField: 'stake1' as StakeField2Way,
        })
      );
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(30);
      expect(result.current.totalStake).toBe('90');
      expect(result.current.profit).toBeCloseTo(0);
      expect(result.current.profitPercentage).toBeCloseTo(0);
    });

    it('should handle NaN stake1 input leading to NaN results', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '1.5', // Valid odds to ensure calculation block is hit
          odds2: '3.0',
          totalStake: '0', // Will be recalculated
          stake1: NaN, // Invalid stake input
          stake2: 0,   // Initial, should become NaN
          fixedField: 'stake1' as StakeField2Way,
        })
      );
      expect(isNaN(result.current.stake1)).toBe(true); // stake1Val will be NaN
      expect(isNaN(result.current.stake2)).toBe(true); // stake2Calculated will be NaN
      expect(result.current.totalStake).toBe('NaN');    // total.toFixed(0) where total is NaN
      expect(isNaN(result.current.profit)).toBe(true);
      // profitPercentage depends only on odds, so it might be valid if odds are valid
      expect(result.current.profitPercentage).toBeCloseTo(0); // ((1.5 * 3.0) / (1.5 + 3.0) - 1) * 100 = 0
                                                                // For 1.5 and 3.0: ((1.5*3.0)/(1.5+3.0) - 1)*100 = (4.5/4.5 - 1)*100 = (1-1)*100 = 0.
                                                                // Let's recheck this formula. It seems to be for ARB percentage.
                                                                // (odds1: '1.5', odds2: '3.0') -> profitPercentage = ((1.5*3.0)/(1.5+3.0)-1)*100 = 0.
                                                                // This is correct for these odds as 1/1.5 + 1/3.0 = 0.666 + 0.333 = 1. No arb.
                                                                // Let's use odds where there is an arb for clarity on profitPercentage calculation with NaN stakes.
                                                                // Example: odds1: 2.5, odds2: 2.5. PP = ((2.5*2.5)/(2.5+2.5)-1)*100 = (6.25/5 - 1)*100 = (1.25-1)*100 = 25
                                                                // Using odds 1.5, 3.0 -> PP is indeed 0.
                                                                // The hook calculates profitPercentage using only odds. So if odds are valid, PP is valid.
    });
  });

  // Test suite for fixedField = 'stake2'
  describe("when fixedField is 'stake2'", () => {
    it('should calculate correctly with rounding', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '1.8',
          odds2: '2.2',
          totalStake: '0', // Initial, should be recalculated
          stake1: 0, // Initial, should be recalculated
          stake2: 110,
          fixedField: 'stake2' as StakeField2Way,
        })
      );
      expect(result.current.stake1).toBe(134);
      expect(result.current.stake2).toBe(110);
      expect(result.current.totalStake).toBe('244');
      expect(result.current.profit).toBeCloseTo(-2.8); // 134 * 1.8 - 244 = 241.2 - 244 = -2.8
      expect(result.current.profitPercentage).toBeCloseTo(-1); // ((1.8 * 2.2) / (1.8 + 2.2) - 1) * 100 = (3.96 / 4 - 1)*100 = (0.99-1)*100 = -1
    });

    it('should handle NaN stake2 input leading to NaN results', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '1.8', // Valid odds
          odds2: '2.2',
          totalStake: '0',
          stake1: 0,    // Initial, should become NaN
          stake2: NaN,  // Invalid stake input
          fixedField: 'stake2' as StakeField2Way,
        })
      );
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(result.current.totalStake).toBe('NaN');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(result.current.profitPercentage).toBeCloseTo(-1); // ((1.8 * 2.2) / (1.8 + 2.2) - 1) * 100 = -1
    });
  });

  // Test suite for invalid odds
  describe('when odds are invalid or zero', () => {
    it('should return zero profit for non-numeric odds1', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: 'abc',
          odds2: '2.0',
          totalStake: '100',
          stake1: 0,
          stake2: 0,
          fixedField: 'total' as StakeField2Way,
        })
      );
      // Hook logic: if isNaN(numOdds1), sets profit/profitPercentage to 0 and returns.
      // Stakes and totalStake remain initial (0, 0, "0") because setResult isn't called with new values.
      expect(result.current.stake1).toBe(0);
      expect(result.current.stake2).toBe(0);
      expect(result.current.totalStake).toBe("0");
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBe(0);
    });

    it('should return zero profit for non-numeric odds2', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '2.0',
          odds2: 'xyz',
          totalStake: '100',
          stake1: 0,
          stake2: 0,
          fixedField: 'total' as StakeField2Way,
        })
      );
      expect(result.current.stake1).toBe(0);
      expect(result.current.stake2).toBe(0);
      expect(result.current.totalStake).toBe("0");
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBe(0);
    });

    it('should calculate correctly for odds1 being "0"', () => {
      // If numOdds1 = 0, numOdds2 = 2.5, totalStake = 100
      // stake1Calc = round(100 * 2.5 / (0 + 2.5)) = round(250 / 2.5) = 100
      // stake2Calc = round(100 * 0 / (0 + 2.5)) = round(0 / 2.5) = 0
      // profit = 100 * 0 - 100 = -100
      // profitPercentage = ((0 * 2.5) / (0 + 2.5) - 1) * 100 = (0 - 1) * 100 = -100
        const { result } = renderHook(() =>
          useSurebet2Way({
            odds1: '0',
            odds2: '2.5',
            totalStake: '100',
            stake1: 0,
            stake2: 0,
            fixedField: 'total' as StakeField2Way,
          })
        );
        expect(result.current.stake1).toBe(100);
        expect(result.current.stake2).toBe(0);
        expect(result.current.totalStake).toBe("100");
        expect(result.current.profit).toBeCloseTo(-100);
        expect(result.current.profitPercentage).toBeCloseTo(-100);
    });

    it('should calculate correctly for odds2 being "0"', () => {
      // If numOdds1 = 2.5, numOdds2 = 0, totalStake = 100
      // stake1Calc = round(100 * 0 / (2.5 + 0)) = 0
      // stake2Calc = round(100 * 2.5 / (2.5 + 0)) = 100
      // profit = 0 * 2.5 - 100 = -100
      // profitPercentage = ((2.5 * 0) / (2.5 + 0) - 1) * 100 = -100
        const { result } = renderHook(() =>
          useSurebet2Way({
            odds1: '2.5',
            odds2: '0',
            totalStake: '100',
            stake1: 0,
            stake2: 0,
            fixedField: 'total' as StakeField2Way,
          })
        );
        expect(result.current.stake1).toBe(0);
        expect(result.current.stake2).toBe(100);
        expect(result.current.totalStake).toBe("100");
        expect(result.current.profit).toBeCloseTo(-100);
        expect(result.current.profitPercentage).toBeCloseTo(-100);
    });

    it('should calculate with negative odds1', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '-2.0', // numOdds1 = -2
          odds2: '2.5',  // numOdds2 = 2.5
          totalStake: '100', // numTotalStake = 100
          stake1: 0, stake2: 0,
          fixedField: 'total' as StakeField2Way,
        })
      );
      // stake1 = round(100 * 2.5 / (-2 + 2.5)) = round(250 / 0.5) = 500
      // stake2 = round(100 * -2 / (-2 + 2.5)) = round(-200 / 0.5) = -400
      // totalStake = "100" (passed as string, used as numTotalStake for calc)
      // profit = 500 * (-2) - 100 = -1000 - 100 = -1100
      // profitPercentage = ((-2 * 2.5) / (-2 + 2.5) - 1) * 100 = (-5 / 0.5 - 1) * 100 = (-10 - 1) * 100 = -1100
      expect(result.current.stake1).toBe(500);
      expect(result.current.stake2).toBe(-400);
      expect(result.current.totalStake).toBe('100'); // Uses numTotalStake.toFixed(0)
      expect(result.current.profit).toBeCloseTo(-1100);
      expect(result.current.profitPercentage).toBeCloseTo(-1100);
    });

    it('should calculate with negative odds2', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '2.5',  // numOdds1 = 2.5
          odds2: '-2.0', // numOdds2 = -2
          totalStake: '100', // numTotalStake = 100
          stake1: 0, stake2: 0,
          fixedField: 'total' as StakeField2Way,
        })
      );
      // stake1 = round(100 * -2 / (2.5 + -2)) = round(-200 / 0.5) = -400
      // stake2 = round(100 * 2.5 / (2.5 + -2)) = round(250 / 0.5) = 500
      // profit = -400 * 2.5 - 100 = -1000 - 100 = -1100
      // profitPercentage = ((2.5 * -2) / (2.5 + -2) - 1) * 100 = (-5 / 0.5 - 1) * 100 = (-10 - 1) * 100 = -1100
      expect(result.current.stake1).toBe(-400);
      expect(result.current.stake2).toBe(500);
      expect(result.current.totalStake).toBe('100');
      expect(result.current.profit).toBeCloseTo(-1100);
      expect(result.current.profitPercentage).toBeCloseTo(-1100);
    });

    it('should calculate with fixed stake1 and negative odds2', () => {
      const { result } = renderHook(() =>
        useSurebet2Way({
          odds1: '2.0',   // numOdds1 = 2
          odds2: '-3.0',  // numOdds2 = -3
          totalStake: '0', // Not used directly for calculation here
          stake1: 50,     // stake1Val = 50
          stake2: 0,
          fixedField: 'stake1' as StakeField2Way,
        })
      );
      // stake2Calculated = round(50 * 2 / -3) = round(-100/3) = -33
      // total = 50 + (-33) = 17
      // profit = 50 * 2 - 17 = 100 - 17 = 83
      // profitPercentage = ((2 * -3) / (2 + -3) - 1) * 100 = (-6 / -1 - 1) * 100 = (6 - 1) * 100 = 500
      expect(result.current.stake1).toBe(50);
      expect(result.current.stake2).toBe(-33);
      expect(result.current.totalStake).toBe('17');
      expect(result.current.profit).toBeCloseTo(83);
      expect(result.current.profitPercentage).toBeCloseTo(500);
    });
  });
});
