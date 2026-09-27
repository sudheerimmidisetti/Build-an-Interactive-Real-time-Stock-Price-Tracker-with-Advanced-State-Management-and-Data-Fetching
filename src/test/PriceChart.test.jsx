import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PriceChart from '../components/PriceChart'
import { useHistoricalData } from '../hooks/useHistoricalData'

vi.mock('../hooks/useHistoricalData', () => ({
  useHistoricalData: vi.fn(),
}))

vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts')
  return {
    ...original,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  }
})

describe('PriceChart', () => {
  const mockRefetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useHistoricalData.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    })
  })

  it('returns null if symbol is not provided', () => {
    const { container } = render(<PriceChart symbol="" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders loading skeleton when historical data is loading', () => {
    useHistoricalData.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    })

    render(<PriceChart symbol="AAPL" />)

    expect(
      screen.getByRole('heading', { name: /price history \(aapl\)/i, level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/loading historical price chart for aapl/i)
    ).toBeInTheDocument()
  })

  it('renders chart and accessible table when historical data exists', () => {
    const mockData = [
      { date: '2026-09-20', price: 150.0 },
      { date: '2026-09-21', price: 155.5 },
      { date: '2026-09-22', price: 153.2 },
    ]

    useHistoricalData.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    })

    render(<PriceChart symbol="AAPL" />)

    expect(
      screen.getByRole('heading', { name: /price history \(aapl\)/i, level: 2 })
    ).toBeInTheDocument()
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()

    // Accessible table and summary check
    expect(
      screen.getByText(/lowest closing price was \$150\.00/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/highest was \$155\.50/i)
    ).toBeInTheDocument()
    expect(screen.getByText('$155.50')).toBeInTheDocument()
  })

  it('handles empty historical data with clear message and reload button', () => {
    useHistoricalData.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    })

    render(<PriceChart symbol="AAPL" />)

    expect(
      screen.getByText(/no historical price data available for aapl/i)
    ).toBeInTheDocument()

    const reloadBtn = screen.getByRole('button', { name: /reload chart/i })
    fireEvent.click(reloadBtn)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('renders error state and retry button on fetch error', () => {
    useHistoricalData.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Alpha Vantage rate limit reached'),
      refetch: mockRefetch,
    })

    render(<PriceChart symbol="AAPL" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByText(/api rate limit/i)
    ).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryBtn)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })
})
