/**
 * Compute Compliance Balance Use Case
 * Calculates CB = (Target - Actual) × Energy in scope
 */
import { ComplianceRepository } from '../../ports/outbound/ComplianceRepository';
import { RouteRepository } from '../../ports/outbound/RouteRepository';
import { ComplianceBalance } from '../../domain/entities/Compliance';

// Constants from Fuel EU Maritime Regulation
const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ (2% below 91.16)
const ENERGY_CONVERSION_FACTOR = 41000; // MJ per tonne of fuel

export interface ComputeCBInput {
  shipId: string; // Using routeId as shipId for this implementation
  year: number;
}

export class ComputeComplianceBalanceUseCase {
  constructor(
    private complianceRepository: ComplianceRepository,
    private routeRepository: RouteRepository
  ) {}

  async execute(input: ComputeCBInput): Promise<ComplianceBalance> {
    // Find the route (using routeId as shipId)
    const route = await this.routeRepository.findByRouteId(input.shipId);
    if (!route) {
      throw new Error(`Route not found: ${input.shipId}`);
    }

    if (route.year !== input.year) {
      throw new Error(`Route year ${route.year} does not match requested year ${input.year}`);
    }

    // Calculate energy in scope (MJ)
    const energyInScope = route.fuelConsumption * ENERGY_CONVERSION_FACTOR;

    // Calculate compliance balance
    // CB = (Target - Actual) × Energy in scope
    const targetIntensity = TARGET_INTENSITY_2025;
    const actualIntensity = route.ghgIntensity;
    const cbGco2eq = (targetIntensity - actualIntensity) * energyInScope;

    // Save compliance record
    await this.complianceRepository.save({
      shipId: input.shipId,
      year: input.year,
      cbGco2eq,
      targetIntensity,
      actualIntensity,
      energyInScope,
    });

    return {
      shipId: input.shipId,
      year: input.year,
      cb: cbGco2eq,
      isSurplus: cbGco2eq > 0,
      isDeficit: cbGco2eq < 0,
    };
  }

  async getBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const balance = await this.complianceRepository.getBalance(shipId, year);
    if (!balance) {
      // If not computed yet, compute it now
      return this.execute({ shipId, year });
    }
    return balance;
  }
}

