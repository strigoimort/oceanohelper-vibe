# Architecture

This document defines the overall architecture of OceanoHelper. All new features and modules must follow this structure to ensure consistency, scalability, and maintainability.

---

# Architecture Principles

The architecture is designed around the following principles:

- Modular
- Reusable
- Scalable
- Maintainable
- Separation of Concerns

Every file and folder should have a single, well-defined responsibility.

---

# High-Level Architecture

```text
User
    │
    ▼
React Pages
    │
    ▼
Components
    │
    ▼
Hooks
    │
    ▼
Services
    │
    ▼
External APIs / CSV / JSON
```

Business logic should never be tightly coupled with presentation components.

---

# Recommended Project Structure

```text
src/
│
├── assets/          # Images, icons, fonts, static assets
├── components/      # Reusable UI components
├── hooks/           # Custom React Hooks
├── layouts/         # Shared application layouts
├── pages/           # Feature pages
├── services/        # API and data services
├── utils/           # Helper functions
├── data/            # Static datasets
├── constants/       # Application constants
├── styles/          # Global styles
└── main.jsx
```

Each directory should have a single responsibility.

---

# Layer Responsibilities

## Pages

Responsibilities:

- Route entry points.
- Organize page layout.
- Compose components.

Pages should contain minimal business logic.

---

## Components

Responsibilities:

- Display data.
- Receive props.
- Emit events.
- Be reusable.

Components should not fetch data directly.

---

## Hooks

Responsibilities:

- State management.
- Data fetching.
- Reusable business logic.
- Encapsulate complex behaviors.

Examples:

- useMap()
- useTracer()
- useWaveAnalysis()

---

## Services

Responsibilities:

- API requests.
- CSV loading.
- Data parsing.
- Data transformation.

Services should be the only layer that communicates with external data sources.

---

## Utils

Responsibilities:

- Pure utility functions.
- Mathematical calculations.
- Date formatting.
- Unit conversions.
- Coordinate calculations.

Utility functions should be stateless.

---

## Constants

Responsibilities:

- Color palettes.
- Configuration values.
- Default settings.
- Enumeration values.

Avoid hardcoding repeated values.

---

# Data Flow

Preferred flow:

```text
CSV / API
      │
      ▼
 Services
      │
      ▼
   Hooks
      │
      ▼
 React State
      │
      ▼
 Components
      │
      ▼
     UI
```

Every feature should follow this pattern.

---

# Component Philosophy

Prefer many small components instead of a few very large ones.

Example:

```text
Dashboard
│
├── Sidebar
├── Navbar
├── ToolPanel
├── MapContainer
├── ChartContainer
└── Footer
```

Each component should have a single responsibility.

---

# Feature Organization

Each core tool should be implemented independently while sharing common UI components and utilities.

Current tools:

- Geospatial Workspace
- Particle Tracer
- Wind Rose
- Wave Analysis
- Tidal Analysis
- Climatology

Avoid coupling one tool's logic to another unless the functionality is intentionally shared.

---

# Reusability

Prefer shared components for:

- Buttons
- Cards
- Dialogs
- Modals
- Tables
- Charts
- Inputs
- Filters

Avoid duplicating UI across tools.

---

# API Architecture

All external requests must go through the `services/` directory.

Example:

```text
pages
    │
components
    │
hooks
    │
services
    │
NOAA / BMKG / Open-Meteo
```

Never call external APIs directly inside pages or components.

---

# State Management

Preferred order:

1. Local State (`useState`)
2. Custom Hooks
3. Context API (when shared state is required)

Avoid introducing additional state management libraries unless approved.

---

# File Organization

Keep files focused.

Avoid files exceeding several hundred lines when practical. Split large components into smaller modules.

---

# Error Handling

All services should:

- Validate inputs.
- Handle network errors.
- Return meaningful error messages.
- Avoid crashing the UI.

Display user-friendly feedback when failures occur.

---

# Performance Guidelines

Prioritize:

- Lazy loading
- Code splitting
- Memoization (`useMemo`, `useCallback`) where appropriate
- Efficient rendering
- Minimal unnecessary re-renders

Optimize only when there is a measurable benefit.

---

# Extensibility

The architecture should support adding new tools or data sources with minimal impact on existing modules.

New features should integrate into the existing structure rather than introducing parallel architectures.

---

# Architecture Rules

Always:

- Separate UI from business logic.
- Reuse existing components.
- Keep modules independent.
- Write modular code.
- Follow the established folder structure.

Never:

- Fetch data directly in presentation components.
- Duplicate business logic.
- Mix unrelated responsibilities in a single file.
- Change the project structure without approval.
