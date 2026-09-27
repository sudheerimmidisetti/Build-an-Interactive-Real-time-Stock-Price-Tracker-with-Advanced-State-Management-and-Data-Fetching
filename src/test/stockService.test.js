import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchHistoricalData, fetchStockQuote } from '../api/stockService'

describe('stockService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('fetchStockQuote', () => {
    it('normalizes valid Alpha Vantage GLOBAL_QUOTE response', async () => {
      const mockRawQuote = {
        'Global Quote': {
          '01. symbol': 'AAPL',
          '05. price': '175.5000',
          '08. previous close': '173.0000',
          '09. change': '2.5000',
          '10. change percent': '1.4451%',
        },
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRawQuote,
      })

      const quote = await fetchStockQuote('AAPL')

      expect(quote).toEqual({
        symbol: 'AAPL',
        price: 175.5,
        change: 2.5,
        changePercent: '1.4451',
        previousClose: 173.0,
      })
    })

    it('throws network error if HTTP status is not ok', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(fetchStockQuote('AAPL')).rejects.toThrow(
        /network error: 500 internal server error/i
      )
    })

    it('throws error when Alpha Vantage returns Note/Information rate limit', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          Note: 'Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute.',
        }),
      })

      await expect(fetchStockQuote('AAPL')).rejects.toThrow(
        /thank you for using alpha vantage|call frequency/i
      )
    })

    it('throws error when Alpha Vantage returns Error Message for invalid symbol', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          'Error Message': 'Invalid API call. Please check your parameters.',
        }),
      })

      await expect(fetchStockQuote('INVALID')).rejects.toThrow(/invalid api call/i)
    })

    it('throws error when quote object has missing price', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          'Global Quote': {},
        }),
      })

      await expect(fetchStockQuote('EMPTY')).rejects.toThrow(
        /no quote data found for symbol "empty"/i
      )
    })
  })

  describe('fetchHistoricalData', () => {
    it('normalizes and sorts TIME_SERIES_DAILY ascending by date', async () => {
      const mockRawData = {
        'Time Series (Daily)': {
          '2026-09-22': { '4. close': '155.00' },
          '2026-09-20': { '4. close': '150.00' },
          '2026-09-21': { '4. close': '152.50' },
        },
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRawData,
      })

      const history = await fetchHistoricalData('AAPL')

      expect(history).toEqual([
        { date: '2026-09-20', price: 150.0 },
        { date: '2026-09-21', price: 152.5 },
        { date: '2026-09-22', price: 155.0 },
      ])
    })

    it('throws error when historical time series data is missing', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      await expect(fetchHistoricalData('AAPL')).rejects.toThrow(
        /no historical data found for symbol "aapl"/i
      )
    })
  })
})
