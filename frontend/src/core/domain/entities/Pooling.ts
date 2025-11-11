/**
 * Pooling Entity - Frontend Domain
 */
export interface PoolMember {
  id?: number;
  poolId?: number;
  shipId: string;
  cbBefore: number;
  cbAfter?: number;
  allocation?: number;
}

export interface PoolResult {
  poolId: number;
  year: number;
  members: PoolMember[];
  totalSurplus: number;
  totalDeficit: number;
  poolSum: number;
}

export interface PoolValidation {
  isValid: boolean;
  errors: string[];
  poolSum: number;
}

