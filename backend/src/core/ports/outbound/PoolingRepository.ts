
import { Pool, PoolMember } from '../../domain/entities/Pooling';

export interface PoolingRepository {
  createPool(year: number): Promise<Pool>;
  addMembers(poolId: number, members: Omit<PoolMember, 'id' | 'poolId'>[]): Promise<PoolMember[]>;
  findPoolsByYear(year: number): Promise<Pool[]>;
  findMembersByPool(poolId: number): Promise<PoolMember[]>;
}

