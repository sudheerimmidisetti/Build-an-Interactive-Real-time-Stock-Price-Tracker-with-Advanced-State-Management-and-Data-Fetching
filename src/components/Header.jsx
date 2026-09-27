import { useUiStore } from '../stores/uiStore'
import './Header.css'

function Header() {
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  return (
    <header className="header">
      <h1 className="header-title">
        <span className="header-icon" aria-hidden="true">📈</span>
        Stock Tracker
      </h1>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        type="button"
      >
        <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
      </button>
    </header>
  )
}

export default Header
