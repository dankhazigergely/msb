import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorHeader from '../CalculatorHeader';
import '@testing-library/jest-dom';

// Mock the ResetButton to simplify testing CalculatorHeader's logic
jest.mock('../ResetButton', () => {
  return jest.fn(({ onClick }) => (
    <button aria-label="Reset" onClick={onClick}>MockReset</button>
  ));
});

describe('CalculatorHeader', () => {
  const defaultProps = {
    title: 'Test Calculator',
    value: 10.5,
  };

  it('renders title and value correctly', () => {
    render(<CalculatorHeader {...defaultProps} />);
    expect(screen.getByText('Test Calculator')).toBeInTheDocument();
    expect(screen.getByText(/10.50%/i)).toBeInTheDocument();
  });

  it('renders valueLabel when provided', () => {
    render(<CalculatorHeader {...defaultProps} valueLabel="Profit" />);
    expect(screen.getByText(/Profit: 10.50%/i)).toBeInTheDocument();
  });

  it('does not render ResetButton when onReset is not provided', () => {
    render(<CalculatorHeader {...defaultProps} />);
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
  });

  it('renders ResetButton when onReset is provided', () => {
    const handleReset = jest.fn();
    render(<CalculatorHeader {...defaultProps} onReset={handleReset} />);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveTextContent('MockReset'); // Check content of the mocked button
  });

  it('calls onReset when ResetButton is clicked', () => {
    const handleReset = jest.fn();
    render(<CalculatorHeader {...defaultProps} onReset={handleReset} />);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('applies additional className', () => {
    const customClass = 'my-custom-header-class';
    render(<CalculatorHeader {...defaultProps} className={customClass} />);
    // The className is applied to the root div of CalculatorHeader
    // We need to select it, e.g., by its content or structure if no specific test-id is available
    const headerElement = screen.getByText(defaultProps.title).closest('div.relative');
    expect(headerElement).toHaveClass(customClass);
  });
});
