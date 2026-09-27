import { useState } from 'react'
import { useUiStore } from '../stores/uiStore'
import SearchBar from './SearchBar'
import StockCard from './StockCard'
import './StockList.css'

const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX']

function StockList() {
  const selectedStockSymbol = useUiStore((state) => state.selectedStockSymbol)
  const setSelectedStockSymbol = useUiStore((state) => state.setSelectedStockSymbol)
  const [filter, setFilter] = useState('')

  const handleSearch = (symbol) => {
    setSelectedStockSymbol(symbol)
    setFilter(symbol)
  }

  const normalizedFilter = filter.trim().toUpperCase()
  const filteredStocks = normalizedFilter
    ? POPULAR_STOCKS.filter((s) => s.includes(normalizedFilter))
    : POPULAR_STOCKS

  return (
    <aside className="stock-list" aria-label="Stock selector">
      <SearchBar onSearch={handleSearch} />
      {filteredStocks.length > 0 ? (
        <ul className="stock-list-items" aria-label="Popular stocks">
          {filteredStocks.map((symbol) => (
            <li key={symbol} className="stock-list-item">
              <StockCard
                symbol={symbol}
                isSelected={symbol === selectedStockSymbol}
                onSelect={setSelectedStockSymbol}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="stock-list-empty" role="status" aria-live="polite">
          <p className="stock-list-empty-title">No popular stocks match &quot;{filter}&quot;</p>
          <p className="stock-list-empty-desc">
            Tracking details for <strong>{normalizedFilter}</strong> are displayed in the main section.
          </p>
          <button
            type="button"
            className="stock-list-clear-btn"
            onClick={() => setFilter('')}
          >
            Show all popular stocks
          </button>
        </div>
      )}
    </aside>
  )
}

export default StockList
