/**
 * Banking API Adapter - Infrastructure
 */
import { BankingPort } from '@/core/ports/BankingPort';
import { BankRecordsResponse, BankingResult } from '@/core/domain/entities/Banking';
import { apiClient } from './apiClient';

export class BankingApiAdapter implements BankingPort {
  async getBankRecords(shipId: string, year?: number): Promise<BankRecordsResponse> {
    const params: Record<string, string> = { shipId };
    if (year) params.year = year.toString();
    return apiClient.get<BankRecordsResponse>('/banking/records', params);
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult> {
    return apiClient.post<BankingResult>('/banking/bank', {
      shipId,
      year,
      amountGco2eq: amount,
    });
  }

  async applyBanked(shipId: string, deficitYear: number, amount: number): Promise<BankingResult> {
    return apiClient.post<BankingResult>('/banking/apply', {
      shipId,
      deficitYear,
      amountGco2eq: amount,
    });
  }
}

