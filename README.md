# Weather 2.0

Weather 2.0 is a Vite-powered React application that lets you search for cities, explore current weather conditions, and review short–term forecasts powered by the [Open-Meteo](https://open-meteo.com/) and [OpenStreetMap](https://www.openstreetmap.org/) ecosystems. The UI focuses on fast interactions, debounced search, and clear presentation of temperature, precipitation, wind, and sunrise/sunset details.

## Table of Contents

- [Weather 2.0](#weather-20)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Available Scripts](#available-scripts)
  - [Testing](#testing)
  - [Architecture Notes](#architecture-notes)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)

## Features

- 🔍 **City search with debouncing** – Type a city name and receive suggestions after a short delay to reduce API calls.
- 🌦️ **Current weather snapshot** – Displays temperature, precipitation, and probability based on the selected location.
- 📅 **Accordion-style forecast** – Expandable panels reveal daily high/low temperatures, wind, precipitation totals, and sun times.
- ⚡ **Smart rate limiting** – Client-side guard ensures remote APIs are not queried too frequently.
- 📱 **Responsive layout** – Sass modules and BEM-inspired class names keep the interface flexible across devices.
- 💾 **Caching via React Query** – API responses are cached with sensible stale and garbage-collection windows for performance.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 7
- **Data Layer:** @tanstack/react-query 5
- **Styling:** Sass
- **Testing:** Vitest + Testing Library + JSDOM
- **Tooling:** ESLint (flat config)

## Project Structure

```
.
├── public/                     # Static assets served as-is
├── src/
│   ├── assets/                 # Static media referenced in components
│   ├── components/             # Presentational React components
│   │   ├── Accordion.tsx
│   │   ├── CitySearch.tsx
│   │   ├── CurrentWeather.tsx
│   │   └── Forecast/*.tsx
│   ├── hooks/                  # Custom hooks (e.g., weather data fetching)
│   │   └── useWeatherData.ts
│   ├── styles/                 # SCSS partials and component styles
│   ├── utils/                  # Helper utilities (date formatting, rate limiting)
│   ├── __tests__/              # Vitest unit/integration tests
│   └── test/                   # Shared test utilities & setup
├── eslint.config.js
├── vite.config.ts
├── tsconfig*.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** 18.18+ or 20+ (LTS recommended)
- **npm** 9+ (bundled with modern Node versions)
- API access to Open-Meteo and OpenStreetMap (see [Environment Variables](#environment-variables))

### Installation

```bash
git clone https://github.com/tamaskovacs0408/weather2.0.git
cd weather2.0
npm install
```

### Environment Variables

Create a `.env` file at the project root with the following entries:

```
VITE_OPENSTREETMAP_URL=https://nominatim.openstreetmap.org/search?q=
VITE_OPENSTREETMAP_USERAGENT=YourAppName/1.0 (contact@example.com)
VITE_OPENMETEO_URL=https://api.open-meteo.com/v1
```

> **Tip:** The OpenStreetMap API requires a descriptive user agent. Update the value to match your application name and contact information.

### Available Scripts

```bash
npm run dev        # Start Vite dev server with hot module replacement
npm run build      # Type-check and create production build in dist/
npm run preview    # Preview the production build locally
npm run lint       # Lint the project with ESLint
npm run test       # Run vitest in watch mode
npm run test:run   # Run the full vitest suite once (CI-friendly)
```

## Testing

The project uses **Vitest** with **Testing Library** and **jsdom** to exercise hooks, utilities, and UI components.

- `src/__tests__/rateLimitHelper.test.ts` – validates throttling logic.
- `src/__tests__/dateFormatHelper.test.ts` – ensures locale-aware time formatting.
- `src/__tests__/useWeatherData.test.tsx` – covers the data-fetching hooks with mocked fetch responses.
- `src/__tests__/CitySearch.test.tsx` – tests the autocomplete flow with mocked React Query results.

The shared testing setup lives in `src/test/setupTests.ts`, and custom render helpers reside in `src/test/test-utils.tsx`.

Generate coverage by running:

```bash
npm run test:run -- --coverage
```

Coverage reports (text summary and HTML) will be stored under `coverage/` when the optional flag is provided.

## Architecture Notes

- **React Query Caching:** Weather and geocoding requests are memoised using key-based caches. Each query defines `staleTime` and `gcTime` aligned with expected data freshness.
- **Rate Limiting:** `waitForRateLimit` guards sequential requests to respect OpenStreetMap usage policies.
- **Debounced Search:** `CitySearch` maintains both immediate and debounced state values, delaying API calls until typing settles.
- **Styling Strategy:** Component-specific SCSS files import shared variables and mixins, keeping design consistent without global leakage.

## Troubleshooting

- **Autocomplete never shows results:** Make sure your `.env` file uses a valid OpenStreetMap user agent and the API isn’t rate limited.
- **Tests fail with `fetch` undefined:** Node 18+ exposes `fetch` globally, but if running on an older runtime ensure polyfills or upgrade Node.
- **Build emits SVG warnings:** Vite warns when SVGs reference themselves; this is expected for some assets and safe to ignore.

## Contributing

1. Fork the repository and create a feature branch.
2. Install dependencies with `npm install`.
3. Add or update tests alongside your changes (`npm run test:run`).
4. Submit a pull request describing the enhancement or fix.

Feel free to open issues for enhancement ideas, bug reports, or documentation improvements.
