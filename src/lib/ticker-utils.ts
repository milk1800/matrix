// src/lib/ticker-utils.ts

export const tickerToNameMap: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corporation',
  GOOG: 'Alphabet Inc.',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com, Inc.',
  TSLA: 'Tesla, Inc.',
  JPM: 'JPMorgan Chase & Co.',
  VTI: 'Vanguard Total Stock Market ETF',
  AGG: 'iShares Core U.S. Aggregate Bond ETF',
  VNQ: 'Vanguard Real Estate ETF',
  ARKK: 'ARK Innovation ETF',
  BIL: 'SPDR Bloomberg 1-3 Month T-Bill ETF',
  XLF: 'Financial Select Sector SPDR Fund',
  NVDA: 'NVIDIA Corporation',
  META: 'Meta Platforms, Inc.',
  JNJ: 'Johnson & Johnson',
  V: 'Visa Inc.',
  PG: 'Procter & Gamble Co.',
  UNH: 'UnitedHealth Group Inc.',
  DIS: 'The Walt Disney Company',
  MA: 'Mastercard Incorporated',
  HD: 'The Home Depot, Inc.',
  BAC: 'Bank of America Corp',
  NFLX: 'Netflix, Inc.',
  XOM: 'Exxon Mobil Corporation',
  KO: 'The Coca-Cola Company',
  CSCO: 'Cisco Systems, Inc.',
};

/**
 * Gets the full company name from a ticker symbol.
 * @param ticker The stock ticker symbol.
 * @returns The full company name, or the ticker itself if not found.
 */
export const getCompanyNameFromTicker = (ticker: string): string => {
  return tickerToNameMap[ticker] || ticker;
};

/**
 * Formats a display string with the company name and ticker.
 * e.g., "Apple Inc. (AAPL)"
 * @param ticker The stock ticker symbol.
 * @returns The formatted string, or the ticker itself if not found.
 */
export const formatTickerAndName = (ticker: string): string => {
    const name = getCompanyNameFromTicker(ticker);
    if (name !== ticker) {
        return `${name} (${ticker})`;
    }
    return ticker;
}
