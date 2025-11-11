import { BankingRepository } from '../../ports/outbound/BankingRepository';
import { ComplianceRepository } from '../../ports/outbound/ComplianceRepository';
import { ApplyBankedDTO, BankingResult } from '../../domain/entities/Banking';

export class ApplyBankedUseCase {
  constructor(
    private bankingRepository: BankingRepository,
    private complianceRepository: ComplianceRepository
  ) {}

  async execute(input: ApplyBankedDTO): Promise<BankingResult> {
    const balance = await this.complianceRepository.getBalance(input.shipId, input.deficitYear);
    if (!balance) {
      throw new Error(`No compliance balance found for ship ${input.shipId} year ${input.deficitYear}`);
    }

    const availableBanked = await this.bankingRepository.findAvailableBalance(input.shipId);
    if (availableBanked <= 0) {
      return {
        success: false,
        cbBefore: balance.cb,
        applied: 0,
        cbAfter: balance.cb,
        message: 'No banked surplus available',
      };
    }

    if (input.amountGco2eq > availableBanked) {
      return {
        success: false,
        cbBefore: balance.cb,
        applied: 0,
        cbAfter: balance.cb,
        message: `Requested amount ${input.amountGco2eq} exceeds available banked ${availableBanked}`,
      };
    }

    const newCB = balance.cb + input.amountGco2eq;

    const bankEntries = await this.bankingRepository.findByShip(input.shipId);
    let remaining = input.amountGco2eq;
    
    for (const entry of bankEntries) {
      if (remaining <= 0) break;
      if (entry.remainingGco2eq <= 0) continue;

      const toDeduct = Math.min(remaining, entry.remainingGco2eq);
      await this.bankingRepository.updateRemaining(entry.id, entry.remainingGco2eq - toDeduct);
      remaining -= toDeduct;
    }

    await this.complianceRepository.save({
      shipId: input.shipId,
      year: input.deficitYear,
      cbGco2eq: newCB,
      targetIntensity: 89.3368,
      actualIntensity: 0,
      energyInScope: 0,
    });

    return {
      success: true,
      cbBefore: balance.cb,
      applied: input.amountGco2eq,
      cbAfter: newCB,
      message: 'Successfully applied banked surplus',
    };
  }
}

