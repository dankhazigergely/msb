import { renderHook } from '@testing-library/react';
import { useSurebetNWay } from '../useSurebetNWay';

describe('useSurebetNWay', () => {
    // N=2 tesztek - összevethető a meglévő useSurebet2Way eredményeivel
    describe('N=2, fixedField total', () => {
        it('egyenlő oddsokkal helyes eredményt ad', () => {
            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds: ['2.0', '2.0'],
                    stakes: [0, 0],
                    totalStake: '100',
                    fixedField: 'total',
                })
            );
            expect(result.current.stakes[0]).toBe(50);
            expect(result.current.stakes[1]).toBe(50);
            expect(result.current.totalStake).toBe('100');
            expect(result.current.profit).toBeCloseTo(0);
            expect(result.current.profitPercentage).toBeCloseTo(0);
        });

        it('különböző oddsokkal profitot számít', () => {
            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds: ['1.5', '3.5'],
                    stakes: [0, 0],
                    totalStake: '100',
                    fixedField: 'total',
                })
            );
            expect(result.current.stakes[0]).toBe(70);
            expect(result.current.stakes[1]).toBe(30);
            expect(result.current.totalStake).toBe('100');
            expect(result.current.profit).toBeCloseTo(5);
            expect(result.current.profitPercentage).toBeCloseTo(5);
        });

        it('érvénytelen totalStake esetén 0 profit', () => {
            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds: ['2.0', '2.0'],
                    stakes: [0, 0],
                    totalStake: 'abc',
                    fixedField: 'total',
                })
            );
            expect(result.current.profit).toBe(0);
            expect(result.current.profitPercentage).toBe(0);
        });
    });

    describe('N=2, fixedField stake index', () => {
        it('stake1 fixálva helyes eredményt ad', () => {
            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds: ['1.5', '3.0'],
                    stakes: [60, 0],
                    totalStake: '0',
                    fixedField: 0,
                })
            );
            expect(result.current.stakes[0]).toBe(60);
            expect(result.current.stakes[1]).toBe(30);
            expect(result.current.totalStake).toBe('90');
            expect(result.current.profit).toBeCloseTo(0);
            expect(result.current.profitPercentage).toBeCloseTo(0);
        });

        it('stake2 fixálva helyes eredményt ad', () => {
            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds: ['1.8', '2.2'],
                    stakes: [0, 110],
                    totalStake: '0',
                    fixedField: 1,
                })
            );
            expect(result.current.stakes[0]).toBe(134);
            expect(result.current.stakes[1]).toBe(110);
            expect(result.current.totalStake).toBe('244');
            expect(result.current.profit).toBeCloseTo(-2.8);
            expect(result.current.profitPercentage).toBeCloseTo(-1);
        });
    });

    // N=3 teszt
    describe('N=3, fixedField total', () => {
        it('egyenlő oddsokkal helyes eredményt ad', () => {
            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds: ['3.0', '3.0', '3.0'],
                    stakes: [0, 0, 0],
                    totalStake: '100',
                    fixedField: 'total',
                })
            );
            expect(result.current.stakes[0]).toBe(33);
            expect(result.current.stakes[1]).toBe(33);
            expect(result.current.stakes[2]).toBe(33);
            expect(result.current.totalStake).toBe('100');
            expect(result.current.profit).toBeCloseTo(-1); // 33*3 - 100 = -1 (kerekítés miatt)
            expect(result.current.profitPercentage).toBeCloseTo(0);
        });
    });

    // N=10 teszt
    describe('N=10, fixedField total', () => {
        it('egyenlő oddsokkal helyes számítás', () => {
            const odds = new Array(10).fill('10.0');
            const stakes = new Array(10).fill(0);

            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds,
                    stakes,
                    totalStake: '10000',
                    fixedField: 'total',
                })
            );
            // 10 egyenlő odds=10 esetén minden stake egyenlő
            expect(result.current.stakes[0]).toBe(1000);
            expect(result.current.stakes[9]).toBe(1000);
            expect(result.current.totalStake).toBe('10000');
            // profitPercentage = (10^10 / (10 * 10^9) - 1) * 100 = (10^10 / 10^10 - 1) * 100 = 0
            expect(result.current.profitPercentage).toBeCloseTo(0);
        });
    });

    // N=20 teszt
    describe('N=20, fixedField total', () => {
        it('egyenlő oddsokkal helyes számítás', () => {
            const odds = new Array(20).fill('20.0');
            const stakes = new Array(20).fill(0);

            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds,
                    stakes,
                    totalStake: '20000',
                    fixedField: 'total',
                })
            );
            // 20 egyenlő odds=20 esetén minden stake egyenlő
            expect(result.current.stakes[0]).toBe(1000);
            expect(result.current.stakes[19]).toBe(1000);
            expect(result.current.totalStake).toBe('20000');
            expect(result.current.profitPercentage).toBeCloseTo(0);
        });
    });

    // Érvénytelen odds teszt
    describe('érvénytelen odds', () => {
        it('NaN odds esetén 0 profit', () => {
            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds: ['abc', '2.0', '3.0'],
                    stakes: [0, 0, 0],
                    totalStake: '100',
                    fixedField: 'total',
                })
            );
            expect(result.current.profit).toBe(0);
            expect(result.current.profitPercentage).toBe(0);
        });
    });

    // Fixed stake index N=10
    describe('N=10, fixedField stake index', () => {
        it('stake 3 fixálva helyes eredményt ad', () => {
            const odds = new Array(10).fill('10.0');
            const stakes = new Array(10).fill(0);
            stakes[2] = 500; // Stake 3 fixálva

            const { result } = renderHook(() =>
                useSurebetNWay({
                    odds,
                    stakes,
                    totalStake: '0',
                    fixedField: 2,
                })
            );
            // Egyenlő odds esetén minden stake egyenlő a fixálttal
            expect(result.current.stakes[0]).toBe(500);
            expect(result.current.stakes[2]).toBe(500);
            expect(result.current.stakes[9]).toBe(500);
            expect(result.current.totalStake).toBe('5000');
        });
    });
});
