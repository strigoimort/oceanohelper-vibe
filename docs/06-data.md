# Data Specification

This document defines the official data standards for OceanoHelper.

Every feature should follow these specifications to ensure consistency across all tools.

---

# Data Principles

All datasets should be:

- Consistent
- Validated
- Immutable
- Well documented
- Scientifically meaningful

Original datasets must never be modified directly.

---

# Supported Data Formats

Current formats:

- CSV
- Excel (.xlsx)
- JSON
- GeoJSON

Planned support:

- NetCDF
- GRIB

---

# Data Import

OceanoHelper should support importing datasets from:

- CSV (.csv)
- Microsoft Excel (.xlsx)

Import behavior:

- Detect headers automatically.
- Preserve original column names.
- Allow column mapping when required.
- Validate required fields before processing.
- Support multiple worksheets (future enhancement).

---

# General Dataset Requirements

Every dataset should contain:

- Clear column names
- Consistent units
- Standard timestamp format
- Valid numeric values

Missing values should be handled gracefully.

---

# Standard Column Names

Use the following naming convention whenever possible.

| Column    | Type   | Description                 |
| --------- | ------ | --------------------------- |
| id        | String | Unique record identifier    |
| station   | String | Station or buoy name        |
| latitude  | Number | Latitude (decimal degrees)  |
| longitude | Number | Longitude (decimal degrees) |
| timestamp | String | ISO 8601 UTC datetime       |
| source    | String | Data provider               |
| quality   | String | Data quality flag           |

---

# Oceanographic Variables

Common variables include:

| Variable                | Unit    |
| ----------------------- | ------- |
| sea_surface_temperature | °C      |
| sea_level_anomaly       | m       |
| salinity                | PSU     |
| dissolved_oxygen        | mg/L    |
| chlorophyll             | mg/m³   |
| current_speed           | m/s     |
| current_direction       | degrees |

---

# Meteorological Variables

| Variable             | Unit    |
| -------------------- | ------- |
| wind_speed           | m/s     |
| wind_direction       | degrees |
| air_temperature      | °C      |
| atmospheric_pressure | hPa     |
| humidity             | %       |
| rainfall             | mm      |

---

# Wave Variables

| Variable                | Unit    |
| ----------------------- | ------- |
| significant_wave_height | m       |
| wave_period             | s       |
| wave_direction          | degrees |

---

# Tidal Variables

| Variable        | Unit |
| --------------- | ---- |
| water_level     | m    |
| tide_prediction | m    |

---

# Climatology Variables

| Variable                | Unit  |
| ----------------------- | ----- |
| oni                     | Index |
| dmi                     | Index |
| sea_surface_temperature | °C    |
| sea_level_anomaly       | m     |

---

# Coordinate System

Use:

- WGS84 (EPSG:4326)

Latitude:

-90 to 90

Longitude:

-180 to 180

---

# Time Standard

All timestamps should use:

ISO 8601

Example:

```text
2026-07-06T12:30:00Z
```

Store timestamps in UTC whenever possible.

---

# Units

Use SI units whenever possible.

Examples:

- meter (m)
- meter/second (m/s)
- degree (°)
- Celsius (°C)
- second (s)
- hectopascal (hPa)

Avoid mixing units within the same dataset.

---

# Missing Values

Allowed representations:

- null
- empty value
- NaN

Never use placeholder values such as:

-9999

without documenting them first.

Missing values should never crash the application.

---

# Data Validation

Validate before processing.

Checks include:

- Required columns exist.
- Coordinates are valid.
- Numeric values are numeric.
- Timestamps are valid.
- Units are consistent.

Reject invalid datasets with meaningful error messages.

---

# Internal Data Model

After parsing, records should follow a consistent structure.

Example:

```javascript
{
  id,
  station,
  latitude,
  longitude,
  timestamp,
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

This internal structure should remain consistent across all tools.

---

# Data Processing Pipeline

Preferred workflow:

```text
CSV / API
      │
      ▼
Validation
      │
      ▼
Parsing
      │
      ▼
Normalization
      │
      ▼
Internal Data Model
      │
      ▼
Visualization
```

Each stage should have a single responsibility.

---

# Data Integrity Rules

Always:

- Preserve original data.
- Validate before visualization.
- Keep calculations reproducible.
- Document derived variables.
- Separate raw data from processed data.

Never:

- Modify source datasets.
- Guess missing values without clear rules.
- Mix incompatible units.
- Ignore validation errors.

---

# Future Expansion

The data model should be flexible enough to support additional datasets, variables, and formats without requiring major architectural changes.
