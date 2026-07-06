# Technology Stack

This document defines the official technology stack for OceanoHelper. All development should follow these standards to ensure consistency, maintainability, and performance.

---

# Core Technologies

## Frontend Framework

- React

Purpose:

- Build reusable user interfaces.
- Create modular and maintainable components.
- Develop interactive scientific dashboards.

---

## Build Tool

- Vite

Purpose:

- Fast development server.
- Hot Module Replacement (HMR).
- Optimized production builds.

---

## Programming Language

- JavaScript (ES Modules)

Guidelines:

- Use modern ECMAScript syntax.
- Prefer functional programming patterns.
- Avoid TypeScript unless the project officially migrates.

---

# UI & Styling

## Tailwind CSS

Official styling framework.

Guidelines:

- Utility-first approach.
- Responsive design.
- Consistent spacing and typography.
- Minimal custom CSS.
- Reusable UI components.

---

## Custom CSS

Only for:

- Leaflet customization.
- Plotly customization.
- Global styles.
- Animations.
- Scrollbars.
- Print styles.

---

# Icons

Preferred:

- Lucide React

Alternative:

- Heroicons

Avoid mixing multiple icon libraries.

---

# Mapping

## Leaflet

Official mapping library.

Responsibilities:

- Interactive maps.
- Markers.
- Polylines.
- GeoJSON layers.
- Tile layers.
- Layer controls.
- Popups.
- Tooltips.

Do not replace Leaflet without approval.

---

# Charts & Scientific Visualization

## Plotly.js

Official charting library.

Supported chart types:

- Line Chart
- Scatter Plot
- Time Series
- Wind Rose
- Histogram
- Heatmap
- Polar Chart
- Bar Chart

---

# Data Processing

## Papa Parse

Responsibilities:

- CSV parsing.
- Dynamic typing.
- Header detection.
- Large dataset support.

## SheetJS (xlsx)

Used for reading and parsing Microsoft Excel (.xlsx) files.

---

# Routing

## React Router

Responsibilities:

- Application routing.
- Nested routes.
- Page navigation.

---

# State Management

Current approach:

- React Hooks
- Context API (when necessary)

Avoid introducing Redux, MobX, Zustand, or other state management libraries unless explicitly approved.

---

# HTTP Client

Preferred:

- Fetch API

Optional:

- Axios

Keep API logic inside the `services/` directory.

Never fetch data directly inside presentation components.

---

# Data Formats

Supported:

- CSV
- JSON
- GeoJSON

Planned support:

- NetCDF
- GRIB
- Excel (.xlsx)

---

# External Data Sources

Potential providers include:

- NOAA
- BOM
- BMKG
- Open-Meteo

All external requests must be implemented through dedicated service modules.

---

# Project Structure

Preferred folders:

- assets/
- components/
- hooks/
- layouts/
- pages/
- services/
- utils/
- public/

Each folder should have a single responsibility.

---

# Code Quality

Development standards:

- ESLint
- Consistent formatting
- Modular architecture
- No duplicated logic
- No unused imports
- No dead code

---

# Performance

Always prioritize:

- Lazy loading
- Code splitting
- Memoization where appropriate
- Efficient rendering
- Minimal bundle size
- Reusable components

---

# Browser Support

Target browsers:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

Legacy browser support is not required.

---

# Development Environment

Recommended tools:

- Visual Studio Code
- Git
- GitHub
- GitHub Copilot

---

# Future Technologies

Possible future additions:

- NetCDF.js
- Turf.js
- Web Workers
- IndexedDB
- Progressive Web App (PWA)

New technologies should only be introduced when they provide a clear benefit to the project.

---

# Technology Principles

When implementing new features:

- Reuse existing technologies before adding new dependencies.
- Keep the stack lightweight.
- Prefer readability over complexity.
- Optimize only when necessary.
- Maintain consistency across the entire application.
