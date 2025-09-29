// Currency utility functions

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$'
};

export const CURRENCY_NAMES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  INR: 'Indian Rupee',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar'
};

/**
 * Format salary with appropriate currency symbol
 * @param {number} salary - The salary amount
 * @param {string} currency - The currency code (USD, EUR, GBP, INR, CAD, AUD)
 * @param {string} period - The period (year, month, hour)
 * @returns {string} Formatted salary string
 */
export const formatSalary = (salary, currency = 'USD', period = 'year') => {
  if (!salary || salary === 0) return 'Not specified';
  
  const symbol = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.USD;
  const formattedAmount = salary.toLocaleString();
  
  return `${symbol}${formattedAmount}/${period}`;
};

/**
 * Format salary range with appropriate currency symbol
 * @param {number} minSalary - The minimum salary amount
 * @param {number} maxSalary - The maximum salary amount
 * @param {string} currency - The currency code
 * @param {string} period - The period (year, month, hour)
 * @returns {string} Formatted salary range string
 */
export const formatSalaryRange = (minSalary, maxSalary, currency = 'USD', period = 'year') => {
  if (!minSalary && !maxSalary) return 'Not specified';
  
  const symbol = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.USD;
  
  if (minSalary && maxSalary) {
    return `${symbol}${minSalary.toLocaleString()} - ${symbol}${maxSalary.toLocaleString()}/${period}`;
  } else if (minSalary) {
    return `${symbol}${minSalary.toLocaleString()}+ /${period}`;
  } else {
    return `Up to ${symbol}${maxSalary.toLocaleString()}/${period}`;
  }
};

/**
 * Get currency symbol by currency code
 * @param {string} currency - The currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency) => {
  return CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.USD;
};

/**
 * Get currency name by currency code
 * @param {string} currency - The currency code
 * @returns {string} Currency name
 */
export const getCurrencyName = (currency) => {
  return CURRENCY_NAMES[currency] || CURRENCY_NAMES.USD;
};

/**
 * Convert salary for display purposes (handles large numbers)
 * @param {number} salary - The salary amount
 * @param {string} currency - The currency code
 * @returns {string} Formatted short salary string
 */
export const formatShortSalary = (salary, currency = 'USD') => {
  if (!salary || salary === 0) return 'Not specified';
  
  const symbol = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.USD;
  
  if (salary >= 10000000) { // 10M+
    return `${symbol}${(salary / 10000000).toFixed(1)}Cr`;
  } else if (salary >= 100000) { // 100K+
    return `${symbol}${(salary / 100000).toFixed(1)}L`;
  } else if (salary >= 1000) { // 1K+
    return `${symbol}${(salary / 1000).toFixed(1)}K`;
  }
  
  return `${symbol}${salary.toLocaleString()}`;
};