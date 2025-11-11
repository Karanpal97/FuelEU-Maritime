/**
 * Comparison Entity - Core Domain
 * For comparing routes against baseline
 */
export interface RouteComparison {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  isBaseline: boolean;
  percentDiff?: number; // Percentage difference from baseline
  compliant: boolean; // Whether it meets the target
  targetIntensity: number;
}

export interface ComparisonResult {
  baseline: RouteComparison;
  comparisons: RouteComparison[];
  targetIntensity: number;
}

