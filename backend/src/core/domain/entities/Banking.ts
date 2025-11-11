
export interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  remainingGco2eq: number; // Remaining amount available
  createdAt: Date;
  expiresAt?: Date; // Optional expiration
}

export interface BankSurplusDTO {
  shipId: string;
  year: number;
  amountGco2eq: number;
}

export interface ApplyBankedDTO {
  shipId: string;
  deficitYear: number;
  amountGco2eq: number;
}

export interface BankingResult {
  success: boolean;
  cbBefore: number;
  applied: number;
  cbAfter: number;
  message?: string;
}

