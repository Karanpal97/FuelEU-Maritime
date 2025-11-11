import { BankingRepository } from '../../ports/outbound/BankingRepository';
import { ComplianceRepository } from '../../ports/outbound/ComplianceRepository';
import { BankSurplusDTO, BankingResult } from '../../domain/entities/Banking';

export class BankSurplusUseCase {
  constructor(
    private bankingRepository: BankingRepository,
    private complianceRepository: ComplianceRepository
  ) {}

  async execute(input: BankSurplusDTO): Promise<BankingResult> {
    const balance = await this.complianceRepository.getBalance(input.shipId, input.year);
    if (!balance) {
      throw new Error(`No compliance balance found for ship ${input.shipId} year ${input.year}`);
    }

    if (balance.cb <= 0) {
      return {
        success: false,
        cbBefore: balance.cb,
        applied: 0,
        cbAfter: balance.cb,
        message: 'Cannot bank negative or zero compliance balance',
      };
    }

    if (input.amountGco2eq > balance.cb) {
      return {
        success: false,
        cbBefore: balance.cb,
        applied: 0,
        cbAfter: balance.cb,
        message: `Requested amount ${input.amountGco2eq} exceeds available balance ${balance.cb}`,
      };
    }

    await this.bankingRepository.create({
      shipId: input.shipId,
      year: input.year,
      amountGco2eq: input.amountGco2eq,
      remainingGco2eq: input.amountGco2eq,
    });

    const newCB = balance.cb - input.amountGco2eq;
    await this.complianceRepository.save({
      shipId: input.shipId,
      year: input.year,
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
      message: 'Successfully banked surplus',
    };
  }
}

