import { PrismaClient } from '@prisma/client';
import { RouteRepository } from '../../../core/ports/outbound/RouteRepository';
import { Route, CreateRouteDTO, RouteFilters } from '../../../core/domain/entities/Route';

export class PostgresRouteRepository implements RouteRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters?: RouteFilters): Promise<Route[]> {
    const routes = await this.prisma.route.findMany({
      where: {
        ...(filters?.vesselType && { vesselType: filters.vesselType }),
        ...(filters?.fuelType && { fuelType: filters.fuelType }),
        ...(filters?.year && { year: filters.year }),
      },
      orderBy: [
        { year: 'desc' },
        { routeId: 'asc' },
      ],
    });

    return routes.map(this.mapToEntity);
  }

  async findById(id: number): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { id },
    });
    return route ? this.mapToEntity(route) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({
      where: { routeId },
    });
    return route ? this.mapToEntity(route) : null;
  }

  async findBaseline(): Promise<Route | null> {
    const route = await this.prisma.route.findFirst({
      where: { isBaseline: true },
    });
    return route ? this.mapToEntity(route) : null;
  }

  async create(data: CreateRouteDTO): Promise<Route> {
    const route = await this.prisma.route.create({
      data: {
        routeId: data.routeId,
        vesselType: data.vesselType,
        fuelType: data.fuelType,
        year: data.year,
        ghgIntensity: data.ghgIntensity,
        fuelConsumption: data.fuelConsumption,
        distance: data.distance,
        totalEmissions: data.totalEmissions,
        isBaseline: data.isBaseline || false,
      },
    });
    return this.mapToEntity(route);
  }

  async setBaseline(routeId: string): Promise<Route> {
    // First, clear all baselines
    await this.clearAllBaselines();
    
    // Set the new baseline
    const route = await this.prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });
    
    if (!route) {
      throw new Error(`Route ${routeId} not found`);
    }
    
    return this.mapToEntity(route);
  }

  async clearAllBaselines(): Promise<void> {
    await this.prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false },
    });
  }

  private mapToEntity(row: any): Route {
    return {
      id: row.id,
      routeId: row.routeId,
      vesselType: row.vesselType,
      fuelType: row.fuelType,
      year: row.year,
      ghgIntensity: parseFloat(row.ghgIntensity.toString()),
      fuelConsumption: parseFloat(row.fuelConsumption.toString()),
      distance: parseFloat(row.distance.toString()),
      totalEmissions: parseFloat(row.totalEmissions.toString()),
      isBaseline: row.isBaseline,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

