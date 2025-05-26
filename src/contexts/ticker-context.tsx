
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface TickerContextType {
  tickerMessage: string;
  setTickerMessage: Dispatch<SetStateAction<string>>;
}

const TickerContext = createContext<TickerContextType | undefined>(undefined);

export function TickerProvider({ children }: { children: ReactNode }) {
  const [tickerMessage, setTickerMessage] = useState('');

  return (
    <TickerContext.Provider value={{ tickerMessage, setTickerMessage }}>
      {children}
    </TickerContext.Provider>
  );
}

export function useTicker() {
  const context = useContext(TickerContext);
  if (context === undefined) {
    throw new Error('useTicker must be used within a TickerProvider');
  }
  return context;
}
