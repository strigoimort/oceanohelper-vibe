# Wind Rose Specification

## Overview

The Wind Rose tool provides a statistical visualization of directional data for wind and waves.

It enables users to analyze the distribution of direction and magnitude using a circular rose diagram.

The tool supports both wind and wave datasets through a simple and intuitive workflow.

---

# Objectives

The Wind Rose should enable users to:

- Visualize directional distributions.
- Analyze wind patterns.
- Analyze wave direction patterns.
- Display frequency by direction.
- Classify wind speed using the Beaufort Scale.
- Export charts and statistics.

---

# User Stories

As a user, I want to:

- Import my own dataset.
- Select whether the dataset represents wind or waves.
- Choose the direction and magnitude columns.
- Generate a wind rose chart.
- View summary statistics.
- Export the visualization.

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

For Wind:

- Wind Direction
- Wind Speed

For Wave:

- Wave Direction
- Wave Height

Additional variables may be included but are optional.

---

# Analysis Mode

Users should select one analysis mode:

- Wind
- Wave

The interface should automatically adjust labels and units based on the selected mode.

---

# Wind Mode

Wind Mode should display:

- Wind Rose
- Direction frequency
- Wind speed classes
- Beaufort Scale classification
- Summary statistics

---

# Wave Mode

Wave Mode should display:

- Wave Rose
- Direction frequency
- Wave height classes
- Summary statistics

---

# Column Mapping

Users should select:

Direction Column

Magnitude Column

The application should automatically detect compatible columns whenever possible.

---

# Wind Rose Visualization

The chart should display:

- Direction sectors
- Frequency distribution
- Magnitude classes
- Legend
- Percentage values

The visualization should remain clear for large datasets.

---

# Beaufort Scale

When Wind Mode is selected, classify wind speed according to the Beaufort Scale.

Display:

- Beaufort Number
- Wind Speed Range
- Standard Beaufort Description

Classification should update automatically based on the selected dataset.

---

# Statistics

Display summary information such as:

- Number of observations
- Dominant direction
- Mean direction
- Mean speed or height
- Maximum speed or height
- Minimum speed or height

Statistics should update whenever the dataset changes.

---

# Filtering

Users should be able to filter by:

- Date
- Time
- Speed or Height range
- Direction range

The chart should update immediately after filtering.

---

# Visualization Options

Users should be able to customize:

- Number of direction sectors
- Number of magnitude classes
- Color palette
- Legend visibility
- Grid visibility
- Labels

---

# Export

Supported export formats:

- PNG
- SVG
- PDF
- CSV (statistics)

---

# Workflow

```text
Import Dataset
      │
      ▼
Select Analysis Mode
(Wind or Wave)
      │
      ▼
Map Columns
      │
      ▼
Generate Rose Diagram
      │
      ▼
View Statistics
      │
      ▼
Export Results
```

---

# Functional Requirements

The Wind Rose must:

- Import CSV and Excel datasets.
- Support both Wind and Wave analysis.
- Generate rose diagrams.
- Classify wind speed using the Beaufort Scale.
- Display summary statistics.
- Export charts and statistics.

---

# Non-Functional Requirements

The Wind Rose should be:

- Fast
- Responsive
- Accurate
- Easy to use
- Consistent with the OceanoHelper design system

---

# Acceptance Criteria

The Wind Rose is considered complete when:

- CSV and Excel datasets can be imported.
- Wind and Wave modes function correctly.
- Rose diagrams are generated successfully.
- Beaufort Scale classification is displayed in Wind Mode.
- Statistics update automatically.
- Charts can be exported.
- The interface remains responsive with large datasets.

---

# Future Enhancements

Potential future capabilities include:

- Seasonal wind rose
- Monthly comparison
- Multi-dataset comparison
- Animated wind rose
- Polar frequency analysis
- Interactive tooltips
- Automatic report generation
- Direct API integration

```

```
