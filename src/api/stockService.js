const API_KEY = import.meta.env.VITE_STOCK_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

function buildUrl(params) {
  const url = new URL(BASE_URL);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function validateApiResponse(data) {
  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }

  if (data['Note'] || data['Information']) {
    throw new Error(
      data['Note'] || data['Information'] || 'API rate limit reached. Please try again later.'
    );
  }
}

export async function fetchStockQuote(symbol) {
  const url = buildUrl({
    function: 'GLOBAL_QUOTE',
    symbol,
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  validateApiResponse(data);

  const quote = data['Global Quote'];

  if (!quote || !quote['05. price']) {
    throw new Error(`No quote data found for symbol "${symbol}"`);
  }

  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: quote['10. change percent']?.replace('%', ''),
    previousClose: parseFloat(quote['08. previous close']),
  };
}

export async function fetchHistoricalData(symbol) {
  const url = buildUrl({
    function: 'TIME_SERIES_DAILY',
    symbol,
    outputsize: 'compact',
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  validateApiResponse(data);

  const timeSeries = data['Time Series (Daily)'];

  if (!timeSeries) {
    throw new Error(`No historical data found for symbol "${symbol}"`);
  }

  return Object.entries(timeSeries)
    .map(([date, values]) => ({
      date,
      price: parseFloat(values['4. close']),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}
