/**
 * Route Repository Port - Outbound Interface
 * Defines contract for data persistence layer
 */
import { Route, CreateRouteDTO, RouteFilters } from '../../domain/entities/Route';

export interface RouteRepository {
  findAll(filters?: RouteFilters): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  create(data: CreateRouteDTO): Promise<Route>;
  setBaseline(routeId: string): Promise<Route>;
  clearAllBaselines(): Promise<void>;
}

