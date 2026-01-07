import { renderHook } from '@testing-library/react';
import { useSurebet5Way } from '../useSurebet5Way';
import { StakeField5Way } from '@/app/types/surebet';

describe('useSurebet5Way', () => {
    // Test suite for fixedField = 'total'
    describe("when fixedField is 'total'", () => {
        it('should calculate correctly for equal odds', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: '5.0',
                    odds2: '5.0',
                    odds3: '5.0',
                    odds4: '5.0',
                    odds5: '5.0',
                    totalStake: '100',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0,
                    fixedField: 'total' as StakeField5Way,
                })
            );
            // Minden odds egyenlő, minden stake 20 lesz (100/5)
            expect(result.current.stake1).toBe(20);
            expect(result.current.stake2).toBe(20);
            expect(result.current.stake3).toBe(20);
            expect(result.current.stake4).toBe(20);
            expect(result.current.stake5).toBe(20);
            expect(result.current.totalStake).toBe('100');
            // Profit = 20 * 5.0 - 100 = 100 - 100 = 0
            expect(result.current.profit).toBeCloseTo(0);
            // ProfitPercentage = 0 (fair odds)
            expect(result.current.profitPercentage).toBeCloseTo(0);
        });

        it('should calculate correctly for different odds', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: '2.0', // n1
                    odds2: '3.0', // n2
                    odds3: '4.0', // n3
                    odds4: '5.0', // n4
                    odds5: '6.0', // n5
                    totalStake: '274', // Totálnak megfelelő
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0,
                    fixedField: 'total' as StakeField5Way,
                })
            );
            // denom = 360 + 240 + 180 + 144 + 120 = 1044
            // s1 = round(274 * 360 / 1044) = round(94.48) = 94
            // s2 = round(274 * 240 / 1044) = round(62.99) = 63
            // s3 = round(274 * 180 / 1044) = round(47.24) = 47
            // s4 = round(274 * 144 / 1044) = round(37.79) = 38
            // s5 = round(274 * 120 / 1044) = round(31.49) = 31
            expect(result.current.stake1).toBe(94);
            expect(result.current.stake2).toBe(63);
            expect(result.current.stake3).toBe(47);
            expect(result.current.stake4).toBe(38);
            expect(result.current.stake5).toBe(31);
            expect(result.current.totalStake).toBe('274');
        });

        it('should handle invalid totalStake', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: '5.0', odds2: '5.0', odds3: '5.0', odds4: '5.0', odds5: '5.0',
                    totalStake: 'abc',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0,
                    fixedField: 'total' as StakeField5Way,
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
                useSurebet5Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0',
                    totalStake: '0',
                    stake1: 90, stake2: 0, stake3: 0, stake4: 0, stake5: 0,
                    fixedField: 'stake1' as StakeField5Way,
                })
            );
            // Számított értékek a rögzített stake1=90 alapján
            expect(result.current.stake1).toBe(90);
            expect(typeof result.current.stake2).toBe('number');
            expect(typeof result.current.stake3).toBe('number');
            expect(typeof result.current.stake4).toBe('number');
            expect(typeof result.current.stake5).toBe('number');
            expect(typeof result.current.profit).toBe('number');
        });

        it('should handle NaN stake1 input leading to NaN results', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0',
                    totalStake: '0',
                    stake1: NaN, stake2: 0, stake3: 0, stake4: 0, stake5: 0,
                    fixedField: 'stake1' as StakeField5Way,
                })
            );
            expect(isNaN(result.current.stake1)).toBe(true);
            expect(isNaN(result.current.stake2)).toBe(true);
        });
    });

    describe("when fixedField is 'stake2'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0',
                    totalStake: '0',
                    stake1: 0, stake2: 60, stake3: 0, stake4: 0, stake5: 0,
                    fixedField: 'stake2' as StakeField5Way,
                })
            );
            expect(result.current.stake2).toBe(60);
            expect(typeof result.current.stake1).toBe('number');
        });
    });

    describe("when fixedField is 'stake3'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0',
                    totalStake: '0',
                    stake1: 0, stake2: 0, stake3: 45, stake4: 0, stake5: 0,
                    fixedField: 'stake3' as StakeField5Way,
                })
            );
            expect(result.current.stake3).toBe(45);
            expect(typeof result.current.stake1).toBe('number');
        });
    });

    describe("when fixedField is 'stake4'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0',
                    totalStake: '0',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 36, stake5: 0,
                    fixedField: 'stake4' as StakeField5Way,
                })
            );
            expect(result.current.stake4).toBe(36);
            expect(typeof result.current.stake1).toBe('number');
        });
    });

    describe("when fixedField is 'stake5'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0',
                    totalStake: '0',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 30,
                    fixedField: 'stake5' as StakeField5Way,
                })
            );
            expect(result.current.stake5).toBe(30);
            expect(typeof result.current.stake1).toBe('number');
        });
    });

    describe('when odds are invalid', () => {
        it('should return zero profit/pp for non-numeric odds1', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: 'abc', odds2: '5.0', odds3: '5.0', odds4: '5.0', odds5: '5.0',
                    totalStake: '100',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0,
                    fixedField: 'total' as StakeField5Way,
                })
            );
            expect(result.current.stake1).toBe(0);
            expect(result.current.profit).toBe(0);
            expect(result.current.profitPercentage).toBe(0);
        });

        it('should handle fixed stake1 being "0"', () => {
            const { result } = renderHook(() =>
                useSurebet5Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0',
                    totalStake: '0',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0,
                    fixedField: 'stake1' as StakeField5Way,
                })
            );
            expect(result.current.stake1).toBe(0);
            expect(result.current.stake2).toBe(0);
            expect(result.current.totalStake).toBe('0');
            expect(result.current.profit).toBe(0);
        });
    });
});
