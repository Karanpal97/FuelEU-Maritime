export interface Pool {
  id: number;
  year: number;
  createdAt: Date;
}

export interface PoolMember {
  id: number;
  poolId: number;
  shipId: string;
  cbBefore: number; // gCO₂eq before pooling
  cbAfter: number; // gCO₂eq after pooling
  allocation: number; // Amount allocated (positive = received, negative = given)
}

export interface CreatePoolDTO {
  year: number;
  members: PoolMemberInput[];
}

export interface PoolMemberInput {
  shipId: string;
  cbBefore: number;
}

export interface PoolValidationResult {
  isValid: boolean;
  errors: string[];
  poolSum: number;
}

export interface PoolResult {
  poolId: number;
  year: number;
  members: PoolMember[];
  totalSurplus: number;
  totalDeficit: number;
  poolSum: number;
}

