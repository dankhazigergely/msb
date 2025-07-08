import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SureBetCalculator3Way from '../SureBetCalculator3Way';
import '@testing-library/jest-dom';
import { CalculatorState3Way } from '@/app/page';

// Mock CalculatorHeader
jest.mock('@/app/components/CalculatorHeader', () => {
  return jest.fn(({ title, value, onReset }) => (
    <div>
      <h1>{title}</h1>
      <span>{value.toFixed(2)}%</span>
      {onReset && <button aria-label="Reset" onClick={onReset}>HeaderReset</button>}
    </div>
  ));
});

// Mock BetSaveSection
jest.mock('@/app/components/BetSaveSection', () => {
    return jest.fn(() => <div data-testid="bet-save-section">MockBetSaveSection</div>);
});

const initialCalculatorState: CalculatorState3Way = {
  odds1: '',
  odds2: '',
  odds3: '',
  odds1Type: 'Decimal',
  odds2Type: 'Decimal',
  odds3Type: 'Decimal',
  totalStake: '100',
  stake1: 0,
  stake2: 0,
  stake3: 0,
  fixedField: 'total',
  name: '',
};

describe('SureBetCalculator3Way', () => {
  let mockSetCalculatorState: jest.Mock;
  let mockResetCalculatorState: jest.Mock;

  beforeEach(() => {
    mockSetCalculatorState = jest.fn();
    mockResetCalculatorState = jest.fn();
  });

  const renderComponent = (props: Partial<React.ComponentProps<typeof SureBetCalculator3Way>> = {}) => {
    const defaultProps: React.ComponentProps<typeof SureBetCalculator3Way> = {
      calculatorState: initialCalculatorState,
      setCalculatorState: mockSetCalculatorState,
      resetCalculatorState: mockResetCalculatorState,
      ...props,
    };
    return render(<SureBetCalculator3Way {...defaultProps} />);
  };

  it('renders correctly with initial state', () => {
    renderComponent();
    expect(screen.getByText('3-Way Calculator')).toBeInTheDocument();
    expect(screen.getByLabelText('Odds 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Stake 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Odds 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Stake 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Odds 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Stake 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Total')).toBeInTheDocument(); // Changed "Total Stake" to "Total"
    expect(screen.getByTestId('bet-save-section')).toBeInTheDocument();
  });

  it('calls resetCalculatorState when header reset button is clicked', () => {
    renderComponent();
    const resetButton = screen.getByRole('button', { name: /Reset/i }); // Changed to query by aria-label
    fireEvent.click(resetButton);
    expect(mockResetCalculatorState).toHaveBeenCalledTimes(1);
  });

  it('updates odds1 input field', () => {
    renderComponent();
    const odds1Input = screen.getByLabelText('Odds 1');
    fireEvent.change(odds1Input, { target: { value: '3.0' } });
    expect(mockSetCalculatorState).toHaveBeenCalledWith(expect.any(Function));
  });

  it('updates stake1 input field and sets fixedField to stake1', () => {
    renderComponent({ calculatorState: { ...initialCalculatorState, fixedField: 'total' }});
    const stake1Input = screen.getByLabelText('Stake 1');
    fireEvent.click(stake1Input);
    fireEvent.change(stake1Input, { target: { value: '30' } });
    expect(mockSetCalculatorState).toHaveBeenCalledWith(expect.any(Function));
    const lastCallArg = mockSetCalculatorState.mock.calls[mockSetCalculatorState.mock.calls.length - 1][0];
    const newState = lastCallArg(initialCalculatorState);
    expect(newState.stake1).toBe(30);
    expect(newState.fixedField).toBe('stake1');
  });
});
