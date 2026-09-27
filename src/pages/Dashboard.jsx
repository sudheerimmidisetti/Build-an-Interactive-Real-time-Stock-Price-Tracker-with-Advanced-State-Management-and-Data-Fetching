import { useUiStore } from '../stores/uiStore'
import Header from '../components/Header'
import StockList from '../components/StockList'
import StockDetails from '../components/StockDetails'
import PriceChart from '../components/PriceChart'
import './Dashboard.css'

function Dashboard() {
  const selectedStockSymbol = useUiStore((state) => state.selectedStockSymbol)

  return (
    <div className="dashboard">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <div className="dashboard-body">
        <StockList />
        <main id="main-content" className="dashboard-main" tabIndex="-1">
          <StockDetails symbol={selectedStockSymbol} />
          <PriceChart symbol={selectedStockSymbol} />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
