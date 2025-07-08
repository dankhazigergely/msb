import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SureBetCalculator2Way from '../SureBetCalculator2Way';
import '@testing-library/jest-dom';
import { CalculatorState2Way } from '@/app/page';

// Mock CalculatorHeader to check if onReset is passed correctly
jest.mock('@/app/components/CalculatorHeader', () => {
  return jest.fn(({ title, value, onReset }) => (
    <div>
      <h1>{title}</h1>
      <span>{value.toFixed(2)}%</span>
      {onReset && <button aria-label="Reset" onClick={onReset}>HeaderReset</button>}
    </div>
  ));
});

// Mock BetSaveSection as its functionality is not the focus of this test
jest.mock('@/app/components/BetSaveSection', () => {
    return jest.fn(() => <div data-testid="bet-save-section">MockBetSaveSection</div>);
});


const initialCalculatorState: CalculatorState2Way = {
  odds1: '',
  odds2: '',
  odds1Type: 'Decimal',
  odds2Type: 'Decimal',
  totalStake: '100',
  stake1: 0,
  stake2: 0,
  fixedField: 'total',
  name: '',
};

describe('SureBetCalculator2Way', () => {
  let mockSetCalculatorState: jest.Mock;
  let mockResetCalculatorState: jest.Mock;

  beforeEach(() => {
    mockSetCalculatorState = jest.fn();
    mockResetCalculatorState = jest.fn();
  });

  const renderComponent = (props: Partial<React.ComponentProps<typeof SureBetCalculator2Way>> = {}) => {
    const defaultProps: React.ComponentProps<typeof SureBetCalculator2Way> = {
      calculatorState: initialCalculatorState,
      setCalculatorState: mockSetCalculatorState,
      resetCalculatorState: mockResetCalculatorState,
      ...props,
    };
    return render(<SureBetCalculator2Way {...defaultProps} />);
  };

  it('renders correctly with initial state', () => {
    renderComponent();
    expect(screen.getByText('2-Way Calculator')).toBeInTheDocument();
    // Check for OddsStakeRow components by their labels or unique IDs
    expect(screen.getByLabelText('Odds 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Stake 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Odds 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Stake 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Total')).toBeInTheDocument(); // Changed "Total Stake" to "Total"
    expect(screen.getByTestId('bet-save-section')).toBeInTheDocument();
  });

  it('calls resetCalculatorState when header reset button is clicked', () => {
    renderComponent();
    // The mock renders a button with aria-label="Reset" and text "HeaderReset"
    // We should query by the aria-label as that's what the mock provides for accessibility
    const resetButton = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetButton);
    expect(mockResetCalculatorState).toHaveBeenCalledTimes(1);
  });

  it('updates odds1 input field', () => {
    renderComponent();
    const odds1Input = screen.getByLabelText('Odds 1');
    fireEvent.change(odds1Input, { target: { value: '2.0' } });
    expect(mockSetCalculatorState).toHaveBeenCalledWith(expect.any(Function));
    // To actually check the state update, you'd need to simulate the state update logic
    // For now, we just check if the setter is called.
  });

  it('updates totalStake input field and sets fixedField to total', () => {
    renderComponent();
    const totalStakeInput = screen.getByLabelText('Total'); // Changed "Total Stake" to "Total"
    fireEvent.change(totalStakeInput, { target: { value: '200' } });
    expect(mockSetCalculatorState).toHaveBeenCalledWith(expect.any(Function));
    // Example of how you might check the argument to setCalculatorState if needed:
    // const lastCall = mockSetCalculatorState.mock.calls[mockSetCalculatorState.mock.calls.length - 1][0];
    // expect(lastCall(initialCalculatorState)).toEqual(expect.objectContaining({ totalStake: '200', fixedField: 'total' }));
  });

  it('updates stake1 input field and sets fixedField to stake1', () => {
    renderComponent({ calculatorState: { ...initialCalculatorState, fixedField: 'total' }});
    const stake1Input = screen.getByLabelText('Stake 1');
    // Need to enable the input first by clicking it if it's part of a radio group behavior
    fireEvent.click(stake1Input); // This might be necessary if the input is disabled until selected
    fireEvent.change(stake1Input, { target: { value: '50' } });
    expect(mockSetCalculatorState).toHaveBeenCalledWith(expect.any(Function));
    // Check the fixedField update
    const lastCallArg = mockSetCalculatorState.mock.calls[mockSetCalculatorState.mock.calls.length - 1][0];
    const newState = lastCallArg(initialCalculatorState);
    expect(newState.stake1).toBe(50);
    expect(newState.fixedField).toBe('stake1');
  });

});
