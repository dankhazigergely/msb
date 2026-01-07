import { renderHook } from '@testing-library/react';
import { useSurebet6Way } from '../useSurebet6Way';
import { StakeField6Way } from '@/app/types/surebet';

describe('useSurebet6Way', () => {
    // Test suite for fixedField = 'total'
    describe("when fixedField is 'total'", () => {
        it('should calculate correctly for equal odds', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '6.0',
                    odds2: '6.0',
                    odds3: '6.0',
                    odds4: '6.0',
                    odds5: '6.0',
                    odds6: '6.0',
                    totalStake: '120',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0,
                    fixedField: 'total' as StakeField6Way,
                })
            );
            // Minden odds egyenlő, minden stake 20 lesz (120/6)
            expect(result.current.stake1).toBe(20);
            expect(result.current.stake2).toBe(20);
            expect(result.current.stake3).toBe(20);
            expect(result.current.stake4).toBe(20);
            expect(result.current.stake5).toBe(20);
            expect(result.current.stake6).toBe(20);
            expect(result.current.totalStake).toBe('120');
            // Profit = 20 * 6.0 - 120 = 120 - 120 = 0
            expect(result.current.profit).toBeCloseTo(0);
            // ProfitPercentage = 0 (fair odds)
            expect(result.current.profitPercentage).toBeCloseTo(0);
        });

        it('should calculate correctly for different odds', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '2.0',
                    odds2: '3.0',
                    odds3: '4.0',
                    odds4: '5.0',
                    odds5: '6.0',
                    odds6: '7.0',
                    totalStake: '490',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0,
                    fixedField: 'total' as StakeField6Way,
                })
            );
            // A stake-ek számításra kerülnek
            expect(typeof result.current.stake1).toBe('number');
            expect(typeof result.current.stake2).toBe('number');
            expect(typeof result.current.stake3).toBe('number');
            expect(typeof result.current.stake4).toBe('number');
            expect(typeof result.current.stake5).toBe('number');
            expect(typeof result.current.stake6).toBe('number');
            expect(result.current.totalStake).toBe('490');
        });

        it('should handle invalid totalStake', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '6.0', odds2: '6.0', odds3: '6.0', odds4: '6.0', odds5: '6.0', odds6: '6.0',
                    totalStake: 'abc',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0,
                    fixedField: 'total' as StakeField6Way,
                })
            );
            expect(result.current.profit).toBe(0);
            expect(result.current.profitPercentage).toBe(0);
            expect(result.current.stake1).toBe(0);
        });
    });

    describe("when fixedField is 'stake1'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0', odds6: '7.0',
                    totalStake: '0',
                    stake1: 105, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0,
                    fixedField: 'stake1' as StakeField6Way,
                })
            );
            expect(result.current.stake1).toBe(105);
            expect(typeof result.current.stake2).toBe('number');
            expect(typeof result.current.stake3).toBe('number');
            expect(typeof result.current.stake4).toBe('number');
            expect(typeof result.current.stake5).toBe('number');
            expect(typeof result.current.stake6).toBe('number');
        });

        it('should handle NaN stake1 input leading to NaN results', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0', odds6: '7.0',
                    totalStake: '0',
                    stake1: NaN, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0,
                    fixedField: 'stake1' as StakeField6Way,
                })
            );
            expect(isNaN(result.current.stake1)).toBe(true);
            expect(isNaN(result.current.stake2)).toBe(true);
        });
    });

    describe("when fixedField is 'stake2'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0', odds6: '7.0',
                    totalStake: '0',
                    stake1: 0, stake2: 70, stake3: 0, stake4: 0, stake5: 0, stake6: 0,
                    fixedField: 'stake2' as StakeField6Way,
                })
            );
            expect(result.current.stake2).toBe(70);
            expect(typeof result.current.stake1).toBe('number');
        });
    });

    describe("when fixedField is 'stake3'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0', odds6: '7.0',
                    totalStake: '0',
                    stake1: 0, stake2: 0, stake3: 52, stake4: 0, stake5: 0, stake6: 0,
                    fixedField: 'stake3' as StakeField6Way,
                })
            );
            expect(result.current.stake3).toBe(52);
            expect(typeof result.current.stake1).toBe('number');
        });
    });

    describe("when fixedField is 'stake4'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0', odds6: '7.0',
                    totalStake: '0',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 42, stake5: 0, stake6: 0,
                    fixedField: 'stake4' as StakeField6Way,
                })
            );
            expect(result.current.stake4).toBe(42);
            expect(typeof result.current.stake1).toBe('number');
        });
    });

    describe("when fixedField is 'stake5'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0', odds6: '7.0',
                    totalStake: '0',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 35, stake6: 0,
                    fixedField: 'stake5' as StakeField6Way,
                })
            );
            expect(result.current.stake5).toBe(35);
            expect(typeof result.current.stake1).toBe('number');
        });
    });

    describe("when fixedField is 'stake6'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0', odds6: '7.0',
                    totalStake: '0',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 30,
                    fixedField: 'stake6' as StakeField6Way,
                })
            );
            expect(result.current.stake6).toBe(30);
            expect(typeof result.current.stake1).toBe('number');
        });
    });

    describe('when odds are invalid', () => {
        it('should return zero profit/pp for non-numeric odds1', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: 'abc', odds2: '6.0', odds3: '6.0', odds4: '6.0', odds5: '6.0', odds6: '6.0',
                    totalStake: '120',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0,
                    fixedField: 'total' as StakeField6Way,
                })
            );
            expect(result.current.stake1).toBe(0);
            expect(result.current.profit).toBe(0);
            expect(result.current.profitPercentage).toBe(0);
        });

        it('should handle fixed stake1 being "0"', () => {
            const { result } = renderHook(() =>
                useSurebet6Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0', odds6: '7.0',
                    totalStake: '0',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0,
                    fixedField: 'stake1' as StakeField6Way,
                })
            );
            expect(result.current.stake1).toBe(0);
            expect(result.current.stake2).toBe(0);
            expect(result.current.totalStake).toBe('0');
            expect(result.current.profit).toBe(0);
        });
    });
});
