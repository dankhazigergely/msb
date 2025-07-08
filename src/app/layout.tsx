"use client"; // Required for useState and useEffect

import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator'; // Import Calculator
import CalculatorIcon from './components/CalculatorIcon'; // Import CalculatorIcon

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata needs to be exported separately when "use client" is used at the top level of layout.
// However, for this specific case, we can keep RootLayout as a server component
// and wrap the client-specific parts in their own component or use a Client Boundary.
// For simplicity in this step, I'll convert RootLayout to a client component.
// A better approach for larger apps would be to keep RootLayout a Server Component
// and introduce a new client component that wraps {children} and the calculator logic.

// export const metadata: Metadata = { // This would cause an error with "use client"
//   title: 'Mini SB Calculator',
//   description: 'Calculate margins',
//   icons: {
//     icon: '/favicon.png',
//     apple: '/favicon.png',
//   },
// };
// If "use client" is used, metadata should be handled differently, e.g. in a server component parent
// or by using the `metadata` object within the component if supported by the Next.js version for client components.
// For now, to make it work, we'll remove the static metadata export here and assume it's handled elsewhere or not critical for this step.


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const toggleCalculator = () => {
    setIsCalculatorOpen(!isCalculatorOpen);
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
    <html lang="en">
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <CalculatorIcon isCalculatorOpen={isCalculatorOpen} toggleCalculator={toggleCalculator} />
        <Calculator isOpen={isCalculatorOpen} onClose={toggleCalculator} />
      </body>
    </html>
  );
}
