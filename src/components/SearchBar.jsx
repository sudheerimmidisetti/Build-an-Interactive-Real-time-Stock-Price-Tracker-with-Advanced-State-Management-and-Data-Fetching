import { useState } from 'react'
import './SearchBar.css'

const VALID_SYMBOL_PATTERN = /^[A-Z]{1,5}$/

function SearchBar({ onSearch }) {
  const [input, setInput] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleInputChange = (e) => {
    const sanitized = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 5)
    setInput(sanitized.toUpperCase())
    if (validationError) {
      setValidationError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = input.trim().toUpperCase()

    if (!trimmed) {
      setValidationError('Please enter a stock symbol.')
      return
    }

    if (!VALID_SYMBOL_PATTERN.test(trimmed)) {
      setValidationError('Symbol must be 1–5 letters (e.g. AAPL).')
      return
    }

    setValidationError('')
    onSearch(trimmed)
    setInput('')
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search" aria-label="Stock search">
      <label htmlFor="stock-search" className="sr-only">
        Search stock symbol
      </label>
      <div className="search-input-wrapper">
        <input
          id="stock-search"
          name="stockSymbol"
          className="search-input"
          type="search"
          placeholder="Search symbol (e.g. MSFT)"
          value={input}
          onChange={handleInputChange}
          aria-describedby={validationError ? 'search-error' : undefined}
          aria-invalid={validationError ? 'true' : 'false'}
          maxLength={5}
          autoComplete="off"
          spellCheck="false"
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </div>
      {validationError && (
        <p id="search-error" className="search-error" role="alert" aria-live="assertive">
          {validationError}
        </p>
      )}
    </form>
  )
}

export default SearchBar
