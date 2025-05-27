import { renderHook } from '@testing-library/react';
import { useSurebet3Way } from '../useSurebet3Way';
import { StakeField3Way } from '@/app/types/surebet';

describe('useSurebet3Way', () => {
  // Test suite for fixedField = 'total'
  describe("when fixedField is 'total'", () => {
    it('should calculate correctly for equal odds', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '3.0',
          odds2: '3.0',
          odds3: '3.0',
          totalStake: '90',
          stake1: 0,
          stake2: 0,
          stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      // Denominator = (3*3 + 3*3 + 3*3) = 9 + 9 + 9 = 27
      // stake1 = (90 * 3*3) / 27 = (90 * 9) / 27 = 810 / 27 = 30
      // stake2 = (90 * 3*3) / 27 = 30
      // stake3 = (90 * 3*3) / 27 = 30
      // profit = 30 * 3.0 - 90 = 90 - 90 = 0
      // profitPercentage = ((3*3*3) / (3*3 + 3*3 + 3*3) - 1) * 100 = (27/27 - 1)*100 = 0
      expect(result.current.stake1).toBe(30);
      expect(result.current.stake2).toBe(30);
      expect(result.current.stake3).toBe(30);
      expect(result.current.totalStake).toBe('90');
      expect(result.current.profit).toBeCloseTo(0);
      expect(result.current.profitPercentage).toBeCloseTo(0);
    });

    it('should calculate correctly for different odds', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '2.0',
          odds2: '3.0',
          odds3: '4.0',
          totalStake: '130', // sum of 60+40+30 to make it a nice surebet
          stake1: 0,
          stake2: 0,
          stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      // numOdds1*numOdds2 = 2*3 = 6
      // numOdds2*numOdds3 = 3*4 = 12
      // numOdds1*numOdds3 = 2*4 = 8
      // Denominator = 6 + 12 + 8 = 26
      // stake1 = (130 * 3*4) / 26 = (130 * 12) / 26 = 1560 / 26 = 60
      // stake2 = (130 * 2*4) / 26 = (130 * 8) / 26 = 1040 / 26 = 40
      // stake3 = (130 * 2*3) / 26 = (130 * 6) / 26 = 780 / 26 = 30
      // totalStakeCheck = 60 + 40 + 30 = 130. Correct.
      // profit = 60 * 2.0 - 130 = 120 - 130 = -10
      // profitPercentage = ((2*3*4) / (2*3 + 3*4 + 2*4) - 1) * 100
      //                = (24 / (6 + 12 + 8) - 1) * 100
      //                = (24 / 26 - 1) * 100 = (0.9230769 - 1) * 100 = -7.6923076
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.totalStake).toBe('130');
      expect(result.current.profit).toBeCloseTo(-10);
      expect(result.current.profitPercentage).toBeCloseTo(-7.69230769);
    });

    it('should handle invalid totalStake', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '3.0',
          odds2: '3.0',
          odds3: '3.0',
          totalStake: 'abc',
          stake1: 0,
          stake2: 0,
          stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBe(0);
      expect(result.current.stake1).toBe(0);
      expect(result.current.stake2).toBe(0);
      expect(result.current.stake3).toBe(0);
    });
  });

  // Test suite for fixedField = 'stake1'
  describe("when fixedField is 'stake1'", () => {
    it('should calculate correctly', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '2.0', // stake1Val = 60
          odds2: '3.0',
          odds3: '4.0',
          totalStake: '0',
          stake1: 60,
          stake2: 0,
          stake3: 0,
          fixedField: 'stake1' as StakeField3Way,
        })
      );
      // numOdds1 = 2, numOdds2 = 3, numOdds3 = 4, stake1Val = 60
      // stake2Calculated = round((60 * 2 * 4) / (3 * 4)) = round((480) / 12) = round(40) = 40
      // stake3Calculated = round((60 * 2 * 3) / (3 * 4)) = round((360) / 12) = round(30) = 30
      // total = 60 + 40 + 30 = 130
      // profit = 60 * 2.0 - 130 = 120 - 130 = -10
      // profitPercentage = ((2*3*4) / (2*3 + 3*4 + 2*4) - 1) * 100 = -7.69230769 (same as above)
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.totalStake).toBe('130');
      expect(result.current.profit).toBeCloseTo(-10);
      expect(result.current.profitPercentage).toBeCloseTo(-7.69230769);
    });
  });

  // Test suite for fixedField = 'stake2'
  describe("when fixedField is 'stake2'", () => {
    it('should calculate correctly', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '2.0',
          odds2: '3.0', // stake2Val = 40
          odds3: '4.0',
          totalStake: '0',
          stake1: 0,
          stake2: 40,
          stake3: 0,
          fixedField: 'stake2' as StakeField3Way,
        })
      );
      // numOdds1 = 2, numOdds2 = 3, numOdds3 = 4, stake2Val = 40
      // stake1Calculated = round((40 * 3 * 4) / (2 * 4)) = round(480 / 8) = round(60) = 60
      // stake3Calculated = round((40 * 2 * 3) / (2 * 4)) = round(240 / 8) = round(30) = 30
      // total = 60 + 40 + 30 = 130
      // profit = 60 * 2.0 - 130 = 120 - 130 = -10
      // profitPercentage = -7.69230769
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.totalStake).toBe('130');
      expect(result.current.profit).toBeCloseTo(-10);
      expect(result.current.profitPercentage).toBeCloseTo(-7.69230769);
    });
  });

  // Test suite for fixedField = 'stake3'
  describe("when fixedField is 'stake3'", () => {
    it('should calculate correctly', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '2.0',
          odds2: '3.0',
          odds3: '4.0', // stake3Val = 30
          totalStake: '0',
          stake1: 0,
          stake2: 0,
          stake3: 30,
          fixedField: 'stake3' as StakeField3Way,
        })
      );
      // numOdds1 = 2, numOdds2 = 3, numOdds3 = 4, stake3Val = 30
      // stake1Calculated = round((30 * 3 * 4) / (2 * 3)) = round(360 / 6) = round(60) = 60
      // stake2Calculated = round((30 * 2 * 4) / (2 * 3)) = round(240 / 6) = round(40) = 40
      // total = 60 + 40 + 30 = 130
      // profit = 60 * 2.0 - 130 = 120 - 130 = -10
      // profitPercentage = -7.69230769
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.totalStake).toBe('130');
      expect(result.current.profit).toBeCloseTo(-10);
      expect(result.current.profitPercentage).toBeCloseTo(-7.69230769);
    });
  });

  // Test suite for invalid or zero odds
  describe('when odds are invalid or zero', () => {
    it('should return zero profit for non-numeric odds1', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: 'abc',
          odds2: '3.0',
          odds3: '3.0',
          totalStake: '90',
          stake1: 0,
          stake2: 0,
          stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBe(0);
    });

    it('should calculate correctly for odds1 being "0" when fixedField is "total"', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '0',
          odds2: '3.0',
          odds3: '4.0',
          totalStake: '70', // e.g. stake2=40, stake3=30
          stake1: 0,
          stake2: 0,
          stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      // numOdds1=0, numOdds2=3, numOdds3=4, totalStake=70
      // Denominator = (0*3 + 3*4 + 0*4) = 0 + 12 + 0 = 12
      // stake1 = round((70 * 3*4) / 12) = round((70*12)/12) = round(70) = 70
      // stake2 = round((70 * 0*4) / 12) = round(0 / 12) = 0
      // stake3 = round((70 * 0*3) / 12) = round(0 / 12) = 0
      // profit = 70 * 0 - 70 = -70
      // profitPercentage = ((0*3*4) / (0*3 + 3*4 + 0*4) - 1) * 100 = (0/12 - 1)*100 = -100
      expect(result.current.stake1).toBe(70);
      expect(result.current.stake2).toBe(0);
      expect(result.current.stake3).toBe(0);
      expect(result.current.totalStake).toBe('70');
      expect(result.current.profit).toBeCloseTo(-70);
      expect(result.current.profitPercentage).toBeCloseTo(-100);
    });

    it('should handle division by zero in profitPercentage if all terms in denominator are zero (e.g. two odds are zero)', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '0',
          odds2: '0',
          odds3: '4.0',
          totalStake: '100',
          stake1: 0,
          stake2: 0,
          stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      // Denominator = (0*0 + 0*4 + 0*4) = 0. This will lead to NaN/Infinity for stakes.
      // The hook calculates profitPercentage first: ((0*0*4) / 0 - 1) * 100 -> (0/0 - 1)*100 -> (NaN - 1)*100 -> NaN
      // Then stakes: stake1 = round((100 * 0*4) / 0) = round(0/0) = NaN
      // Profit = NaN * 0 - 100 = NaN
      // The useEffect will set profit/profitPercentage to 0 if any odd is NaN, but not for this.
      // Let's see how JS handles Math.round(NaN) -> NaN
      // So, result would be stakes: NaN, profit: NaN, profitPercentage: NaN
      // This is an edge case the hook doesn't explicitly handle to reset to 0, but calculations will result in NaNs.
      // Test expectations should be for NaN.
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      // stake3 will also be NaN: round((100 * 0*0) / 0)
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(result.current.totalStake).toBe('100'); // totalStake is passed in
      expect(isNaN(result.current.profit)).toBe(true);
      expect(isNaN(result.current.profitPercentage)).toBe(true);
    });
  });
});
