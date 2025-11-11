import { PrismaClient } from '@prisma/client';
import { PoolingRepository } from '../../../core/ports/outbound/PoolingRepository';
import { Pool, PoolMember } from '../../../core/domain/entities/Pooling';

export class PostgresPoolingRepository implements PoolingRepository {
  constructor(private prisma: PrismaClient) {}

  async createPool(year: number): Promise<Pool> {
    const pool = await this.prisma.pool.create({
      data: { year },
    });
    return this.mapPoolToEntity(pool);
  }

  async addMembers(poolId: number, members: Omit<PoolMember, 'id' | 'poolId'>[]): Promise<PoolMember[]> {
    const created = await this.prisma.$transaction(
      members.map((member) =>
        this.prisma.poolMember.create({
          data: {
            poolId,
            shipId: member.shipId,
            cbBefore: member.cbBefore,
            cbAfter: member.cbAfter,
            allocation: member.allocation,
          },
        })
      )
    );
    return created.map(this.mapMemberToEntity);
  }

  async findPoolsByYear(year: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { year },
      orderBy: { createdAt: 'desc' },
    });
    return pools.map(this.mapPoolToEntity);
  }

  async findMembersByPool(poolId: number): Promise<PoolMember[]> {
    const members = await this.prisma.poolMember.findMany({
      where: { poolId },
      orderBy: { id: 'asc' },
    });
    return members.map(this.mapMemberToEntity);
  }

  private mapPoolToEntity(row: any): Pool {
    return {
      id: row.id,
      year: row.year,
      createdAt: row.createdAt,
    };
  }

  private mapMemberToEntity(row: any): PoolMember {
    return {
      id: row.id,
      poolId: row.poolId,
      shipId: row.shipId,
      cbBefore: parseFloat(row.cbBefore.toString()),
      cbAfter: parseFloat(row.cbAfter.toString()),
      allocation: parseFloat(row.allocation.toString()),
    };
  }
}

