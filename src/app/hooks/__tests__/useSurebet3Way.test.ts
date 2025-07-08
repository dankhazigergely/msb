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

    it('should handle NaN stake1 input leading to NaN results', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '2.0', // Valid odds
          odds2: '3.0',
          odds3: '4.0',
          totalStake: '0', // Recalculated
          stake1: NaN,   // Invalid stake input
          stake2: 0,     // Recalculated to NaN
          stake3: 0,     // Recalculated to NaN
          fixedField: 'stake1' as StakeField3Way,
        })
      );
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(result.current.totalStake).toBe('NaN');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(result.current.profitPercentage).toBeCloseTo(-7.6923076923076925); // Calculated from valid odds
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
      // Hook formulas:
      // stake1Calculated = Math.round((stake2Val * numOdds2 * numOdds3) / (numOdds1 * numOdds3));
      // stake3Calculated = Math.round((stake2Val * numOdds1 * numOdds2) / (numOdds1 * numOdds3));
      // s1 = round(40 * 3 * 4 / (2*4)) = round(480 / 8) = 60
      // s3 = round(40 * 2 * 3 / (2*4)) = round(240 / 8) = 30
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

    it('should handle NaN stake2 input leading to NaN results', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '2.0',
          odds2: '3.0',
          odds3: '4.0',
          totalStake: '0',
          stake1: 0,    // Recalculated to NaN
          stake2: NaN,  // Invalid stake input
          stake3: 0,    // Recalculated to NaN
          fixedField: 'stake2' as StakeField3Way,
        })
      );
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(result.current.totalStake).toBe('NaN');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(result.current.profitPercentage).toBeCloseTo(-7.6923076923076925);
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
      // Hook formulas:
      // stake1Calculated = Math.round((stake3Val * numOdds2 * numOdds3) / (numOdds1 * numOdds2));
      // stake2Calculated = Math.round((stake3Val * numOdds1 * numOdds3) / (numOdds1 * numOdds2));
      // s1 = round(30 * 3*4 / (2*3)) = round(360 / 6) = 60
      // s2 = round(30 * 2*4 / (2*3)) = round(240 / 6) = 40
      // total = 60 + 40 + 30 = 130
      // profit = 60 * 2.0 - 130 = -10
      // profitPercentage = -7.69230769
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.totalStake).toBe('130');
      expect(result.current.profit).toBeCloseTo(-10);
      expect(result.current.profitPercentage).toBeCloseTo(-7.69230769);
    });

    it('should handle NaN stake3 input leading to NaN results', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '2.0',
          odds2: '3.0',
          odds3: '4.0',
          totalStake: '0',
          stake1: 0,    // Recalculated to NaN
          stake2: 0,    // Recalculated to NaN
          stake3: NaN,  // Invalid stake input
          fixedField: 'stake3' as StakeField3Way,
        })
      );
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(result.current.totalStake).toBe('NaN');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(result.current.profitPercentage).toBeCloseTo(-7.6923076923076925);
    });
  });

  // Test suite for invalid or zero odds
  describe('when odds are invalid or zero', () => {
    it('should return zero profit/pp for non-numeric odds1 and initial stakes', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: 'abc',
          odds2: '3.0',
          odds3: '3.0',
          totalStake: '90',
          stake1: 0, stake2: 0, stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      // if isNaN(numOdds1), only profit and profitPercentage are reset. Stakes remain initial.
      expect(result.current.stake1).toBe(0);
      expect(result.current.stake2).toBe(0);
      expect(result.current.stake3).toBe(0);
      expect(result.current.totalStake).toBe("0"); // Initial totalStake
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBe(0);
    });

    it('should calculate correctly for odds1 being "0" when fixedField is "total"', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '0',   // n1=0
          odds2: '3.0', // n2=3
          odds3: '4.0', // n3=4
          totalStake: '70', // TS=70
          stake1: 0, stake2: 0, stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      // Denom = (0*3 + 3*4 + 0*4) = 12
      // s1 = round(70 * 3*4 / 12) = round(70 * 12 / 12) = 70
      // s2 = round(70 * 0*4 / 12) = 0
      // s3 = round(70 * 0*3 / 12) = 0
      // profit = 70 * 0 - 70 = -70
      // PP = ((0*3*4)/12 - 1)*100 = -100
      expect(result.current.stake1).toBe(70);
      expect(result.current.stake2).toBe(0);
      expect(result.current.stake3).toBe(0);
      expect(result.current.totalStake).toBe('70');
      expect(result.current.profit).toBeCloseTo(-70);
      expect(result.current.profitPercentage).toBeCloseTo(-100);
    });

    it('should result in NaNs when denominator is zero (e.g. two odds are zero)', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '0', // n1=0
          odds2: '0', // n2=0
          odds3: '4.0', // n3=4
          totalStake: '100', // TS=100
          stake1: 0, stake2: 0, stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      // Denom = (0*0 + 0*4 + 0*4) = 0
      // s1 = round(100 * 0*4 / 0) = NaN
      // s2 = round(100 * 0*4 / 0) = NaN
      // s3 = round(100 * 0*0 / 0) = NaN
      // totalStake = "100" (from input numTotalStake.toFixed(0))
      // profit = NaN * 0 - 100 = NaN
      // PP = ((0*0*4)/0 - 1)*100 = NaN
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(result.current.totalStake).toBe('100'); // This is numTotalStake.toFixed(0)
      expect(isNaN(result.current.profit)).toBe(true);
      expect(isNaN(result.current.profitPercentage)).toBe(true);
    });

    it('should calculate with negative odds1', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '-3.0', // n1=-3
          odds2: '3.0',  // n2=3
          odds3: '3.0',  // n3=3
          totalStake: '90', // TS=90
          stake1: 0, stake2: 0, stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      // Denom = (-3*3 + 3*3 + -3*3) = -9 + 9 - 9 = -9
      // s1 = round(90 * 3*3 / -9) = round(810 / -9) = -90
      // s2 = round(90 * -3*3 / -9) = round(-810 / -9) = 90
      // s3 = round(90 * -3*3 / -9) = 90
      // profit = -90 * (-3) - 90 = 270 - 90 = 180
      // PP = ((-3*3*3)/-9 - 1)*100 = (-27/-9 -1)*100 = (3-1)*100 = 200
      expect(result.current.stake1).toBe(-90);
      expect(result.current.stake2).toBe(90);
      expect(result.current.stake3).toBe(90);
      expect(result.current.totalStake).toBe('90');
      expect(result.current.profit).toBeCloseTo(180);
      expect(result.current.profitPercentage).toBeCloseTo(200);
    });

    it('should result in NaNs when odds2 and odds3 are "0" (fixedField total, denom 0)', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '2.5', // n1=2.5
          odds2: '0',   // n2=0
          odds3: '0',   // n3=0
          totalStake: '100', // TS=100
          stake1: 0, stake2: 0, stake3: 0,
          fixedField: 'total' as StakeField3Way,
        })
      );
      // Denom = (2.5*0 + 0*0 + 2.5*0) = 0
      // s1 = round(100 * 0*0 / 0) = NaN
      // s2 = round(100 * 2.5*0 / 0) = NaN
      // s3 = round(100 * 2.5*0 / 0) = NaN
      // totalStake will be '100' (from input)
      // profit = NaN * 2.5 - 100 = NaN
      // PP = ((2.5*0*0)/0 - 1)*100 = NaN
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(result.current.totalStake).toBe('100');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(isNaN(result.current.profitPercentage)).toBe(true);
    });

    it('should handle fixed stake1 being "0"', () => {
      const { result } = renderHook(() =>
        useSurebet3Way({
          odds1: '2.0', // n1=2
          odds2: '3.0', // n2=3
          odds3: '4.0', // n3=4
          totalStake: '0', // Recalculated
          stake1: 0, // Fixed at 0 (stake1Val = 0)
          stake2: 0, // Recalculated
          stake3: 0, // Recalculated
          fixedField: 'stake1' as StakeField3Way,
        })
      );
      // stake2Calculated = round((0 * 2 * 4) / (3 * 4)) = 0 (using corrected formula logic: stake1Val * n1 / n2)
      // stake3Calculated = round((0 * 2 * 3) / (3 * 4)) = 0 (using corrected formula logic: stake1Val * n1 / n3)
      // Actually using hook's formula:
      // s2 = round(0 * 2*4 / (3*4)) = 0
      // s3 = round(0 * 2*3 / (3*4)) = 0. No, hook formula for s3 when stake1 fixed: round((stake1Val * numOdds1 * numOdds2) / (numOdds2 * numOdds3)) = round(0 * 2*3 / (3*4)) = 0
      // total = 0 + 0 + 0 = 0
      // profit = 0 * 2.0 - 0 = 0
      // profitPercentage = ((2*3*4)/(2*3 + 3*4 + 2*4) - 1)*100 = -7.69230769...
      expect(result.current.stake1).toBe(0);
      expect(result.current.stake2).toBe(0);
      expect(result.current.stake3).toBe(0);
      expect(result.current.totalStake).toBe('0');
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBeCloseTo(-7.6923076923076925);
    });
  });
});
