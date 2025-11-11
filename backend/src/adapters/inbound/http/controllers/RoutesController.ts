/**
 * Routes Controller - HTTP Inbound Adapter
 */
import { Request, Response } from 'express';
import { RouteRepository } from '../../../../core/ports/outbound/RouteRepository';
import { ComputeComparisonUseCase } from '../../../../core/application/usecases/ComputeComparison';
import { RouteFilters } from '../../../../core/domain/entities/Route';

export class RoutesController {
  constructor(
    private routeRepository: RouteRepository,
    private computeComparisonUseCase: ComputeComparisonUseCase
  ) {}

  getAllRoutes = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: RouteFilters = {
        vesselType: req.query.vesselType as string | undefined,
        fuelType: req.query.fuelType as string | undefined,
        year: req.query.year ? parseInt(req.query.year as string) : undefined,
      };

      const routes = await this.routeRepository.findAll(filters);
      res.json({ success: true, data: routes });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  };

  setBaseline = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;
      const route = await this.routeRepository.setBaseline(routeId);
      res.json({ success: true, data: route, message: `Baseline set to ${routeId}` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  };

  getComparison = async (_req: Request, res: Response): Promise<void> => {
    try {
      const comparison = await this.computeComparisonUseCase.execute();
      res.json({ success: true, data: comparison });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  };
}

