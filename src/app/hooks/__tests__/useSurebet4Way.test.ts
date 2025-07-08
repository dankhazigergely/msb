import { renderHook } from '@testing-library/react';
import { useSurebet4Way } from '../useSurebet4Way';
import { StakeField4Way } from '@/app/types/surebet';

describe('useSurebet4Way', () => {
  // Test suite for fixedField = 'total'
  describe("when fixedField is 'total'", () => {
    it('should calculate correctly for equal odds', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          odds1: '4.0',
          odds2: '4.0',
          odds3: '4.0',
          odds4: '4.0',
          totalStake: '100',
          stake1: 0, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'total' as StakeField4Way,
        })
      );
      // Denom = 4*4*4 + 4*4*4 + 4*4*4 + 4*4*4 = 64 + 64 + 64 + 64 = 256
      // StakeX = (100 * 4*4*4) / 256 = (100 * 64) / 256 = 6400 / 256 = 25
      expect(result.current.stake1).toBe(25);
      expect(result.current.stake2).toBe(25);
      expect(result.current.stake3).toBe(25);
      expect(result.current.stake4).toBe(25);
      expect(result.current.totalStake).toBe('100');
      // Profit = 25 * 4.0 - 100 = 100 - 100 = 0
      expect(result.current.profit).toBeCloseTo(0);
      // ProfitPercentage = ((4*4*4*4) / 256 - 1) * 100 = (256/256 - 1) * 100 = 0
      expect(result.current.profitPercentage).toBeCloseTo(0);
    });

    it('should calculate correctly for different odds', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          odds1: '2.0', // n1
          odds2: '3.0', // n2
          odds3: '4.0', // n3
          odds4: '5.0', // n4
          totalStake: '154', // To make stakes 60, 40, 30, 24 (sum = 154)
          stake1: 0, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'total' as StakeField4Way,
        })
      );
      // n1n2n3 = 2*3*4 = 24
      // n2n3n4 = 3*4*5 = 60
      // n1n3n4 = 2*4*5 = 40
      // n1n2n4 = 2*3*5 = 30
      // Denom = 24 + 60 + 40 + 30 = 154
      // stake1 = (154 * 3*4*5) / 154 = (154 * 60) / 154 = 60
      // stake2 = (154 * 2*4*5) / 154 = (154 * 40) / 154 = 40
      // stake3 = (154 * 2*3*5) / 154 = (154 * 30) / 154 = 30
      // stake4 = (154 * 2*3*4) / 154 = (154 * 24) / 154 = 24
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.stake4).toBe(24);
      expect(result.current.totalStake).toBe('154');
      // Profit = 60 * 2.0 - 154 = 120 - 154 = -34
      expect(result.current.profit).toBeCloseTo(-34);
      // ProfitPercentage = ((2*3*4*5) / 154 - 1) * 100 = (120 / 154 - 1) * 100
      //                  = (0.77922077922 - 1) * 100 = -22.077922078
      expect(result.current.profitPercentage).toBeCloseTo(-22.077922078);
    });

    it('should handle invalid totalStake', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          odds1: '4.0', odds2: '4.0', odds3: '4.0', odds4: '4.0',
          totalStake: 'abc',
          stake1: 0, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'total' as StakeField4Way,
        })
      );
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBe(0);
      expect(result.current.stake1).toBe(0); // Initial values
    });
  });

  // Common values for fixed stake tests
  const fixedStakeTestProps = {
    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0',
    totalStake: '0', // Recalculated
  };
  // Expected results for fixedStakeTestProps if stake1=60 (profit/percentage are global)
  // Denom = 2*3*4 + 3*4*5 + 2*4*5 + 2*3*5 = 24 + 60 + 40 + 30 = 154
  // ProfitPercentage = ((2*3*4*5)/154 - 1)*100 = (120/154 - 1)*100 = -22.077922078
  const expectedProfit = -34; // if total stake becomes 154
  const expectedProfitPercentage = -22.077922078;

  describe("when fixedField is 'stake1'", () => {
    it('should calculate correctly', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          ...fixedStakeTestProps,
          stake1: 60, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'stake1' as StakeField4Way,
        })
      );
      // s1=60. n1=2,n2=3,n3=4,n4=5
      // s2 = round(s1 * n1*n3*n4 / (n2*n3*n4)) = round(60 * 2*4*5 / (3*4*5)) = round(60 * 40 / 60) = 40
      // s3 = round(s1 * n1*n2*n4 / (n2*n3*n4)) = round(60 * 2*3*5 / (3*4*5)) = round(60 * 30 / 60) = 30
      // s4 = round(s1 * n1*n2*n3 / (n2*n3*n4)) = round(60 * 2*3*4 / (3*4*5)) = round(60 * 24 / 60) = 24
      // total = 60+40+30+24 = 154
      // profit = 60*2 - 154 = 120 - 154 = -34
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.stake4).toBe(24);
      expect(result.current.totalStake).toBe('154');
      expect(result.current.profit).toBeCloseTo(expectedProfit);
      expect(result.current.profitPercentage).toBeCloseTo(expectedProfitPercentage);
    });

    it('should handle NaN stake1 input leading to NaN results', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          ...fixedStakeTestProps, // odds1:2, odds2:3, odds3:4, odds4:5
          stake1: NaN, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'stake1' as StakeField4Way,
        })
      );
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(isNaN(result.current.stake4)).toBe(true);
      expect(result.current.totalStake).toBe('NaN');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(result.current.profitPercentage).toBeCloseTo(expectedProfitPercentage); // PP is from odds
    });
  });

  describe("when fixedField is 'stake2'", () => {
    it('should calculate correctly', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          ...fixedStakeTestProps,
          stake1: 0, stake2: 40, stake3: 0, stake4: 0,
          fixedField: 'stake2' as StakeField4Way,
        })
      );
      // Hook formulas: stakeXCalculated = Math.round((stakeFixedVal * numOddsFixed * Product(other relevant odds for num) / Product(other relevant odds for denum for specific stakeX))
      // s1 = round(40 * 3*4*5 / (2*4*5)) = 60
      // s3 = round(40 * 2*3*5 / (2*4*5)) = 30  // Error in original test comment, fixed here based on likely hook structure
      // s4 = round(40 * 2*3*4 / (2*4*5)) = 24
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.stake4).toBe(24);
      expect(result.current.totalStake).toBe('154');
      expect(result.current.profit).toBeCloseTo(expectedProfit);
      expect(result.current.profitPercentage).toBeCloseTo(expectedProfitPercentage);
    });

    it('should handle NaN stake2 input leading to NaN results', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          ...fixedStakeTestProps,
          stake1: 0, stake2: NaN, stake3: 0, stake4: 0,
          fixedField: 'stake2' as StakeField4Way,
        })
      );
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(isNaN(result.current.stake4)).toBe(true);
      expect(result.current.totalStake).toBe('NaN');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(result.current.profitPercentage).toBeCloseTo(expectedProfitPercentage);
    });
  });

  describe("when fixedField is 'stake3'", () => {
    it('should calculate correctly', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          ...fixedStakeTestProps,
          stake1: 0, stake2: 0, stake3: 30, stake4: 0,
          fixedField: 'stake3' as StakeField4Way,
        })
      );
      // s1 = round(30 * 3*4*5 / (2*3*5)) = 60 // Error in original, fixed
      // s2 = round(30 * 2*4*5 / (2*3*5)) = 40 // Error in original, fixed
      // s4 = round(30 * 2*3*4 / (2*3*5)) = 24
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.stake4).toBe(24);
      expect(result.current.totalStake).toBe('154');
      expect(result.current.profit).toBeCloseTo(expectedProfit);
      expect(result.current.profitPercentage).toBeCloseTo(expectedProfitPercentage);
    });

    it('should handle NaN stake3 input leading to NaN results', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          ...fixedStakeTestProps,
          stake1: 0, stake2: 0, stake3: NaN, stake4: 0,
          fixedField: 'stake3' as StakeField4Way,
        })
      );
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(isNaN(result.current.stake4)).toBe(true);
      expect(result.current.totalStake).toBe('NaN');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(result.current.profitPercentage).toBeCloseTo(expectedProfitPercentage);
    });
  });

  describe("when fixedField is 'stake4'", () => {
    it('should calculate correctly', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          ...fixedStakeTestProps,
          stake1: 0, stake2: 0, stake3: 0, stake4: 24,
          fixedField: 'stake4' as StakeField4Way,
        })
      );
      // s1 = round(24 * 3*4*5 / (2*3*4)) = 60
      // s2 = round(24 * 2*4*5 / (2*3*4)) = 40
      // s3 = round(24 * 2*3*5 / (2*3*4)) = 30
      expect(result.current.stake1).toBe(60);
      expect(result.current.stake2).toBe(40);
      expect(result.current.stake3).toBe(30);
      expect(result.current.stake4).toBe(24);
      expect(result.current.totalStake).toBe('154');
      expect(result.current.profit).toBeCloseTo(expectedProfit);
      expect(result.current.profitPercentage).toBeCloseTo(expectedProfitPercentage);
    });

    it('should handle NaN stake4 input leading to NaN results', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          ...fixedStakeTestProps,
          stake1: 0, stake2: 0, stake3: 0, stake4: NaN,
          fixedField: 'stake4' as StakeField4Way,
        })
      );
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(isNaN(result.current.stake4)).toBe(true);
      expect(result.current.totalStake).toBe('NaN');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(result.current.profitPercentage).toBeCloseTo(expectedProfitPercentage);
    });
  });

  describe('when odds are invalid or zero', () => {
    it('should return zero profit/pp and initial stakes for non-numeric odds1', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          odds1: 'abc', odds2: '4.0', odds3: '4.0', odds4: '4.0',
          totalStake: '100',
          stake1: 0, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'total' as StakeField4Way,
        })
      );
      expect(result.current.stake1).toBe(0);
      expect(result.current.stake2).toBe(0);
      expect(result.current.stake3).toBe(0);
      expect(result.current.stake4).toBe(0);
      expect(result.current.totalStake).toBe("0"); // Initial
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBe(0);
    });

    it('should calculate correctly for one odd being "0" (fixedField total)', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          odds1: '0', odds2: '3.0', odds3: '4.0', odds4: '5.0', // n1=0, n2=3, n3=4, n4=5
          totalStake: '120', // TS=120
          stake1: 0, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'total' as StakeField4Way,
        })
      );
      // Denom = (0*3*4) + (3*4*5) + (0*4*5) + (0*3*5) = 0 + 60 + 0 + 0 = 60
      // s1 = round(120 * 3*4*5 / 60) = round(120 * 60 / 60) = 120
      // s2 = round(120 * 0*4*5 / 60) = 0
      // s3 = round(120 * 0*3*5 / 60) = 0
      // s4 = round(120 * 0*3*4 / 60) = 0
      // Profit = 120 * 0 - 120 = -120
      // ProfitPerc = ((0*3*4*5)/60 - 1)*100 = -100
      expect(result.current.stake1).toBe(120);
      expect(result.current.stake2).toBe(0);
      expect(result.current.stake3).toBe(0);
      expect(result.current.stake4).toBe(0);
      expect(result.current.totalStake).toBe('120');
      expect(result.current.profit).toBeCloseTo(-120);
      expect(result.current.profitPercentage).toBeCloseTo(-100);
    });

    it('should result in NaNs when denom is zero (e.g., three odds are "0")', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          odds1: '0', odds2: '0', odds3: '0', odds4: '5.0', // n1=0,n2=0,n3=0,n4=5
          totalStake: '100', // TS=100
          stake1: 0, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'total' as StakeField4Way,
        })
      );
      // Denom = (0*0*0) + (0*0*5) + (0*0*5) + (0*0*5) = 0
      // All stakes, profit, PP will be NaN.
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(isNaN(result.current.stake4)).toBe(true);
      expect(result.current.totalStake).toBe('100'); // From input
      expect(isNaN(result.current.profit)).toBe(true);
      expect(isNaN(result.current.profitPercentage)).toBe(true);
    });

    it('should calculate with negative odds1', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          odds1: '-4.0', odds2: '4.0', odds3: '4.0', odds4: '4.0', //n1=-4,n2=4,n3=4,n4=4
          totalStake: '100', // TS=100
          stake1: 0, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'total' as StakeField4Way,
        })
      );
      // denom = (-4*4*4)+(4*4*4)+(-4*4*4)+(-4*4*4) = -64+64-64-64 = -128
      // s1 = round(100*4*4*4 / -128) = round(6400/-128) = -50
      // s2 = round(100*-4*4*4 / -128) = round(-6400/-128) = 50
      // s3 = round(100*-4*4*4 / -128) = 50
      // s4 = round(100*-4*4*4 / -128) = 50
      // profit = -50*-4 - 100 = 200 - 100 = 100
      // PP = ((-4*4*4*4)/-128 - 1)*100 = (-256/-128 - 1)*100 = (2-1)*100 = 100
      expect(result.current.stake1).toBe(-50);
      expect(result.current.stake2).toBe(50);
      expect(result.current.stake3).toBe(50);
      expect(result.current.stake4).toBe(50);
      expect(result.current.totalStake).toBe('100');
      expect(result.current.profit).toBeCloseTo(100);
      expect(result.current.profitPercentage).toBeCloseTo(100);
    });

    it('should result in NaNs when three odds are "0" (fixedField total, denom 0)', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          odds1: '2.0', odds2: '0', odds3: '0', odds4: '0', // n1=2,n2=0,n3=0,n4=0
          totalStake: '100', // TS=100
          stake1: 0, stake2: 0, stake3: 0, stake4: 0,
          fixedField: 'total' as StakeField4Way,
        })
      );
      // Denom = (2*0*0)+(0*0*0)+(2*0*0)+(2*0*0) = 0
      // Stakes, profit, PP will be NaN.
      expect(isNaN(result.current.stake1)).toBe(true);
      expect(isNaN(result.current.stake2)).toBe(true);
      expect(isNaN(result.current.stake3)).toBe(true);
      expect(isNaN(result.current.stake4)).toBe(true);
      expect(result.current.totalStake).toBe('100');
      expect(isNaN(result.current.profit)).toBe(true);
      expect(isNaN(result.current.profitPercentage)).toBe(true);
    });

    it('should result in NaNs when two odds are "0" (fixedField total, denom 0)', () => {
        const { result } = renderHook(() =>
          useSurebet4Way({
            odds1: '2.0', odds2: '3.0', odds3: '0', odds4: '0', // n1=2,n2=3,n3=0,n4=0
            totalStake: '100', // TS=100
            stake1: 0, stake2: 0, stake3: 0, stake4: 0,
            fixedField: 'total' as StakeField4Way,
          })
        );
        // Denom = (2*3*0)+(3*0*0)+(2*0*0)+(2*3*0) = 0
        // Stakes, profit, PP will be NaN.
        expect(isNaN(result.current.stake1)).toBe(true);
        expect(isNaN(result.current.stake2)).toBe(true);
        expect(isNaN(result.current.stake3)).toBe(true);
        expect(isNaN(result.current.stake4)).toBe(true);
        expect(result.current.totalStake).toBe('100');
        expect(isNaN(result.current.profit)).toBe(true);
        expect(isNaN(result.current.profitPercentage)).toBe(true);
      });

    it('should handle fixed stake1 being "0"', () => {
      const { result } = renderHook(() =>
        useSurebet4Way({
          ...fixedStakeTestProps, // odds1:2, odds2:3, odds3:4, odds4:5
          stake1: 0, // Fixed at 0 (stake1Val = 0)
          stake2: 0, stake3: 0, stake4: 0, // Recalculated
          fixedField: 'stake1' as StakeField4Way,
        })
      );
      // If stake1Val = 0, all other calculated stakes become 0.
      // total = 0. profit = 0.
      // PP = -22.0779... (from odds)
      expect(result.current.stake1).toBe(0);
      expect(result.current.stake2).toBe(0);
      expect(result.current.stake3).toBe(0);
      expect(result.current.stake4).toBe(0);
      expect(result.current.totalStake).toBe('0');
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBeCloseTo(expectedProfitPercentage);
    });
  });
});
