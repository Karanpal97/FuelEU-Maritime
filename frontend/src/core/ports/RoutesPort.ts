/**
 * Routes Port - Outbound Interface
 */
import { Route, RouteFilters, ComparisonResult } from '../domain/entities/Route';

export interface RoutesPort {
  getAllRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<ComparisonResult>;
}

