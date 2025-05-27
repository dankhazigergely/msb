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
      expect(result.current.profit).toBeCloseTo(-2.8);
      expect(result.current.profitPercentage).toBeCloseTo(-1);
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
      expect(result.current.profit).toBe(0);
      expect(result.current.profitPercentage).toBe(0);
    });

    it('should calculate correctly for odds1 being "0"', () => {
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
  });
});
