import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeSwitcherIcon from '../ThemeSwitcherIcon';
import { Sun, Moon } from 'lucide-react';

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const originalModule = jest.requireActual('lucide-react');
  return {
    ...originalModule,
    Sun: jest.fn(() => <svg data-testid="sun-icon" />),
    Moon: jest.fn(() => <svg data-testid="moon-icon" />),
  };
});

describe('ThemeSwitcherIcon', () => {
  it('renders moon icon when theme is light', () => {
    render(<ThemeSwitcherIcon theme="light" toggleTheme={() => {}} />);
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
  });

  it('renders sun icon when theme is dark', () => {
    render(<ThemeSwitcherIcon theme="dark" toggleTheme={() => {}} />);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    const toggleThemeMock = jest.fn();
    render(<ThemeSwitcherIcon theme="light" toggleTheme={toggleThemeMock} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  it('has the correct aria-label', () => {
    render(<ThemeSwitcherIcon theme="light" toggleTheme={() => {}} />);
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });
});
