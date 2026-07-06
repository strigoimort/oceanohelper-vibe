# Coding Rules

This document defines the coding standards for OceanoHelper. Every new feature, component, hook, service, and utility should follow these rules to maintain consistency, readability, and maintainability.

---

# General Principles

Always write code that is:

- Readable
- Modular
- Reusable
- Maintainable
- Predictable

Favor simplicity over cleverness.

---

# File Naming

Use lowercase with kebab-case for files and folders.

Examples:

```text
interactive-map.jsx
particle-tracer.jsx
wave-analysis.js
sidebar.jsx
map-toolbar.jsx
```

---

# Component Naming

React components must use PascalCase.

Examples:

```javascript
InteractiveMap;
ParticleTracer;
WaveAnalysis;
Sidebar;
Navbar;
MapToolbar;
```

Each component should represent a single responsibility.

---

# Hook Naming

Custom hooks must start with `use`.

Examples:

```javascript
useMap();
useTracer();
useWaveAnalysis();
useClimatology();
```

Hooks should encapsulate reusable logic.

---

# Function Naming

Use camelCase.

Examples:

```javascript
loadCsv();
parseDataset();
calculateBearing();
filterByTime();
```

Function names should clearly describe their purpose.

---

# Variable Naming

Use meaningful names.

Good:

```javascript
waveHeight;
windSpeed;
selectedStation;
filteredData;
```

Avoid:

```javascript
a;
b;
tmp;
data1;
test;
```

---

# Constants

Constants should use UPPER_SNAKE_CASE.

Examples:

```javascript
DEFAULT_ZOOM;
MAX_MARKERS;
DEFAULT_CENTER;
API_BASE_URL;
```

Store shared constants inside the `constants/` directory.

---

# Imports

Order imports consistently.

1. React
2. Third-party libraries
3. Internal modules
4. Relative imports
5. Styles

Example:

```javascript
import { useState } from "react";

import Plot from "react-plotly.js";
import L from "leaflet";

import Sidebar from "@/components/Sidebar";

import "./styles.css";
```

---

# Components

Components should:

- Receive data through props.
- Remain as stateless as possible.
- Avoid unnecessary side effects.
- Be reusable.

Do not place business logic inside UI components.

---

# Hooks

Custom hooks should contain:

- Data fetching
- State management
- Reusable business logic

Avoid placing UI rendering inside hooks.

---

# Services

Services are responsible for:

- API communication
- CSV loading
- Data parsing
- External data access

Services should never manipulate the DOM.

---

# Utilities

Utility functions should:

- Be pure functions.
- Have no side effects.
- Be reusable.
- Be independently testable.

---

# State Management

Prefer the following order:

1. useState
2. useReducer
3. Context API

Do not introduce additional state libraries without approval.

---

# Async Code

Always use:

```javascript
async/await
```

Avoid nested Promise chains when possible.

Always handle errors.

Example:

```javascript
try {
  const data = await fetchData();
} catch (error) {
  console.error(error);
}
```

---

# Error Handling

Handle errors gracefully.

Never allow the application to crash because of:

- Missing API responses
- Invalid CSV files
- Invalid user input
- Network failures

Provide meaningful feedback to users.

---

# Comments

Write comments only when they explain **why**, not **what**.

Good:

```javascript
// Cache parsed data to avoid reprocessing large CSV files.
```

Avoid:

```javascript
// Increment i
i++;
```

Code should be self-explanatory whenever possible.

---

# Code Duplication

Avoid duplicated logic.

If code is reused more than once, consider extracting it into:

- Component
- Hook
- Utility
- Service

---

# Styling

Use Tailwind CSS for all application styling.

Guidelines:

- Prefer utility classes.
- Keep class lists readable.
- Extract reusable UI patterns into components.
- Minimize custom CSS.

Inline styles should only be used when absolutely necessary.

---

# Performance

Prefer:

- useMemo
- useCallback
- React.memo

Only optimize when there is measurable benefit.

Avoid premature optimization.

---

# Folder Responsibility

Each folder has one responsibility.

- components → UI
- hooks → reusable logic
- services → external data
- utils → helper functions
- constants → shared constants
- pages → application routes

Do not mix responsibilities.

---

# Git Practices

Keep commits:

- Small
- Focused
- Descriptive

Each commit should represent one logical change.

---

# AI Development Rules

When generating code:

- Reuse existing components whenever possible.
- Do not duplicate logic.
- Preserve existing functionality.
- Follow the established architecture.
- Keep implementations simple.
- Do not introduce unnecessary dependencies.

---

# Before Completing a Task

Verify that:

- No ESLint errors remain.
- No unused imports exist.
- No unused variables exist.
- No dead code exists.
- Components remain reusable.
- Existing functionality is preserved.
- New code follows the project architecture.

---

# Golden Rule

Write code that another developer can understand immediately.

Prioritize readability, consistency, and maintainability over clever or complex implementations.

---

# Scientific Calculations

- Never hardcode scientific values.
- Keep calculations inside `utils/`.
- Document formulas when necessary.
- Separate calculations from visualization.
- Always preserve original data.
- Never mutate imported datasets.
