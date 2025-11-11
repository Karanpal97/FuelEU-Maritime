import { Request, Response } from 'express';
import { ComputeComplianceBalanceUseCase } from '../../../../core/application/usecases/ComputeComplianceBalance';
import { BankingRepository } from '../../../../core/ports/outbound/BankingRepository';

export class ComplianceController {
  constructor(
    private computeCBUseCase: ComputeComplianceBalanceUseCase,
    private bankingRepository: BankingRepository
  ) {}

  getComplianceBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        res.status(400).json({ success: false, error: 'shipId and year are required' });
        return;
      }

      const balance = await this.computeCBUseCase.getBalance(
        shipId as string,
        parseInt(year as string)
      );

      if (!balance) {
        res.status(404).json({ success: false, error: 'Compliance balance not found' });
        return;
      }

      res.json({ success: true, data: balance });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  };

  getAdjustedBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        res.status(400).json({ success: false, error: 'shipId and year are required' });
        return;
      }

      const balance = await this.computeCBUseCase.getBalance(
        shipId as string,
        parseInt(year as string)
      );

      if (!balance) {
        res.status(404).json({ success: false, error: 'Compliance balance not found' });
        return;
      }

      const bankedApplied = 0;
      const availableBanked = await this.bankingRepository.findAvailableBalance(shipId as string);

      const adjustedBalance = {
        ...balance,
        cbBefore: balance.cb,
        bankedApplied,
        cbAfter: balance.cb,
        availableBanked,
      };

      res.json({ success: true, data: adjustedBalance });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  };
}

