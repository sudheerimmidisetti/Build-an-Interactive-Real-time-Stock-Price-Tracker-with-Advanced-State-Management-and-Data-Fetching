import { create } from 'zustand'

export const useUiStore = create((set) => ({
  selectedStockSymbol: 'AAPL',
  theme: 'light',

  setSelectedStockSymbol: (symbol) => set({ selectedStockSymbol: symbol }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}))
