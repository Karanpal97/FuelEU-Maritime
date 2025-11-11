/**
 * Banking Entity - Core Domain
 * Article 20 - Banking of surplus compliance balance
 */
export interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  amountGco2eq: number; // Banked amount in gCO₂eq
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

