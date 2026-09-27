import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SearchBar from '../components/SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input and search button', () => {
    render(<SearchBar onSearch={mockOnSearch} />)

    expect(
      screen.getByPlaceholderText(/search symbol \(e\.g\. msft\)/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('accepts valid input and automatically converts lowercase to uppercase', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByPlaceholderText(/search symbol/i)

    fireEvent.change(input, { target: { value: 'nvda' } })
    expect(input.value).toBe('NVDA')
  })

  it('filters out non-alphabetic characters and enforces max length of 5', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByPlaceholderText(/search symbol/i)

    fireEvent.change(input, { target: { value: 'a1b!c@d#e$f%' } })
    expect(input.value).toBe('ABCDE')
  })

  it('handles empty input submission and displays validation error', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const button = screen.getByRole('button', { name: /search/i })

    fireEvent.click(button)

    expect(
      screen.getByText(/please enter a stock symbol/i)
    ).toBeInTheDocument()
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('calls onSearch with trimmed uppercase symbol and clears input on valid submit', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByPlaceholderText(/search symbol/i)
    const button = screen.getByRole('button', { name: /search/i })

    fireEvent.change(input, { target: { value: 'msft' } })
    fireEvent.click(button)

    expect(mockOnSearch).toHaveBeenCalledTimes(1)
    expect(mockOnSearch).toHaveBeenCalledWith('MSFT')
    expect(input.value).toBe('')
  })

  it('clears validation error when user begins typing again', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByPlaceholderText(/search symbol/i)
    const button = screen.getByRole('button', { name: /search/i })

    // Trigger error
    fireEvent.click(button)
    expect(
      screen.getByText(/please enter a stock symbol/i)
    ).toBeInTheDocument()

    // Type to clear
    fireEvent.change(input, { target: { value: 'a' } })
    expect(
      screen.queryByText(/please enter a stock symbol/i)
    ).not.toBeInTheDocument()
  })
})
