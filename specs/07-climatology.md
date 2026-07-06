# Climatology Specification

## Overview

The Climatology tool provides near real-time climate indicators and oceanographic maps without requiring user-uploaded datasets.

It enables users to monitor large-scale climate conditions, including ENSO and the Indian Ocean Dipole (IOD), through a combination of climate indices, map visualizations, and scientific interpretation.

The tool should automatically retrieve the latest available data from supported data providers.

---

# Objectives

The Climatology tool should enable users to:

- View the latest climate indicators.
- Monitor ENSO conditions.
- Monitor Indian Ocean Dipole conditions.
- Explore global oceanographic maps.
- Understand current climate conditions through scientific interpretation.

---

# User Stories

As a user, I want to:

- Open the Climatology tool without importing any data.
- View the latest ONI and DMI values.
- Understand whether El Niño, La Niña, or Neutral conditions are occurring.
- Understand whether Positive IOD, Negative IOD, or Neutral conditions are occurring.
- View climate-related maps.
- Explore maps interactively.
- Export maps and summaries.

---

# Data Sources

The application should automatically retrieve the latest available climate data from supported providers.

Potential sources include:

- NOAA
- BOM
- Other publicly available climate services

Users should not be required to upload datasets.

---

# Climate Indicators

Display:

- Oceanic Niño Index (ONI)
- Dipole Mode Index (DMI)

Each indicator should include:

- Current value
- Observation period
- Latest update
- Data source

---

# Climate Classification

Automatically determine the current climate condition.

ENSO classification:

- El Niño
- Neutral
- La Niña

IOD classification:

- Positive IOD
- Neutral
- Negative IOD

The application should provide a short scientific explanation for each classification.

---

# Climate Summary

Generate an automatic summary describing the current climate conditions.

Example information may include:

- Current ENSO status
- Current IOD status
- Expected ocean-atmosphere influence
- General interpretation

The summary should remain concise, scientifically accurate, and easy to understand.

---

# Map Viewer

Display interactive global maps.

Supported map layers may include:

- Sea Surface Temperature (SST)
- Sea Surface Temperature Anomaly (SSTA)
- Sea Level Anomaly (SLA)
- Sea Level Pressure (SLP)

Future support may include:

- Ocean Current
- Chlorophyll-a
- Sea Surface Salinity
- Outgoing Longwave Radiation (OLR)
- Surface Wind

---

# Map Controls

Users should be able to:

- Zoom
- Pan
- Switch map layers
- View legends
- Inspect values at a selected location

The map should remain responsive across devices.

---

# Layer Selection

Only one climate layer should be displayed at a time.

Users should be able to switch between available variables instantly.

---

# Legend

Each map should display:

- Color scale
- Units
- Variable name
- Data source

The legend should update automatically when the selected layer changes.

---

# Statistics Panel

Display:

- Current ONI
- Current DMI
- ENSO Status
- IOD Status
- Last Updated

The panel should refresh automatically when new data become available.

---

# Export

Supported export formats:

- PNG
- PDF

Future:

- Climate report
- Monthly climate bulletin

---

# Workflow

```text
Open Climatology
        │
        ▼
Retrieve Latest Climate Data
        │
        ▼
Calculate Climate Classification
        │
        ▼
Display Climate Indicators
        │
        ▼
Render Climate Maps
        │
        ▼
Generate Scientific Summary
```

---

# Functional Requirements

The Climatology tool must:

- Retrieve the latest climate data automatically.
- Display ONI and DMI values.
- Determine ENSO status.
- Determine IOD status.
- Display interactive climate maps.
- Provide scientific interpretation.
- Export maps and summaries.

---

# Non-Functional Requirements

The Climatology tool should be:

- Accurate
- Responsive
- Reliable
- Scientifically valid
- Easy to understand

---

# Acceptance Criteria

The Climatology tool is considered complete when:

- Climate data loads automatically without user input.
- ONI and DMI values are displayed correctly.
- ENSO and IOD classifications are determined automatically.
- Interactive climate maps are available.
- Scientific summaries are generated.
- Maps can be exported.
- The interface remains responsive.

---

# Future Enhancements

Potential future capabilities include:

- Historical ONI and DMI time series
- Climate anomaly comparison
- Monthly climate archive
- Seasonal outlooks
- Regional climate focus
- Multi-variable map comparison
- Time slider for historical maps
- Automatic climate bulletin generation
- Climate event notifications
- AI-assisted climate interpretation
