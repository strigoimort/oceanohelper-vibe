# API Specification

This document defines how OceanoHelper interacts with external data sources.

All API integrations must follow these standards to ensure consistency, reliability, and maintainability.

---

# API Principles

Every API integration should be:

- Reliable
- Modular
- Reusable
- Well documented
- Easy to maintain

Components must never communicate directly with external APIs.

All requests must go through the `services/` layer.

---

# Architecture

Preferred request flow:

```text
React Component
        │
        ▼
   Custom Hook
        │
        ▼
     Service
        │
        ▼
 External API
```

The service layer is responsible for:

- Sending requests
- Parsing responses
- Handling errors
- Normalizing data
- Returning a consistent data model

---

# Service Structure

Recommended structure:

```text
src/
└── services/
    ├── api.js
    ├── climate.service.js
    ├── wave.service.js
    ├── tide.service.js
    ├── weather.service.js
    ├── buoy.service.js
    └── file.service.js
```

Each service should have a single responsibility.

---

# Supported Data Sources

Potential external providers include:

- NOAA
- BOM
- BMKG
- Open-Meteo

Additional providers may be added when needed.

---

# Request Rules

Always:

- Use HTTPS.
- Handle request failures.
- Validate responses.
- Normalize returned data.
- Return predictable objects.

Never:

- Return raw API responses directly to components.
- Duplicate request logic.
- Ignore failed requests.

---

# Response Normalization

Different providers return different response formats.

Every response must be transformed into a common internal data model before reaching the UI.

Example:

```javascript
{
  timestamp,
  latitude,
  longitude,
  variables: {
    windSpeed,
    windDirection,
    waveHeight,
    wavePeriod,
    waterLevel,
    oni,
    dmi
  }
}
```

---

# Error Handling

Services should gracefully handle:

- Network failures
- Timeouts
- Invalid responses
- Empty datasets
- Rate limiting

Return meaningful errors that can be displayed to users.

---

# Timeout

Requests should use reasonable timeout values.

Long-running requests should provide loading feedback.

---

# Caching

When appropriate:

- Cache frequently requested datasets.
- Avoid unnecessary duplicate requests.
- Refresh stale data only when required.

Caching strategy may evolve as the project grows.

---

# Authentication

Current version:

No authentication required.

Future versions may support:

- API Keys
- OAuth
- Token-based authentication

Authentication logic should remain inside the service layer.

---

# Rate Limiting

Respect provider limits.

Avoid excessive requests by:

- Reusing cached data.
- Debouncing user interactions.
- Avoiding repeated identical requests.

---

# Logging

Development:

- Log useful debugging information.

Production:

- Avoid exposing sensitive API details.

---

# Security

Never expose:

- API secrets
- Private keys
- Access tokens

Sensitive configuration should be stored using environment variables.

---

# Environment Variables

Store configurable values inside:

```text
.env
```

Examples:

```text
VITE_API_BASE_URL=
VITE_NOAA_API_KEY=
VITE_BMKG_API_KEY=
```

Do not hardcode secrets inside the source code.

---

# File Imports

CSV and Excel imports are considered local data sources.

Parsing should be handled through dedicated file services.

Recommended flow:

```text
CSV / XLSX
      │
      ▼
 file.service.js
      │
      ▼
 Normalized Data
      │
      ▼
 Components
```

---

# Future APIs

The architecture should support additional providers without changing the existing application structure.

Every new provider should:

- Have its own service file.
- Follow the same response model.
- Reuse shared utilities whenever possible.

---

# API Development Checklist

Before integrating a new API, verify:

- HTTPS is used.
- Responses are validated.
- Errors are handled.
- Data is normalized.
- No secrets are exposed.
- Existing services are reused where appropriate.

---

# Golden Rule

The user interface should never know where the data comes from.

Whether the source is:

- CSV
- Excel (.xlsx)
- NOAA
- BOM
- BMKG
- Open-Meteo

Every tool should receive the same normalized data structure from the service layer.
