/**
 * Compute Comparison Use Case
 * Compares routes against baseline with target intensity
 */
import { RouteRepository } from '../../ports/outbound/RouteRepository';
import { ComparisonResult, RouteComparison } from '../../domain/entities/Comparison';

// Target for 2025: 2% below 91.16 = 89.3368 gCO₂e/MJ
const TARGET_INTENSITY_2025 = 89.3368;

export class ComputeComparisonUseCase {
  constructor(private routeRepository: RouteRepository) {}

  async execute(): Promise<ComparisonResult> {
    // Find baseline route
    const baselineRoute = await this.routeRepository.findBaseline();
    if (!baselineRoute) {
      throw new Error('No baseline route found. Please set a baseline first.');
    }

    // Get all routes for comparison
    const allRoutes = await this.routeRepository.findAll();

    const baseline: RouteComparison = {
      routeId: baselineRoute.routeId,
      vesselType: baselineRoute.vesselType,
      fuelType: baselineRoute.fuelType,
      year: baselineRoute.year,
      ghgIntensity: baselineRoute.ghgIntensity,
      isBaseline: true,
      compliant: baselineRoute.ghgIntensity <= TARGET_INTENSITY_2025,
      targetIntensity: TARGET_INTENSITY_2025,
    };

    const comparisons: RouteComparison[] = allRoutes
      .filter(route => !route.isBaseline)
      .map(route => {
        const percentDiff = ((route.ghgIntensity / baselineRoute.ghgIntensity) - 1) * 100;
        return {
          routeId: route.routeId,
          vesselType: route.vesselType,
          fuelType: route.fuelType,
          year: route.year,
          ghgIntensity: route.ghgIntensity,
          isBaseline: false,
          percentDiff,
          compliant: route.ghgIntensity <= TARGET_INTENSITY_2025,
          targetIntensity: TARGET_INTENSITY_2025,
        };
      });

    return {
      baseline,
      comparisons,
      targetIntensity: TARGET_INTENSITY_2025,
    };
  }
}

