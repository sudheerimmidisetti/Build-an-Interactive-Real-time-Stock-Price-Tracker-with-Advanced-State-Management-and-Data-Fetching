import './ErrorState.css'

function ErrorState({ message = 'Something went wrong.', onRetry }) {
  const userMessage = formatErrorMessage(message)

  return (
    <div className="error-state" role="alert">
      <span className="error-icon" aria-hidden="true">⚠</span>
      <div className="error-content">
        <p className="error-message">{userMessage}</p>
        {onRetry && (
          <button className="error-retry" onClick={onRetry} type="button">
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

function formatErrorMessage(message) {
  if (message.includes('rate limit') || message.includes('Thank you for using')) {
    return 'API rate limit reached. Please wait a moment and try again.'
  }
  if (message.includes('Network error') || message.includes('Failed to fetch')) {
    return 'Unable to connect. Please check your internet connection.'
  }
  if (message.includes('No quote data') || message.includes('No historical data')) {
    return 'No data found for this symbol. Please check the ticker and try again.'
  }
  return message
}

export default ErrorState
