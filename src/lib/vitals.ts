import type { Metric } from "web-vitals";

export interface VitalsPayload {
  name: string;
  data: { value: number; rating: string; path: string };
}

export function buildVitalsPayload(metric: Metric, path: string): VitalsPayload {
  const value =
    metric.name === "CLS"
      ? Math.round(metric.value * 1000)
      : metric.value;

  return {
    name: metric.name,
    data: { value, rating: metric.rating, path },
  };
}
