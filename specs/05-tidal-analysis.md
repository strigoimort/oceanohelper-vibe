# Tidal Analysis Specification

## Overview

The Tidal Analysis tool is designed to analyze observed tidal data collected over a period of time.

It provides visualization, descriptive statistics, tidal classification, and harmonic analysis to help users understand tidal characteristics at a specific location.

The tool is intended for oceanographic, coastal, hydrographic, and port-related applications.

---

# Objectives

The Tidal Analysis should enable users to:

- Import observed tidal data.
- Visualize tidal fluctuations.
- Calculate descriptive statistics.
- Determine tidal type.
- Perform harmonic analysis.
- Display tidal constituents.
- Export analysis results.

---

# User Stories

As a user, I want to:

- Import tidal observation data.
- Visualize the tidal time series.
- Identify high and low tides.
- Calculate tidal statistics.
- Determine the tidal type automatically.
- View harmonic constituents.
- Understand the meaning of each constituent.
- Export the results.

---

# Supported Data Sources

Current:

- CSV
- Excel (.xlsx)

Future:

- API
- NetCDF

---

# Dataset Requirements

Minimum required columns:

- Timestamp
- Water Level

Optional columns:

- Station Name
- Observation ID
- Quality Flag

Observations should be ordered chronologically.

---

# Data Visualization

Display the tidal observation as an interactive time series.

The chart should support:

- Zoom
- Pan
- Hover information
- Time selection
- Reset view

---

# Tidal Statistics

Automatically calculate:

- Highest Water Level
- Lowest Water Level
- Mean Sea Level (MSL)
- Tidal Range
- Mean High Water
- Mean Low Water
- Number of observations

Statistics should update whenever a new dataset is loaded.

---

# Tidal Type Classification

Automatically determine the tidal type.

Possible classifications:

- Diurnal
- Semidiurnal
- Mixed, Mainly Diurnal
- Mixed, Mainly Semidiurnal

The application should calculate the Formzahl Number and display the corresponding classification.

---

# Harmonic Analysis

Perform harmonic analysis to estimate tidal constituents.

Display common constituents including:

- M2
- S2
- N2
- K1
- O1
- P1
- K2
- Q1

Additional constituents may be supported in future versions.

---

# Tidal Constituents

For each constituent display:

- Name
- Amplitude
- Phase
- Period
- Description

Users should be able to understand the role of each constituent in the tidal signal.

---

# Constituent Descriptions

Provide a short explanation for each major constituent.

Examples:

- M2 — Principal lunar semidiurnal constituent.
- S2 — Principal solar semidiurnal constituent.
- K1 — Lunar-solar diurnal constituent.
- O1 — Principal lunar diurnal constituent.

Descriptions should be concise and scientifically accurate.

---

# Formzahl Number

Calculate and display:

- Formzahl Value
- Formula used
- Tidal Type
- Interpretation

The interpretation should clearly explain why the location is classified into a particular tidal type.

---

# Filtering

Users should be able to filter by:

- Observation period
- Date range

The visualization and statistics should update automatically.

---

# Export

Supported export formats:

- CSV
- Excel (.xlsx)
- PNG
- PDF

Future:

- Harmonic analysis report
- Tidal prediction dataset

---

# Workflow

```text
Import Dataset
      │
      ▼
Validate Dataset
      │
      ▼
Visualize Time Series
      │
      ▼
Calculate Statistics
      │
      ▼
Perform Harmonic Analysis
      │
      ▼
Determine Tidal Type
      │
      ▼
Display Constituents
      │
      ▼
Export Results
```

---

# Functional Requirements

The Tidal Analysis must:

- Import CSV and Excel datasets.
- Display tidal time series.
- Calculate tidal statistics.
- Determine tidal type automatically.
- Perform harmonic analysis.
- Display tidal constituents.
- Export analysis results.

---

# Non-Functional Requirements

The Tidal Analysis should be:

- Accurate
- Responsive
- Reliable
- Scientifically valid
- Easy to use

---

# Acceptance Criteria

The Tidal Analysis is considered complete when:

- CSV and Excel datasets can be imported.
- Tidal observations are visualized correctly.
- Statistics are calculated automatically.
- Tidal type is identified correctly.
- Harmonic constituents are displayed.
- Constituent descriptions are available.
- Results can be exported.
- The interface remains responsive with large datasets.

---

# Future Enhancements

Potential future capabilities include:

- Automatic tidal prediction
- Harmonic reconstruction
- Residual tide analysis
- Storm surge analysis
- Tide comparison between stations
- Multi-station harmonic analysis
- API integration with tide gauge networks
- Tidal calendar generation
- Automatic tidal report generation
