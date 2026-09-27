# Stock Price Tracker

An interactive real-time stock tracker web application that monitors popular stocks, provides live price updates through smart polling, and visualizes historical price movements with an accessible line chart.

---

## Overview

Stock Price Tracker allows users to monitor market activity for popular equities, inspect up-to-date quote figures (current price, price change, percentage change, and previous close), search for any valid US ticker, and examine chronological price trends. The application is built with a strong focus on clean architecture, strict state separation, responsive design, and accessibility standards.

---

## Features

- **Popular Stock List**: Quick-select popular equities with live price quotes and directional change indicators.
- **Search & Validation**: Search any stock symbol (1–5 letters) with automatic lowercase-to-uppercase formatting, character sanitization, and empty state handling.
- **Detailed Stock Metrics**: High-contrast price displays, change amounts, percentages, and previous closing figures.
- **Real-Time Polling**: Automatic 10-second polling for active quotes powered by TanStack React Query.
- **Interactive Historical Chart**: Recharts line chart illustrating historical closing prices with custom tooltips.
- **Global UI State via Zustand**: Clean, lightweight management of selected stock and dark/light theme preferences.
- **Server State via React Query**: Dedicated cache ownership, automated background refetching, and request deduplication.
- **Responsive Layout**: Tailored responsive layouts tested for Mobile (375px), Tablet (768px), and Desktop (1280px).
- **Accessibility (WCAG AA)**: Semantic HTML landmarks, keyboard tab order, skip-to-content link, `aria-live` status messages, accessible data tables for charts, and contrast compliance.
- **Automated Tests**: Unit and integration test suite with >90% code coverage using Vitest and React Testing Library.
- **Production Docker**: Multi-stage Node + Nginx Docker containerization.

---

## Tech Stack

- **Framework**: React 19 + Vite
- **Language**: JavaScript (ES modules)
- **Server State & Data Fetching**: TanStack React Query (v5)
- **Client State**: Zustand (v5)
- **Data Visualization**: Recharts (v3)
- **Testing**: Vitest, React Testing Library, jest-dom, v8 coverage
- **Styling**: Vanilla CSS with design tokens and dark mode support
- **Containerization**: Docker, Docker Compose, Nginx Alpine

---

## Architecture

The application enforces a strict separation of concerns across four layers:

```
[ UI Components ]
  ├── Reads UI state from Zustand
  ├── Reads server state from React Query hooks
  └── Dispatches user actions (selection, theme, search)
          │                                  │
          ▼                                  ▼
[ Zustand UI Store ]             [ React Query Hooks ]
  ├── selectedStockSymbol          ├── useStockQuote(symbol)
  └── theme (light / dark)         └── useHistoricalData(symbol)
                                             │
                                             ▼
                                  [ Stock API Service ]
                                    ├── fetchStockQuote(symbol)
                                    └── fetchHistoricalData(symbol)
                                             │
                                             ▼
                                  [ Alpha Vantage API ]
```

1. **Zustand (`uiStore.js`)**: Exclusively handles client-side UI preferences (selected ticker symbol and dark/light theme). Does not duplicate server data or request loading/error states.
2. **React Query (`useStockQuote`, `useHistoricalData`)**: Exclusively owns server state, caching, background polling (every 10s for active quotes), stale-time controls, and error states.
3. **API Service (`stockService.js`)**: Pure fetch layer outside React. Handles URL construction, raw Alpha Vantage response validation, rate-limit note detection, error normalization, and sorting.
4. **Components (`src/components/`)**: Modular presentation components structured with semantic HTML5 elements.

---

## Project Structure

