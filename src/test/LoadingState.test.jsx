import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LoadingState from '../components/LoadingState'

describe('LoadingState', () => {
  it('renders default loading message and role status', () => {
    render(<LoadingState />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders custom loading message when passed as prop', () => {
    render(<LoadingState message="Fetching live stock prices..." />)
    expect(screen.getByText('Fetching live stock prices...')).toBeInTheDocument()
  })
})
