# Project Conventions

This document defines the project-wide conventions used throughout OceanoHelper.

All developers, contributors, and AI coding assistants should follow these conventions.

---

# General Principles

- Maintain consistency across all modules.
- Prefer reusable components over duplicated code.
- Keep the codebase modular.
- Follow the project architecture.
- Prioritize readability and maintainability.

---

# Coordinate Reference System (CRS)

Default Coordinate Reference System:

- WGS84 (EPSG:4326)

All imported, exported, and displayed coordinates should use this CRS unless explicitly specified otherwise.

---

# Geographic Coordinates

Coordinate order:

- Latitude
- Longitude

Decimal degrees should be used throughout the application.

---

# Time Standard

Default timezone:

- UTC

Timestamps should follow the ISO 8601 format whenever possible.

Example:

```text
2026-07-06T12:30:00Z
```

Local time may be displayed in the user interface, but internal processing should always use UTC.

---

# Units

Unless otherwise specified, use SI units.

Examples:

Length

- Meter (m)
- Kilometer (km)
- Nautical Mile (NM)

Area

- Square Meter (m²)
- Square Kilometer (km²)
- Hectare (ha)

Speed

- m/s
- knot

Wave Height

- meter (m)

Water Level

- meter (m)

Temperature

- °C

Pressure

- hPa

---

# Data Handling

Imported datasets should never be modified directly.

Workflow:

Import

↓

Validation

↓

Normalization

↓

Internal Data Model

↓

Visualization

Raw data should remain immutable.

---

# File Support

Supported formats:

- CSV
- Excel (.xlsx)

Future support:

- GeoJSON
- NetCDF
- GeoTIFF
- Shapefile

---

# Mapping Standards

Whenever possible, automatically detect common column names.

Examples:

Latitude

Longitude

Timestamp

Station

Wave Height

Wind Speed

Users should be able to manually map columns when automatic detection fails.

---

# Map Standards

All map-based tools should use the shared Geospatial Workspace.

Avoid creating multiple independent map implementations.

All map tools should share:

- Layer Manager
- Basemap
- Drawing Tools
- Measurements
- Styling
- Coordinate Display

---

# Charts

Charts should:

- Be interactive.
- Support zooming.
- Support exporting.
- Remain responsive.

Maintain a consistent appearance across all modules.

---

# Color Usage

Colors should communicate meaning.

Examples:

Blue

- Ocean
- Water

Green

- Success

Orange

- Warning

Red

- Error

Gray

- Neutral

Avoid unnecessary decorative colors.

---

# Naming Conventions

Use internationally recognized scientific abbreviations.

Examples:

Hs

Hmax

Tp

Tz

ONI

DMI

SST

SLA

SLP

Do not invent custom abbreviations.

---

# Performance

Prefer:

- Lazy loading
- Memoization
- Efficient rendering

Avoid unnecessary re-renders.

---

# Accessibility

The application should support:

- Keyboard navigation
- Responsive layouts
- High color contrast
- Clear typography

---

# Future Expansion

All modules should be designed to support future enhancements without requiring major architectural changes.

New features should integrate with existing shared components whenever possible.