```text
Build an Interactive Real-time Stock Price Tracker with Advanced State Management and Data Fetching   └── favicon.svg
├── screenshots/
│   ├── desktop.png
│   ├── mobile.png
│   └── tablet.png
├── src/
│   ├── api/
│   │   ├── queryClient.js
│   │   └── stockService.js
│   ├── components/
│   │   ├── ErrorState.css
│   │   ├── ErrorState.jsx
│   │   ├── Header.css
│   │   ├── Header.jsx
│   │   ├── LoadingState.css
│   │   ├── LoadingState.jsx
│   │   ├── PriceChart.css
│   │   ├── PriceChart.jsx
│   │   ├── SearchBar.css
│   │   ├── SearchBar.jsx
│   │   ├── StockCard.css
│   │   ├── StockCard.jsx
│   │   ├── StockDetails.css
│   │   ├── StockDetails.jsx
│   │   ├── StockList.css
│   │   └── StockList.jsx
│   ├── hooks/
│   │   ├── useHistoricalData.js
│   │   └── useStockQuote.js
│   ├── pages/
│   │   ├── Dashboard.css
│   │   └── Dashboard.jsx
│   ├── stores/
│   │   └── uiStore.js
│   ├── test/
│   │   ├── App.test.jsx
│   │   ├── Dashboard.test.jsx
│   │   ├── LoadingState.test.jsx
│   │   ├── PriceChart.test.jsx
│   │   ├── SearchBar.test.jsx
│   │   ├── setup.js
│   │   ├── StockCard.test.jsx
│   │   ├── StockDetails.test.jsx
│   │   ├── stockService.test.js
│   │   ├── test-utils.jsx
│   │   └── uiStore.test.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .dockerignore
├── .env.example
├── .gitignore
├── .oxlintrc.json
├── docker-compose.yml
├── Dockerfile
├── index.html
├── nginx.conf
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

---

## Environment Variables

The project uses the Alpha Vantage API to retrieve stock market quotes and historical time-series data.

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Define your API key in `.env`:

```env
VITE_STOCK_API_KEY=your_alpha_vantage_api_key_here
```

> **Note**: Obtain a free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key). Never commit your `.env` file to version control.

---

## Local Setup

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### Installation & Development

```bash
# 1. Clone repository and navigate to folder
cd "Data Fetching"

# 2. Install dependencies
npm install

# 3. Create .env file with your API key
cp .env.example .env

# 4. Start local Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Docker Setup

The application is containerized using a multi-stage Docker build:
1. **Builder stage**: Compiles production bundles via `node:20-alpine`.
2. **Runner stage**: Serves static artifacts with `nginx:alpine` on ports 80 and 8080.

### Running with Docker Compose

```bash
# Build and run container
docker compose up --build

# Run in detached background mode
docker compose up -d --build

# Stop the container
docker compose down
```

Open [http://localhost](http://localhost) or [http://localhost:8080](http://localhost:8080) in your browser.

---

## Testing

The test suite covers Zustand state mutations, API service normalization, input validation, component states (loading, success, error, empty), and full integration flow with network mocking.

```bash
# Run complete test suite
npm test

# Run tests with code coverage report
npm run test:coverage

# Run linter
npm run lint
```

Current test suite status:
- **Test Files**: 9 passed
- **Tests**: 39 passed (100%)
- **Code Coverage**: >90% across statements, lines, and functions

---

## API Rate Limits

The free tier of Alpha Vantage limits requests to **25 requests per day** and **5 requests per minute**.

To manage this within the application:
- **Historical Data**: Cached with a 15-minute `staleTime` and 30-minute `gcTime` so navigation between stocks avoids duplicate queries.
- **Stock Quotes**: Polled every 10 seconds only for the active symbol and list items, with query deduplication.
- **Error Handling**: Friendly alerts intercept Alpha Vantage's `Note` and `Information` rate-limit responses with a direct "Try again" action.

---

## Accessibility

- **Keyboard Navigation**: Complete tab sequence across all interactive controls with visible focus rings (`:focus-visible`).
- **Skip Link**: An accessible **"Skip to main content"** link allows keyboard users to bypass navigation.
- **Screen Reader Announcements**: Dynamic `aria-live="polite"` on filter updates and loading indicators; `aria-live="assertive"` on search validation errors.
- **Accessible Visualizations**: Recharts SVG elements are marked `aria-hidden="true"`, accompanied by an accessible statistical summary and semantic fallback data table.
- **Semantic Structure**: Proper heading hierarchy (`<h1>` -> `<h2>`), semantic definition lists (`<dl>`, `<dt>`, `<dd>`), and standard buttons (`<button type="button">`).

---
