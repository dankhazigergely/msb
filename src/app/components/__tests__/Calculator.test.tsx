import React from 'react'; // Changed from '@testing-library/react' which is not a module
import { render, fireEvent, screen } from '@testing-library/react';
import Calculator from '../Calculator';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Calculator Component', () => {
  const mockOnClose = jest.fn();

  // These will be set in beforeEach
  let container: HTMLElement;
  let unmount: () => void;

  // Helper to get the display element
  const getDisplay = () => container.querySelector('.text-2xl.font-bold');
  const getHistoryDisplay = () => container.querySelector('.text-xs.text-muted-foreground.truncate');
  const getFullHistoryItems = () => Array.from(container.querySelectorAll('.mt-3 div.truncate'));


  beforeEach(() => {
      localStorageMock.clear();
      mockOnClose.mockClear();
      // Unmount previous render if any, then render new
      if (unmount) unmount();
      const renderResult = render(<Calculator isOpen={true} onClose={mockOnClose} />);
      container = renderResult.container;
      unmount = renderResult.unmount;
    });

    afterEach(() => {
      if (unmount) unmount();
    });

  test('renders calculator when isOpen is true', () => {
    expect(screen.getByText('Számológép')).toBeInTheDocument();
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(getDisplay()).toHaveTextContent('0'); // Initial display
  });

  test('does not render calculator when isOpen is false', () => {
    if (unmount) unmount(); // unmount the default one from outer beforeEach
    const { queryByText } = render(<Calculator isOpen={false} onClose={mockOnClose} />);
    // Check for a unique element from the calculator
    expect(queryByText('Számológép')).not.toBeInTheDocument();
  });

  test('handles number clicks and updates display', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(getDisplay()).toHaveTextContent('123');
  });

  test('handles decimal point correctly', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(getDisplay()).toHaveTextContent('1.5');
    // Clicking decimal again should not add another one
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    expect(getDisplay()).toHaveTextContent('1.5');
  });

  test('performs addition correctly', () => {
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('5');
    // Check history (the current operation line)
    expect(getHistoryDisplay()).toHaveTextContent('2 + 3 = 5');
    // Check full history list
    const historyItems = getFullHistoryItems();
    expect(historyItems.some(item => item.textContent === '2 + 3 = 5')).toBe(true);
  });

  test('performs subtraction correctly', () => {
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '−' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('3');
    expect(getHistoryDisplay()).toHaveTextContent('5 - 2 = 3');
  });

  test('performs multiplication correctly', () => {
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('12');
    expect(getHistoryDisplay()).toHaveTextContent('3 * 4 = 12');
  });

  test('performs division correctly', () => {
    fireEvent.click(screen.getByRole('button', { name: '8' }));
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('4');
    expect(getHistoryDisplay()).toHaveTextContent('8 / 2 = 4');
  });

  test('handles division by zero', () => {
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('Error');
    expect(getHistoryDisplay()).toHaveTextContent('5 / 0 = Error');
  });

  test('AC (Clear All) button resets calculator', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: 'AC' }));
    expect(getDisplay()).toHaveTextContent('0'); // Display should be 0
    expect(getHistoryDisplay()).toHaveTextContent(''); // Current history line should be empty
    expect(getFullHistoryItems().length).toBe(0); // Full history should be empty

    // Try a new calculation
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('10');
  });

  test('DEL (Delete) button removes last digit from input', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: 'DEL' }));
    expect(getDisplay()).toHaveTextContent('12');
    fireEvent.click(screen.getByRole('button', { name: 'DEL' }));
    expect(getDisplay()).toHaveTextContent('1');
    fireEvent.click(screen.getByRole('button', { name: 'DEL' }));
    expect(getDisplay()).toHaveTextContent('0'); // Display becomes '0' when input is empty
  });

  test('chains operations correctly (e.g. 2 + 3 * 4 = 20)', () => {
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    // At this point: input="3", previousValue="2", operator="+"

    fireEvent.click(screen.getByRole('button', { name: '×' }));
    // 1. calculateResult("2+3") is called. It sets: input="5", previousValue="5", operator=null, isResultDisplayed=true. Returns "5".
    // 2. handleOperatorClick uses "5" (the returned result): sets previousValue="5", operator="*", history gets "5 *", input="", isResultDisplayed=false.
    // So, the main display (input) should be "5" *during* the processing triggered by "×", specifically after calculateResult() updates it.
    // The test queries the DOM *after* all these synchronous state updates within the event handler have been processed (or queued and processed by React).
    // The final state of `input` after the entire `handleOperatorClick` for `*` will be `''`.
    // The intermediate display of "5" is what we need to test.

    // To test the intermediate state, we'd need to spy on setInput or structure the component differently.
    // Given the current structure, we test the state *after* the event handler completes.
    // After "×" is clicked and processed: previousValue="5", operator="*", input="". History shows "2+3=5" and "5 *".
    // The history line display should show "5 *"
    expect(getFullHistoryItems().find(item => item.textContent === '2 + 3 = 5')).toBeTruthy();
    expect(getHistoryDisplay()).toHaveTextContent("5 *");
    expect(getDisplay()).toHaveTextContent('0'); // Input is cleared, shows '0' by default

    fireEvent.click(screen.getByRole('button', { name: '4' })); // Display: 4, HistoryLine: 5 *
    fireEvent.click(screen.getByRole('button', { name: '=' })); // Calculates 5*4=20. Display: 20. HistoryLine: 5 * 4 = 20
    expect(getDisplay()).toHaveTextContent('20');
    expect(getFullHistoryItems().find(item => item.textContent === '5 * 4 = 20')).toBeTruthy();
  });

  test('persists state in localStorage and restores it', () => {
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '8' })); // Input '8', prev '7', op '+', history ['7 +']

    if (unmount) unmount();
    const renderResult = render(<Calculator isOpen={true} onClose={mockOnClose} />);
    container = renderResult.container; // Update container for new render
    unmount = renderResult.unmount; // Update unmount for new render

    expect(getDisplay()).toHaveTextContent('8');
    expect(getHistoryDisplay()).toHaveTextContent("7 +");

    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('15');
    expect(getFullHistoryItems().find(item => item.textContent === '7 + 8 = 15')).toBeTruthy();

    // Clear and check again
    fireEvent.click(screen.getByRole('button', { name: 'AC' }));
    if (unmount) unmount();
    const finalRenderResult = render(<Calculator isOpen={true} onClose={mockOnClose} />);
    container = finalRenderResult.container;
    unmount = finalRenderResult.unmount;

    expect(getDisplay()).toHaveTextContent('0');
    expect(getFullHistoryItems().length).toBe(0);
  });

  test('handles multiple operations without pressing equals', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' })); // input="2"
    fireEvent.click(screen.getByRole('button', { name: '−' }));
    // calculateResult("1+2") runs. input="3", prevVal="3", op=null, isDispResult=true. Returns "3".
    // handleOpClick uses "3": prevVal="3", op="-", history gets "3 -", input="", isDispResult=false.
    expect(getFullHistoryItems().find(item => item.textContent === '1 + 2 = 3')).toBeTruthy();
    expect(getHistoryDisplay()).toHaveTextContent("3 -"); // Corrected to hyphen
    expect(getDisplay()).toHaveTextContent('0'); // Input is cleared, shows '0' by default


    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('2');
    expect(getFullHistoryItems().find(item => item.textContent === '3 - 1 = 2')).toBeTruthy();
  });

  test('clicking operator after equals uses result as first operand', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' })); // Result is 3. input="3", prevVal="3", op=null, isDispResult=true
    expect(getDisplay()).toHaveTextContent('3');

    fireEvent.click(screen.getByRole('button', { name: '×' }));
    // handleOpClick: currentInput="3", isResultDisplayed=true. previousValue="3" (from after equals).
    // valueToUseAsOperand="3". previousValue="3", operator="*", input="", isDispResult=false. History gets "3 *".
    expect(getHistoryDisplay()).toHaveTextContent("3 *");
    expect(getDisplay()).toHaveTextContent('0'); // Input is cleared, shows '0' by default

    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('12');
    expect(getFullHistoryItems().find(item => item.textContent === '3 * 4 = 12')).toBeTruthy();
  });
  test('clicking number after equals starts a new calculation', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' })); // Result is 3
    expect(getDisplay()).toHaveTextContent('3');
    const firstCalcHistory = getFullHistoryItems().find(item => item.textContent === '1 + 2 = 3');
    expect(firstCalcHistory).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '5' })); // Should start new input '5'
    expect(getDisplay()).toHaveTextContent('5');
    // Previous calculation "1 + 2 = 3" should still be in full history
    expect(getFullHistoryItems().find(item => item.textContent === '1 + 2 = 3')).toEqual(firstCalcHistory);
    // Current history line will show the last completed calculation if previousValue and operator are null
    expect(getHistoryDisplay()).toHaveTextContent('1 + 2 = 3');


    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(getDisplay()).toHaveTextContent('11');
    expect(getFullHistoryItems().find(item => item.textContent === '5 + 6 = 11')).toBeTruthy();
  });
});
