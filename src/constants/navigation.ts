export type NavItem = {
  label: string;
  path: string;
  description: string;
  icon: string;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/",
    description: "Overview and quick navigation",
    icon: "◉",
  },
  {
    label: "Geospatial Workspace",
    path: "/geospatial-workspace",
    description: "Map-based geospatial exploration",
    icon: "⌖",
  },
  {
    label: "Particle Tracer",
    path: "/particle-tracer",
    description: "Trajectory and drift visualization",
    icon: "✦",
  },
  {
    label: "Wind Rose",
    path: "/wind-rose",
    description: "Directional analysis and rose charts",
    icon: "☼",
  },
  {
    label: "Wave Analysis",
    path: "/wave-analysis",
    description: "Wave statistics and sea state insights",
    icon: "≈",
  },
  {
    label: "Tidal Analysis",
    path: "/tidal-analysis",
    description: "Water level and tidal patterns",
    icon: "◌",
  },
  {
    label: "Climatology",
    path: "/climatology",
    description: "Climate indicators and summaries",
    icon: "☁",
  },
];
