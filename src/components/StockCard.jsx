import { useStockQuote } from '../hooks/useStockQuote'
import './StockCard.css'

function StockCard({ symbol, isSelected, onSelect }) {
  const { data: quote, isLoading } = useStockQuote(symbol)

  const changeValue = quote?.change ?? 0
  const isPositive = changeValue >= 0

  return (
    <button
      className={`stock-card ${isSelected ? 'stock-card--active' : ''}`}
      onClick={() => onSelect(symbol)}
      aria-pressed={isSelected}
      type="button"
    >
      <div className="stock-card-left">
        <span className="stock-card-symbol">{symbol}</span>
      </div>
      {isLoading ? (
        <div className="stock-card-loading">
          <span className="stock-card-skeleton skeleton" aria-hidden="true" />
          <span className="sr-only">Loading quote for {symbol}</span>
        </div>
      ) : quote ? (
        <div className="stock-card-data">
          <span className="stock-card-price">${quote.price.toFixed(2)}</span>
          <span className={`stock-card-change ${isPositive ? 'positive' : 'negative'}`}>
            <span className="change-icon" aria-hidden="true">
              {isPositive ? '▲' : '▼'}
            </span>
            <span className="sr-only">{isPositive ? 'up' : 'down'}</span>
            <span>{isPositive ? '+' : ''}{changeValue.toFixed(2)}</span>
          </span>
        </div>
      ) : (
        <span className="stock-card-unavailable">
          <span className="sr-only">Quote data unavailable</span>
          <span aria-hidden="true">N/A</span>
        </span>
      )}
    </button>
  )
}

export default StockCard
