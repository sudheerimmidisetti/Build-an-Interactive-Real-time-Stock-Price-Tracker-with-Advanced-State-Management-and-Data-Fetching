import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from '../stores/uiStore'

describe('useUiStore', () => {
  beforeEach(() => {
    // Reset store to known initial state before each test
    useUiStore.setState({
      selectedStockSymbol: 'AAPL',
      theme: 'light',
    })
  })

  it('has default state with AAPL as selected stock and light theme', () => {
    const state = useUiStore.getState()
    expect(state.selectedStockSymbol).toBe('AAPL')
    expect(state.theme).toBe('light')
  })

  it('updates selected stock symbol via setSelectedStockSymbol', () => {
    useUiStore.getState().setSelectedStockSymbol('MSFT')
    expect(useUiStore.getState().selectedStockSymbol).toBe('MSFT')

    useUiStore.getState().setSelectedStockSymbol('GOOGL')
    expect(useUiStore.getState().selectedStockSymbol).toBe('GOOGL')
  })

  it('toggles theme between light and dark via toggleTheme', () => {
    expect(useUiStore.getState().theme).toBe('light')

    useUiStore.getState().toggleTheme()
    expect(useUiStore.getState().theme).toBe('dark')

    useUiStore.getState().toggleTheme()
    expect(useUiStore.getState().theme).toBe('light')
  })
})
