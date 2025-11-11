/**
 * Banking Entity - Frontend Domain
 */
export interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  remainingGco2eq: number;
  createdAt: string;
  expiresAt?: string;
}

export interface BankRecordsResponse {
  records: BankEntry[];
  totalAvailable: number;
}

export interface BankingResult {
  success: boolean;
  cbBefore: number;
  applied: number;
  cbAfter: number;
  message?: string;
}

