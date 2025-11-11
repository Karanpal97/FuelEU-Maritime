/**
 * Banking Port - Outbound Interface
 */
import { BankRecordsResponse, BankingResult } from '../domain/entities/Banking';

export interface BankingPort {
  getBankRecords(shipId: string, year?: number): Promise<BankRecordsResponse>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult>;
  applyBanked(shipId: string, deficitYear: number, amount: number): Promise<BankingResult>;
}

