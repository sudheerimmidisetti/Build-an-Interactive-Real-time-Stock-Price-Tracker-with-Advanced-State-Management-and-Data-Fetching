import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import StockDetails from '../components/StockDetails'
import { useStockQuote } from '../hooks/useStockQuote'

vi.mock('../hooks/useStockQuote', () => ({
  useStockQuote: vi.fn(),
}))

describe('StockDetails', () => {
  const mockRefetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useStockQuote.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    })
  })

  it('renders empty message when no symbol is provided', () => {
    render(<StockDetails symbol="" />)
    expect(
      screen.getByText(/select a stock from the list/i)
    ).toBeInTheDocument()
  })

  it('renders skeleton loading state with aria-busy while fetching', () => {
    useStockQuote.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    })

    render(<StockDetails symbol="AAPL" />)

    const section = screen.getByLabelText(/loading stock details for aapl/i)
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText(/loading stock quote data for aapl/i)).toBeInTheDocument()
  })

  it('renders formatted stock details when data is successfully returned', () => {
    useStockQuote.mockReturnValue({
      data: {
        symbol: 'AAPL',
        price: 182.5,
        change: 3.25,
        changePercent: 1.81,
        previousClose: 179.25,
      },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    })

    render(<StockDetails symbol="AAPL" />)

    expect(screen.getByRole('heading', { name: 'AAPL', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('$182.50')).toBeInTheDocument()
    expect(screen.getByText('+1.81%')).toBeInTheDocument()
    expect(screen.getByText('$3.25')).toBeInTheDocument()
    expect(screen.getByText('$179.25')).toBeInTheDocument()
  })

  it('renders error state and triggers retry when button is clicked', () => {
    useStockQuote.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error: Failed to fetch'),
      refetch: mockRefetch,
    })

    render(<StockDetails symbol="AAPL" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByText(/unable to connect\. please check your internet connection\./i)
    ).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryBtn)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('renders empty quote state when data is not returned', () => {
    useStockQuote.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    })

    render(<StockDetails symbol="XYZ" />)

    expect(
      screen.getByText(/no quote data available for xyz/i)
    ).toBeInTheDocument()
    const retryBtn = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryBtn)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })
})
