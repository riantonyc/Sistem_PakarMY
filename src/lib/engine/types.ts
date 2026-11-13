// Mathematical and Data Engine Types
// Hybrid Fuzzy AHP - TOPSIS - Certainty Factor

export type TriangularFuzzyNumber = [number, number, number]; // [l, m, u]

export interface CriterionDefinition {
  code: string;           // e.g. "C1", "C2"
  name: string;           // e.g. "Daya Anaerobik Relatif (W/kg)"
  category: "FISIK" | "TEKNIK" | "DISIPLIN" | "PENGALAMAN";
  unit: string;           // "W/kg", "Skala 1-5", "ml/kg/min", "%"
  type: "BENEFIT" | "COST";
  isMandatory: boolean;
  minThreshold?: number;  // Batas ambang minimal jika wajib
  description?: string;
}

export interface PairwiseMatrixFuzzy {
  criteriaCodes: string[];
  matrix: TriangularFuzzyNumber[][];
}

export interface FuzzyAhpResult {
  weights: Record<string, number>;      // Crisp normalized weights { C1: 0.32, C2: 0.28, ... }
  syntheticExtents: Record<string, TriangularFuzzyNumber>;
  possibilityDegrees: Record<string, Record<string, number>>;
  consistencyRatio: number;
  isConsistent: boolean;                // CR < 0.1
}

export interface AthleteInput {
  id: string;
  name: string;
  weightClass: string;
  weightKg: number;
  attendanceRate: number;              // in percent 0 - 100
  hasActiveInjury: boolean;
  injuryDescription?: string;
  injuryNotes?: string;
  rawScores: Record<string, number>;    // { C1: 15.2, C2: 4, C3: 54, ... }
}

export interface TopsisAthleteScore {
  athleteId: string;
  athleteName: string;
  normalizedVector: Record<string, number>;
  weightedVector: Record<string, number>;
  distancePositive: number;            // D+
  distanceNegative: number;            // D-
  closenessScore: number;              // Ci = D- / (D+ + D-)
  rank: number;
}

export interface TopsisResult {
  idealPositiveSolution: Record<string, number>; // A+
  idealNegativeSolution: Record<string, number>; // A-
  athleteScores: TopsisAthleteScore[];
}

export interface CfRuleDefinition {
  ruleCode: string;
  criterionCode?: string;
  conditionDescription: string;
  evaluate: (athlete: AthleteInput) => { isTriggered: boolean; userCertainty: number };
  cfExpert: number;                    // [-1.0 to 1.0]
  hypothesis: "SIAP" | "BELUM_SIAP";
}

export interface TriggeredCfDetail {
  ruleCode: string;
  description: string;
  cfUser: number;
  cfExpert: number;
  cfResult: number;                    // cfUser * cfExpert
}

export interface CertaintyFactorResult {
  athleteId: string;
  combinedCf: number;                  // [-1.0 to 1.0]
  triggeredRules: TriggeredCfDetail[];
  cfPositiveEvidence: number;
  cfNegativeEvidence: number;
}

export type ReadinessDecision = "SIAP" | "SIAP_DENGAN_CATATAN" | "BELUM_SIAP";

export interface FinalReadinessAssessment {
  athleteId: string;
  athleteName: string;
  weightClass: string;
  topsisCloseness: number;              // Ci (0.0 to 1.0)
  certaintyFactor: number;              // CF (-1.0 to 1.0)
  category: ReadinessDecision;
  isBorderline: boolean;
  activeRules: string[];
  mandatoryCriteriaViolations: string[];
  medicalAlert: boolean;
  narrativeExplanation: string;
}
