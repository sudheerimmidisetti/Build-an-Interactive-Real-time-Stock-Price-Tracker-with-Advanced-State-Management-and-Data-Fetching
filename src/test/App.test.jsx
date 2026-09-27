import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { useUiStore } from '../stores/uiStore'

vi.mock('../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard-mock">Dashboard Component</div>,
}))

describe('App', () => {
  it('renders Dashboard with current theme applied to root element', () => {
    act(() => {
      useUiStore.setState({ theme: 'light' })
    })
    const { container } = render(<App />)

    expect(screen.getByTestId('dashboard-mock')).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('data-theme', 'light')

    act(() => {
      useUiStore.getState().toggleTheme()
    })
    expect(container.firstChild).toHaveAttribute('data-theme', 'dark')
  })
})
