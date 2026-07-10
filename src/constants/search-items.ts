import {
  House,
  Map,
  Route,
  Wind,
  Waves,
  Activity,
  CloudSun,
} from "lucide-react";

export const searchItems = [
  {
    title: "Dashboard",
    description: "Overview and quick navigation",
    path: "/",
    icon: House,
    keywords: ["home", "dashboard", "oceanohelper"],
  },

  {
    title: "Geospatial Workspace",
    description: "Geospatial exploration",
    path: "/geospatial-workspace",
    icon: Map,
    keywords: ["map", "gis", "geospatial", "workspace"],
  },

  {
    title: "Particle Tracer",
    description: "Trajectory and drift visualization",
    path: "/particle-tracer",
    icon: Route,
    keywords: ["particle", "tracer", "drifter", "buoy", "trajectory"],
  },

  {
    title: "Wind Rose",
    description: "Directional analysis charts",
    path: "/wind-rose",
    icon: Wind,
    keywords: ["wind", "rose", "direction", "speed"],
  },

  {
    title: "Wave Analysis",
    description: "Wave statistics and insights",
    path: "/wave-analysis",
    icon: Waves,
    keywords: ["wave", "hs", "period", "swell"],
  },

  {
    title: "Tidal Analysis",
    description: "Water level and tidal patterns",
    path: "/tidal-analysis",
    icon: Activity,
    keywords: ["tidal", "water", "level", "patterns"],
  },

  {
    title: "Climatology",
    description: "Climate summaries",
    path: "/climatology",
    icon: CloudSun,
    keywords: ["oni", "enso", "dmi", "iod", "climate"],
  },
];
