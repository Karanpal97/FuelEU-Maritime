/**
 * Create Pool Use Case
 * Article 21 - Pooling of compliance balances
 */
import { PoolingRepository } from '../../ports/outbound/PoolingRepository';
import { ComplianceRepository } from '../../ports/outbound/ComplianceRepository';
import { CreatePoolDTO, PoolResult, PoolValidationResult, PoolMember } from '../../domain/entities/Pooling';

export class CreatePoolUseCase {
  constructor(
    private poolingRepository: PoolingRepository,
    private complianceRepository: ComplianceRepository
  ) {}

  /**
   * Validate pool before creation
   */
  async validate(input: CreatePoolDTO): Promise<PoolValidationResult> {
    const errors: string[] = [];
    
    // Calculate pool sum
    const poolSum = input.members.reduce((sum, m) => sum + m.cbBefore, 0);

    // Rule 1: Pool sum must be >= 0
    if (poolSum < 0) {
      errors.push('Pool sum is negative. Total deficits exceed total surplus.');
    }

    // Validate individual members
    for (const member of input.members) {
      // Rule 2: Deficit ship cannot exit worse
      if (member.cbBefore < 0) {
        // Will be checked after allocation
      }
      
      // Rule 3: Surplus ship cannot exit negative
      if (member.cbBefore > 0) {
        // Will be checked after allocation
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      poolSum,
    };
  }

  /**
   * Greedy allocation algorithm
   * Sorts members by CB descending, transfers from surplus to deficit
   */
  private allocate(members: { shipId: string; cbBefore: number }[]): PoolMember[] {
    // Sort by CB descending (surplus first)
    const sorted = [...members].sort((a, b) => b.cbBefore - a.cbBefore);
    
    const result: Omit<PoolMember, 'id' | 'poolId'>[] = sorted.map(m => ({
      shipId: m.shipId,
      cbBefore: m.cbBefore,
      cbAfter: m.cbBefore,
      allocation: 0,
    }));

    // Greedy allocation: transfer from surplus to deficit
    let i = 0; // surplus pointer
    let j = result.length - 1; // deficit pointer

    while (i < j) {
      // Skip ships with no surplus/deficit
      while (i < j && result[i].cbAfter <= 0) i++;
      while (i < j && result[j].cbAfter >= 0) j--;
      
      if (i >= j) break;

      // Transfer from i to j
      const surplus = result[i].cbAfter;
      const deficit = -result[j].cbAfter;
      const transfer = Math.min(surplus, deficit);

      result[i].cbAfter -= transfer;
      result[i].allocation -= transfer;
      result[j].cbAfter += transfer;
      result[j].allocation += transfer;
    }

    return result as PoolMember[];
  }

  async execute(input: CreatePoolDTO): Promise<PoolResult> {
    // Validate pool
    const validation = await this.validate(input);
    if (!validation.isValid) {
      throw new Error(`Pool validation failed: ${validation.errors.join(', ')}`);
    }

    // Perform allocation
    const allocated = this.allocate(input.members);

    // Additional validation after allocation
    for (const member of allocated) {
      // Rule 2: Deficit ship cannot exit worse
      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
        throw new Error(`Ship ${member.shipId} would exit worse after pooling`);
      }
      
      // Rule 3: Surplus ship cannot exit negative
      if (member.cbBefore > 0 && member.cbAfter < 0) {
        throw new Error(`Surplus ship ${member.shipId} would exit negative after pooling`);
      }
    }

    // Create pool
    const pool = await this.poolingRepository.createPool(input.year);
    const members = await this.poolingRepository.addMembers(pool.id, allocated);

    // Update compliance balances
    for (const member of members) {
      await this.complianceRepository.save({
        shipId: member.shipId,
        year: input.year,
        cbGco2eq: member.cbAfter,
        targetIntensity: 89.3368,
        actualIntensity: 0,
        energyInScope: 0,
      });
    }

    const totalSurplus = input.members.filter(m => m.cbBefore > 0).reduce((sum, m) => sum + m.cbBefore, 0);
    const totalDeficit = input.members.filter(m => m.cbBefore < 0).reduce((sum, m) => sum + m.cbBefore, 0);

    return {
      poolId: pool.id,
      year: input.year,
      members,
      totalSurplus,
      totalDeficit,
      poolSum: validation.poolSum,
    };
  }
}

