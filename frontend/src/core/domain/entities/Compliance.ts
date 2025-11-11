/**
 * Compliance Entity - Frontend Domain
 */
export interface ComplianceBalance {
  shipId: string;
  year: number;
  cb: number;
  isSurplus: boolean;
  isDeficit: boolean;
}

export interface AdjustedComplianceBalance extends ComplianceBalance {
  cbBefore: number;
  bankedApplied: number;
  cbAfter: number;
  availableBanked?: number;
}

