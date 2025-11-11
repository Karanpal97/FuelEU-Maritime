/**
 * Route Entity - Frontend Domain
 */
export interface Route {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}

export interface RouteComparison {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  isBaseline: boolean;
  percentDiff?: number;
  compliant: boolean;
  targetIntensity: number;
}

export interface ComparisonResult {
  baseline: RouteComparison;
  comparisons: RouteComparison[];
  targetIntensity: number;
}

