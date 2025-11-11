/**
 * Routes API Adapter - Infrastructure
 */
import { RoutesPort } from '@/core/ports/RoutesPort';
import { Route, RouteFilters, ComparisonResult } from '@/core/domain/entities/Route';
import { apiClient } from './apiClient';

export class RoutesApiAdapter implements RoutesPort {
  async getAllRoutes(filters?: RouteFilters): Promise<Route[]> {
    const params: Record<string, string> = {};
    if (filters?.vesselType) params.vesselType = filters.vesselType;
    if (filters?.fuelType) params.fuelType = filters.fuelType;
    if (filters?.year) params.year = filters.year.toString();

    return apiClient.get<Route[]>('/routes', params);
  }

  async setBaseline(routeId: string): Promise<Route> {
    return apiClient.post<Route>(`/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<ComparisonResult> {
    return apiClient.get<ComparisonResult>('/routes/comparison');
  }
}

