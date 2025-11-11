/**
 * Pooling API Adapter - Infrastructure
 */
import { PoolingPort } from '@/core/ports/PoolingPort';
import { PoolMember, PoolResult } from '@/core/domain/entities/Pooling';
import { apiClient } from './apiClient';

export class PoolingApiAdapter implements PoolingPort {
  async createPool(year: number, members: PoolMember[]): Promise<PoolResult> {
    return apiClient.post<PoolResult>('/pools', {
      year,
      members,
    });
  }
}

