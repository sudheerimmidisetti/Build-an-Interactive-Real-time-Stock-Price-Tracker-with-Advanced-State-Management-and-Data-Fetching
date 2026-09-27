import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useHistoricalData } from '../hooks/useHistoricalData'
import ErrorState from './ErrorState'
import './PriceChart.css'

function PriceChart({ symbol }) {
  const { data: history, isLoading, error, refetch } = useHistoricalData(symbol)

  if (!symbol) return null

  if (isLoading) {
    return (
      <section
        className="price-chart"
        aria-busy="true"
        aria-labelledby="price-chart-heading"
      >
        <h2 id="price-chart-heading" className="price-chart-title">
          Price History ({symbol})
        </h2>
        <p className="sr-only" role="status">Loading historical price chart for {symbol}...</p>
        <div className="skeleton skeleton-chart" aria-hidden="true" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="price-chart" aria-labelledby="price-chart-heading">
        <h2 id="price-chart-heading" className="price-chart-title">
          Price History ({symbol})
        </h2>
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </section>
    )
  }

  if (!history || history.length === 0) {
    return (
      <section className="price-chart price-chart--empty" aria-labelledby="price-chart-heading">
        <h2 id="price-chart-heading" className="price-chart-title">
          Price History ({symbol})
        </h2>
        <div className="price-chart-empty-content" role="status">
          <p className="price-chart-empty-text">No historical price data available for {symbol}.</p>
          <button type="button" className="error-retry" onClick={() => refetch()}>
            Reload chart
          </button>
        </div>
      </section>
    )
  }

  const prices = history.map((item) => item.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const latestItem = history[history.length - 1]
  const earliestItem = history[0]

  return (
    <section className="price-chart" aria-labelledby="price-chart-heading">
      <h2 id="price-chart-heading" className="price-chart-title">
        Price History ({symbol})
      </h2>

      {/* Screen reader accessible chart data summary & table */}
      <div className="sr-only">
        <p>
          Historical closing price chart for {symbol} covering {history.length} trading days.
          Lowest closing price was ${minPrice.toFixed(2)}, highest was ${maxPrice.toFixed(2)},
          and the latest close was ${latestItem?.price?.toFixed(2)} on {earliestItem ? new Date(latestItem.date).toLocaleDateString() : ''}.
        </p>
        <table>
          <caption>Recent closing prices for {symbol}</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Closing Price</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(-10).map((item) => (
              <tr key={item.date}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual interactive SVG chart (hidden from screen reader DOM) */}
      <div className="price-chart-container" aria-hidden="true">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              tickFormatter={(date) => {
                const d = new Date(date)
                return `${d.getMonth() + 1}/${d.getDate()}`
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                color: 'var(--text-primary)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Close Price']}
              labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--accent)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: 'var(--accent)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default PriceChart
