import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppShell from "./layouts/app-shell";
import DashboardPage from "./pages/dashboard-page";
import PlaceholderPage from "./pages/placeholder-page";

import "./App.css";

const toolDescriptions: Record<string, string> = {
  "geospatial-workspace":
    "The geospatial workspace will provide a shared map canvas for layers, measurements, and dataset management.",
  "particle-tracer":
    "The particle tracer will support historical trajectories, animations, and future movement forecasting.",
  "wind-rose":
    "The wind rose tool will visualize directional distributions and summary statistics for wind and wave data.",
  "wave-analysis":
    "The wave analysis workspace will present interactive time series, sea-state classifications, and distributions.",
  "tidal-analysis":
    "The tidal analysis workspace will highlight water level trends and harmonic analysis views.",
  climatology:
    "The climatology experience will surface climate indicators, summaries, and map-based context.",
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route element={<AppShell title="Dashboard" />}> */}
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="geospatial-workspace"
            element={
              <PlaceholderPage
                title="Geospatial Workspace"
                description={toolDescriptions["geospatial-workspace"]}
              />
            }
          />
          <Route
            path="particle-tracer"
            element={
              <PlaceholderPage
                title="Particle Tracer"
                description={toolDescriptions["particle-tracer"]}
              />
            }
          />
          <Route
            path="wind-rose"
            element={
              <PlaceholderPage
                title="Wind Rose"
                description={toolDescriptions["wind-rose"]}
              />
            }
          />
          <Route
            path="wave-analysis"
            element={
              <PlaceholderPage
                title="Wave Analysis"
                description={toolDescriptions["wave-analysis"]}
              />
            }
          />
          <Route
            path="tidal-analysis"
            element={
              <PlaceholderPage
                title="Tidal Analysis"
                description={toolDescriptions["tidal-analysis"]}
              />
            }
          />
          <Route
            path="climatology"
            element={
              <PlaceholderPage
                title="Climatology"
                description={toolDescriptions.climatology}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
