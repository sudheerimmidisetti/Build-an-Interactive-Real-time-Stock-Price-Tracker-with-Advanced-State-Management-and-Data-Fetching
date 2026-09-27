import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Dashboard from '../pages/Dashboard'
import { useUiStore } from '../stores/uiStore'
import { renderWithClient } from './test-utils'

vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts')
  return {
    ...original,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="dashboard-chart">{children}</div>
    ),
  }
})

// Mock API service so real network is never hit during tests
vi.mock('../api/stockService', () => ({
  fetchStockQuote: vi.fn((symbol) =>
    Promise.resolve({
      symbol,
      price: 150.0,
      change: 2.0,
      changePercent: '1.35',
      previousClose: 148.0,
    })
  ),
  fetchHistoricalData: vi.fn(() =>
    Promise.resolve([
      { date: '2026-09-20', price: 148.0 },
      { date: '2026-09-21', price: 150.0 },
    ])
  ),
}))

describe('Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useUiStore.setState({
      selectedStockSymbol: 'AAPL',
      theme: 'light',
    })
  })

  it('renders application header, skip link, search bar, stock list, and main content', async () => {
    renderWithClient(<Dashboard />)

    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stock tracker/i, level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
    expect(screen.getByRole('search', { name: /stock search/i })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: /popular stocks/i })).toBeInTheDocument()

    // Default stock card AAPL is rendered and pressed
    const aaplButton = screen.getByRole('button', { name: /aapl/i })
    expect(aaplButton).toBeInTheDocument()
    expect(aaplButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('allows selecting a different stock from the list and updates store state', async () => {
    renderWithClient(<Dashboard />)

    const msftButton = screen.getByRole('button', { name: /msft/i })
    fireEvent.click(msftButton)

    expect(useUiStore.getState().selectedStockSymbol).toBe('MSFT')
    expect(msftButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('allows toggling theme between light and dark from the header', () => {
    renderWithClient(<Dashboard />)

    const themeBtn = screen.getByRole('button', { name: /switch to dark mode/i })
    fireEvent.click(themeBtn)

    expect(useUiStore.getState().theme).toBe('dark')
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
  })

  it('searches for a custom ticker and updates selected stock', async () => {
    renderWithClient(<Dashboard />)

    const searchInput = screen.getByPlaceholderText(/search symbol/i)
    const searchBtn = screen.getByRole('button', { name: /search/i })

    fireEvent.change(searchInput, { target: { value: 'intc' } })
    fireEvent.click(searchBtn)

    expect(useUiStore.getState().selectedStockSymbol).toBe('INTC')
  })

  it('displays empty state and allows resetting when search has no popular matches', async () => {
    renderWithClient(<Dashboard />)

    const searchInput = screen.getByPlaceholderText(/search symbol/i)
    const searchBtn = screen.getByRole('button', { name: /search/i })

    fireEvent.change(searchInput, { target: { value: 'xyz' } })
    fireEvent.click(searchBtn)

    expect(
      screen.getByText(/no popular stocks match "xyz"/i)
    ).toBeInTheDocument()

    const showAllBtn = screen.getByRole('button', { name: /show all popular stocks/i })
    fireEvent.click(showAllBtn)

    expect(screen.getByRole('list', { name: /popular stocks/i })).toBeInTheDocument()
  })
})
