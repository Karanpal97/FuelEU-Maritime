/**
 * Pooling Port - Outbound Interface
 */
import { PoolMember, PoolResult } from '../domain/entities/Pooling';

export interface PoolingPort {
  createPool(year: number, members: PoolMember[]): Promise<PoolResult>;
}

