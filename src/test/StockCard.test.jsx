import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import StockCard from '../components/StockCard'
import { useStockQuote } from '../hooks/useStockQuote'

vi.mock('../hooks/useStockQuote', () => ({
  useStockQuote: vi.fn(),
}))

describe('StockCard', () => {
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading skeleton when quote is loading', () => {
    useStockQuote.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    render(
      <StockCard symbol="AAPL" isSelected={false} onSelect={mockOnSelect} />
    )

    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByText(/loading quote for aapl/i)).toBeInTheDocument()
  })

  it('renders symbol, price, and positive price change correctly', () => {
    useStockQuote.mockReturnValue({
      data: {
        symbol: 'AAPL',
        price: 150.25,
        change: 2.5,
        changePercent: 1.69,
        previousClose: 147.75,
      },
      isLoading: false,
      error: null,
    })

    render(
      <StockCard symbol="AAPL" isSelected={false} onSelect={mockOnSelect} />
    )

    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByText('$150.25')).toBeInTheDocument()
    expect(screen.getByText('+2.50')).toBeInTheDocument()
    expect(screen.getByText(/up/i)).toBeInTheDocument()
  })

  it('renders negative price change correctly', () => {
    useStockQuote.mockReturnValue({
      data: {
        symbol: 'TSLA',
        price: 210.0,
        change: -5.75,
        changePercent: -2.66,
        previousClose: 215.75,
      },
      isLoading: false,
      error: null,
    })

    render(
      <StockCard symbol="TSLA" isSelected={false} onSelect={mockOnSelect} />
    )

    expect(screen.getByText('TSLA')).toBeInTheDocument()
    expect(screen.getByText('$210.00')).toBeInTheDocument()
    expect(screen.getByText('-5.75')).toBeInTheDocument()
    expect(screen.getByText(/down/i)).toBeInTheDocument()
  })

  it('handles click and calls onSelect with symbol', () => {
    useStockQuote.mockReturnValue({
      data: {
        symbol: 'MSFT',
        price: 320.0,
        change: 1.0,
        changePercent: 0.31,
        previousClose: 319.0,
      },
      isLoading: false,
      error: null,
    })

    render(
      <StockCard symbol="MSFT" isSelected={false} onSelect={mockOnSelect} />
    )

    const button = screen.getByRole('button', { name: /msft/i })
    fireEvent.click(button)

    expect(mockOnSelect).toHaveBeenCalledTimes(1)
    expect(mockOnSelect).toHaveBeenCalledWith('MSFT')
  })

  it('reflects selected state via aria-pressed and active CSS class', () => {
    useStockQuote.mockReturnValue({
      data: {
        symbol: 'GOOGL',
        price: 135.0,
        change: 0.5,
        changePercent: 0.37,
        previousClose: 134.5,
      },
      isLoading: false,
      error: null,
    })

    const { rerender } = render(
      <StockCard symbol="GOOGL" isSelected={true} onSelect={mockOnSelect} />
    )

    const button = screen.getByRole('button', { name: /googl/i })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button.className).toContain('stock-card--active')

    rerender(
      <StockCard symbol="GOOGL" isSelected={false} onSelect={mockOnSelect} />
    )
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button.className).not.toContain('stock-card--active')
  })
})
