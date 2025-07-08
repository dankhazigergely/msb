import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResetButton from '../ResetButton';
import '@testing-library/jest-dom';

describe('ResetButton', () => {
  it('renders correctly', () => {
    const handleClick = jest.fn();
    render(<ResetButton onClick={handleClick} />);
    const buttonElement = screen.getByRole('button', { name: /reset/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.querySelector('svg')).toBeInTheDocument(); // Check for XIcon
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<ResetButton onClick={handleClick} />);
    const buttonElement = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies additional className', () => {
    const handleClick = jest.fn();
    const customClass = "my-custom-class";
    render(<ResetButton onClick={handleClick} className={customClass} />);
    const buttonElement = screen.getByRole('button', { name: /reset/i });
    expect(buttonElement).toHaveClass(customClass);
  });
});
