"use client"; // Required for useState and useEffect

import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator'; // Import Calculator
import CalculatorIcon from './components/CalculatorIcon'; // Import CalculatorIcon
import ThemeSwitcherIcon from './components/ThemeSwitcherIcon'; // Import ThemeSwitcherIcon

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [theme, setTheme] = useState('light'); // Default theme

  // Load theme from localStorage on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Apply theme to HTML element and save to localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleCalculator = () => {
    setIsCalculatorOpen(!isCalculatorOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Close calculator on Escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCalculatorOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);


  return (
    <html lang="en" className={theme}>
      <head>
        {/* It's generally recommended to put metadata tags directly in <head> or use Next.js <Head> component from 'next/head' for client components if needed,
            but for app router, metadata API is preferred. Since we made this a client component, this setup is a bit mixed.
            The manifest link is fine here.
        */}
        <title>Mini SB Calculator</title>
        <meta name="description" content="Calculate margins" />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
        <ThemeSwitcherIcon theme={theme} toggleTheme={toggleTheme} />
        <CalculatorIcon isCalculatorOpen={isCalculatorOpen} toggleCalculator={toggleCalculator} />
        <Calculator isOpen={isCalculatorOpen} onClose={toggleCalculator} />
      </body>
    </html>
  );
}
