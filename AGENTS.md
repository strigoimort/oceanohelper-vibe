# AGENTS.md

## Project Identity

Project Name: OceanoHelper

OceanoHelper is an all-in-one web platform for oceanographic visualization and marine data analysis.

The application focuses on providing interactive visualization tools for oceanographic, meteorological, and climate datasets through a modern web interface.

---

# Mission

Build a professional, fast, and intuitive application for exploring marine datasets.

Every implementation should prioritize:

- Clean UI
- Good performance
- Scientific correctness
- Modular architecture
- Maintainable code

---

# Technology Stack

Frontend

- React
- Vite
- JavaScript (ES Modules)

Visualization

- Leaflet
- Plotly

Data

- CSV
- JSON
- GeoJSON

Libraries

- Papa Parse

---

# Core Modules

The application consists of six primary tools.

1. Geospatial Workspace
2. Particle Tracer
3. Wind Rose
4. Wave Analysis
5. Tidal Analysis
6. Climatology

Do not introduce new core modules unless explicitly requested.

---

# Coding Standards

Always:

- Write clean and readable code.
- Prefer reusable components.
- Avoid duplicated logic.
- Use descriptive variable names.
- Keep functions small and focused.
- Follow consistent folder organization.
- Separate UI, business logic, and utilities.

Never:

- Write unnecessary code.
- Leave unused imports.
- Leave console.log statements.
- Introduce dead code.
- Create overly complex components.

---

# UI Guidelines

The application should have a modern scientific dashboard appearance.

Design principles:

- Clean layout
- Spacious spacing
- Responsive design
- Consistent typography
- Soft color palette
- Smooth animations
- Accessible components

Prefer cards over large panels.

Keep interfaces uncluttered.

---

# Folder Structure

Separate concerns clearly.

- components/
- pages/
- hooks/
- services/
- utils/
- assets/
- public/

Business logic should not live inside UI components whenever possible.

---

# Performance

Always optimize for performance.

Prefer:

- Lazy loading
- Memoization where appropriate
- Efficient rendering
- Minimal re-renders

Avoid unnecessary API calls.

---

# Development Rules

Implement one feature at a time.

Never rewrite unrelated modules.

Preserve existing functionality unless instructed otherwise.

Refactor only when it improves readability or maintainability.

---

# AI Workflow

For every request:

1. Understand the existing architecture.
2. Read the relevant specification document.
3. Reuse existing components when possible.
4. Implement the smallest complete solution.
5. Verify that no existing functionality is broken.

---

# Constraints

Do not:

- Change project architecture without approval.
- Rename folders without approval.
- Replace libraries unless requested.
- Delete working features.
- Modify unrelated files.

---

# Code Quality Checklist

Before completing any task, verify:

- No lint errors
- No unused imports
- Responsive layout maintained
- Existing functionality preserved
- Consistent code style
- Readable component structure

---

# General Principle

When multiple implementation choices exist:

- Prefer simplicity.
- Prefer readability.
- Prefer maintainability.
- Prefer modularity.
- Prefer performance only after correctness.

---

# Design Rules

Every new UI must feel like it belongs to the existing application.

Prefer:

- Large whitespace
- Minimal interfaces
- Rounded corners (xl/2xl)
- Subtle shadows
- Soft borders
- Smooth transitions
- Elegant typography
- Consistent spacing
- Premium interactions

Avoid:

- Crowded layouts
- Multiple accent colors
- Heavy borders
- Flashy animations
- Overly saturated colors
- Inconsistent spacing
