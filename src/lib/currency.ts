import { CurrencyCode } from '../types';

export const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbol: string; label: string }> = {
  USD: { rate: 1.0, symbol: '$', label: 'USD ($)' },
  EUR: { rate: 0.92, symbol: '€', label: 'EUR (€)' },
  GBP: { rate: 0.78, symbol: '£', label: 'GBP (£)' },
  INR: { rate: 86.5, symbol: '₹', label: 'INR (₹)' },
  AED: { rate: 3.67, symbol: 'AED ', label: 'AED (د.إ)' },
  SAR: { rate: 3.75, symbol: 'SAR ', label: 'SAR (﷼)' },
  MYR: { rate: 4.45, symbol: 'RM ', label: 'MYR (RM)' },
};

// Base Commodity prices in USD
export const BASE_COMMODITY_PRICES = {
  goldPricePerGramUSD: 85.40, // 24 Karat USD/gram
  silverPricePerGramUSD: 1.05, // Fine Silver USD/gram
  goldNisabGrams: 87.48, // 7.5 Tola = 87.48g
  silverNisabGrams: 612.36, // 52.5 Tola = 612.36g
};

export function convertFromUSD(amountUSD: number, targetCurrency: CurrencyCode): number {
  const rate = CURRENCY_RATES[targetCurrency]?.rate || 1.0;
  return amountUSD * rate;
}

export function convertToUSD(amountInTarget: number, currentCurrency: CurrencyCode): number {
  const rate = CURRENCY_RATES[currentCurrency]?.rate || 1.0;
  return amountInTarget / rate;
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const meta = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);

  return `${meta.symbol}${formatted}`;
}

export function getNisabValue(standard: 'gold' | 'silver', currency: CurrencyCode): number {
  const goldNisabUSD = BASE_COMMODITY_PRICES.goldPricePerGramUSD * BASE_COMMODITY_PRICES.goldNisabGrams;
  const silverNisabUSD = BASE_COMMODITY_PRICES.silverPricePerGramUSD * BASE_COMMODITY_PRICES.silverNisabGrams;
  const baseValue = standard === 'gold' ? goldNisabUSD : silverNisabUSD;
  return convertFromUSD(baseValue, currency);
}
