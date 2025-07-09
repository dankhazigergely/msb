import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeSwitcherIconProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeSwitcherIcon: React.FC<ThemeSwitcherIconProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 left-4 z-50 p-3 bg-card text-card-foreground rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </button>
  );
};

export default ThemeSwitcherIcon;
