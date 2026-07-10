import type { ReactNode } from "react";

import {
  House,
  Map,
  Route,
  Wind,
  Waves,
  Activity,
  CloudSun,
} from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  description: string;
  icon: ReactNode;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/",
    description: "Overview and quick navigation",
    icon: <House size={18} strokeWidth={2} />,
  },
  {
    label: "Geospatial Workspace",
    path: "/geospatial-workspace",
    description: "Geospatial exploration",
    icon: <Map size={18} strokeWidth={2} />,
  },
  {
    label: "Particle Tracer",
    path: "/particle-tracer",
    description: "Trajectory and drift visualization",
    icon: <Route size={18} strokeWidth={2} />,
  },
  {
    label: "Wind Rose",
    path: "/wind-rose",
    description: "Directional analysis charts",
    icon: <Wind size={18} strokeWidth={2} />,
  },
  {
    label: "Wave Analysis",
    path: "/wave-analysis",
    description: "Wave statistics and insights",
    icon: <Waves size={18} strokeWidth={2} />,
  },
  {
    label: "Tidal Analysis",
    path: "/tidal-analysis",
    description: "Water level and tidal patterns",
    icon: <Activity size={18} strokeWidth={2} />,
  },
  {
    label: "Climatology",
    path: "/climatology",
    description: "Climate summaries",
    icon: <CloudSun size={18} strokeWidth={2} />,
  },
];
