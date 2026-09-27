import { useStockQuote } from '../hooks/useStockQuote'
import ErrorState from './ErrorState'
import './StockDetails.css'

function StockDetails({ symbol }) {
  const { data: quote, isLoading, error, refetch } = useStockQuote(symbol)

  if (!symbol) {
    return (
      <div className="stock-details stock-details--empty" role="status">
        <p className="stock-details-empty-text">Select a stock from the list to view live details.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <section
        className="stock-details stock-details--skeleton"
        aria-busy="true"
        aria-label={`Loading stock details for ${symbol}`}
      >
        <p className="sr-only" role="status">Loading stock quote data for {symbol}...</p>
        <div className="stock-details-header">
          <div className="skeleton skeleton-title" aria-hidden="true" />
          <div className="skeleton skeleton-badge" aria-hidden="true" />
        </div>
        <div className="skeleton skeleton-price" aria-hidden="true" />
        <div className="stock-details-grid">
          <div className="skeleton skeleton-card" aria-hidden="true" />
          <div className="skeleton skeleton-card" aria-hidden="true" />
          <div className="skeleton skeleton-card" aria-hidden="true" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <div className="stock-details">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="stock-details stock-details--empty" role="status">
        <p className="stock-details-empty-text">No quote data available for {symbol}.</p>
        <button type="button" className="error-retry" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  const isPositive = quote.change >= 0

  return (
    <section className="stock-details" aria-labelledby="stock-details-heading">
      <div className="stock-details-header">
        <h2 id="stock-details-heading" className="stock-details-symbol">
          {quote.symbol}
        </h2>
        <span className={`stock-details-badge ${isPositive ? 'positive' : 'negative'}`}>
          <span className="badge-icon" aria-hidden="true">{isPositive ? '▲' : '▼'}</span>
          <span className="sr-only">{isPositive ? 'up' : 'down'}</span>
          <span>{isPositive ? '+' : ''}{quote.changePercent}%</span>
        </span>
      </div>
      <p className="stock-details-price">
        <span className="sr-only">Current price: </span>
        ${quote.price.toFixed(2)}
      </p>
      <dl className="stock-details-grid">
        <div className="stock-details-item">
          <dt id="stat-change">Change</dt>
          <dd aria-labelledby="stat-change" className={isPositive ? 'positive' : 'negative'}>
            <span aria-hidden="true">{isPositive ? '▲ +' : '▼ '}</span>
            <span className="sr-only">{isPositive ? 'positive change of ' : 'negative change of '}</span>
            ${Math.abs(quote.change).toFixed(2)}
          </dd>
        </div>
        <div className="stock-details-item">
          <dt id="stat-change-percent">Change %</dt>
          <dd aria-labelledby="stat-change-percent" className={isPositive ? 'positive' : 'negative'}>
            <span aria-hidden="true">{isPositive ? '+' : ''}</span>
            <span className="sr-only">{isPositive ? 'plus ' : 'minus '}</span>
            {quote.changePercent}%
          </dd>
        </div>
        <div className="stock-details-item">
          <dt id="stat-prev-close">Previous Close</dt>
          <dd aria-labelledby="stat-prev-close" className="neutral">
            ${quote.previousClose.toFixed(2)}
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default StockDetails
