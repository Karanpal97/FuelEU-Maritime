/**
 * Compliance Entity - Core Domain
 * Represents compliance balance calculations for ships
 */
export interface ShipCompliance {
  id: number;
  shipId: string;
  year: number;
  cbGco2eq: number; // Compliance Balance in gCO₂eq
  targetIntensity: number; // gCO₂e/MJ
  actualIntensity: number; // gCO₂e/MJ
  energyInScope: number; // MJ
  createdAt: Date;
}

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cb: number; // in gCO₂eq
  isSurplus: boolean;
  isDeficit: boolean;
}

export interface AdjustedComplianceBalance extends ComplianceBalance {
  cbBefore: number;
  bankedApplied: number;
  cbAfter: number;
}

