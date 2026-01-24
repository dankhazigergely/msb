import { renderHook } from '@testing-library/react';
import { useSurebet7Way } from '../useSurebet7Way';
import { StakeField7Way } from '@/app/types/surebet';

describe('useSurebet7Way', () => {
    describe("when fixedField is 'total'", () => {
        it('should calculate correctly for equal odds', () => {
            const { result } = renderHook(() =>
                useSurebet7Way({
                    odds1: '7.0', odds2: '7.0', odds3: '7.0', odds4: '7.0', odds5: '7.0', odds6: '7.0', odds7: '7.0',
                    totalStake: '140',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0, stake7: 0,
                    fixedField: 'total' as StakeField7Way,
                })
            );
            expect(result.current.stake1).toBe(20);
            expect(result.current.stake2).toBe(20);
            expect(result.current.stake3).toBe(20);
            expect(result.current.stake4).toBe(20);
            expect(result.current.stake5).toBe(20);
            expect(result.current.stake6).toBe(20);
            expect(result.current.stake7).toBe(20);
            expect(result.current.totalStake).toBe('140');
            expect(result.current.profit).toBeCloseTo(0);
            expect(result.current.profitPercentage).toBeCloseTo(0);
        });

        it('should handle invalid totalStake', () => {
            const { result } = renderHook(() =>
                useSurebet7Way({
                    odds1: '7.0', odds2: '7.0', odds3: '7.0', odds4: '7.0', odds5: '7.0', odds6: '7.0', odds7: '7.0',
                    totalStake: 'abc',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0, stake7: 0,
                    fixedField: 'total' as StakeField7Way,
                })
            );
            expect(result.current.profit).toBe(0);
            expect(result.current.profitPercentage).toBe(0);
        });
    });

    describe("when fixedField is 'stake1'", () => {
        it('should calculate correctly', () => {
            const { result } = renderHook(() =>
                useSurebet7Way({
                    odds1: '2.0', odds2: '3.0', odds3: '4.0', odds4: '5.0', odds5: '6.0', odds6: '7.0', odds7: '8.0',
                    totalStake: '0',
                    stake1: 100, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0, stake7: 0,
                    fixedField: 'stake1' as StakeField7Way,
                })
            );
            expect(result.current.stake1).toBe(100);
            expect(typeof result.current.stake2).toBe('number');
            expect(typeof result.current.profit).toBe('number');
        });
    });

    describe('when odds are invalid', () => {
        it('should return zero profit/pp for non-numeric odds1', () => {
            const { result } = renderHook(() =>
                useSurebet7Way({
                    odds1: 'abc', odds2: '7.0', odds3: '7.0', odds4: '7.0', odds5: '7.0', odds6: '7.0', odds7: '7.0',
                    totalStake: '140',
                    stake1: 0, stake2: 0, stake3: 0, stake4: 0, stake5: 0, stake6: 0, stake7: 0,
                    fixedField: 'total' as StakeField7Way,
                })
            );
            expect(result.current.profit).toBe(0);
            expect(result.current.profitPercentage).toBe(0);
        });
    });
});
