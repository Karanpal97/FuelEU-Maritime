import { PrismaClient } from '@prisma/client';
import { ComplianceRepository } from '../../../core/ports/outbound/ComplianceRepository';
import { ShipCompliance, ComplianceBalance } from '../../../core/domain/entities/Compliance';

export class PostgresComplianceRepository implements ComplianceRepository {
  constructor(private prisma: PrismaClient) {}

  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    const compliance = await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: {
          shipId,
          year,
        },
      },
    });
    return compliance ? this.mapToEntity(compliance) : null;
  }

  async save(compliance: Omit<ShipCompliance, 'id' | 'createdAt'>): Promise<ShipCompliance> {
    const saved = await this.prisma.shipCompliance.upsert({
      where: {
        shipId_year: {
          shipId: compliance.shipId,
          year: compliance.year,
        },
      },
      update: {
        cbGco2eq: compliance.cbGco2eq,
        targetIntensity: compliance.targetIntensity,
        actualIntensity: compliance.actualIntensity,
        energyInScope: compliance.energyInScope,
      },
      create: {
        shipId: compliance.shipId,
        year: compliance.year,
        cbGco2eq: compliance.cbGco2eq,
        targetIntensity: compliance.targetIntensity,
        actualIntensity: compliance.actualIntensity,
        energyInScope: compliance.energyInScope,
      },
    });
    return this.mapToEntity(saved);
  }

  async getBalance(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const compliance = await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: {
          shipId,
          year,
        },
      },
      select: {
        shipId: true,
        year: true,
        cbGco2eq: true,
      },
    });
    
    if (!compliance) {
      return null;
    }

    const cb = parseFloat(compliance.cbGco2eq.toString());

    return {
      shipId: compliance.shipId,
      year: compliance.year,
      cb,
      isSurplus: cb > 0,
      isDeficit: cb < 0,
    };
  }

  private mapToEntity(row: any): ShipCompliance {
    return {
      id: row.id,
      shipId: row.shipId,
      year: row.year,
      cbGco2eq: parseFloat(row.cbGco2eq.toString()),
      targetIntensity: parseFloat(row.targetIntensity.toString()),
      actualIntensity: parseFloat(row.actualIntensity.toString()),
      energyInScope: parseFloat(row.energyInScope.toString()),
      createdAt: row.createdAt,
    };
  }
}

