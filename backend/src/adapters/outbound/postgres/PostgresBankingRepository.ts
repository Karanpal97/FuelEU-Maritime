import { PrismaClient } from '@prisma/client';
import { BankingRepository } from '../../../core/ports/outbound/BankingRepository';
import { BankEntry } from '../../../core/domain/entities/Banking';

export class PostgresBankingRepository implements BankingRepository {
  constructor(private prisma: PrismaClient) {}

  async findByShip(shipId: string): Promise<BankEntry[]> {
    const entries = await this.prisma.bankEntry.findMany({
      where: {
        shipId,
        remainingGco2eq: { gt: 0 },
      },
      orderBy: { createdAt: 'asc' },
    });
    return entries.map(this.mapToEntity);
  }

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const entries = await this.prisma.bankEntry.findMany({
      where: {
        shipId,
        year,
      },
      orderBy: { createdAt: 'asc' },
    });
    return entries.map(this.mapToEntity);
  }

  async findAvailableBalance(shipId: string): Promise<number> {
    const result = await this.prisma.bankEntry.aggregate({
      where: { shipId },
      _sum: { remainingGco2eq: true },
    });
    return result._sum.remainingGco2eq ? parseFloat(result._sum.remainingGco2eq.toString()) : 0;
  }

  async create(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry> {
    const created = await this.prisma.bankEntry.create({
      data: {
        shipId: entry.shipId,
        year: entry.year,
        amountGco2eq: entry.amountGco2eq,
        remainingGco2eq: entry.remainingGco2eq,
        expiresAt: entry.expiresAt,
      },
    });
    return this.mapToEntity(created);
  }

  async updateRemaining(id: number, remaining: number): Promise<void> {
    await this.prisma.bankEntry.update({
      where: { id },
      data: { remainingGco2eq: remaining },
    });
  }

  private mapToEntity(row: any): BankEntry {
    return {
      id: row.id,
      shipId: row.shipId,
      year: row.year,
      amountGco2eq: parseFloat(row.amountGco2eq.toString()),
      remainingGco2eq: parseFloat(row.remainingGco2eq.toString()),
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
    };
  }
}

