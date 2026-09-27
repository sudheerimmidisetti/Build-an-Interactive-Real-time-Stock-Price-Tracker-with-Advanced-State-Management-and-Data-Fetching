import { useUiStore } from './stores/uiStore'
import Dashboard from './pages/Dashboard'

function App() {
  const theme = useUiStore((state) => state.theme)

  return (
    <div className="app" data-theme={theme}>
      <Dashboard />
    </div>
  )
}

export default App
