// Certainty Factor Engine (Shortliffe & Buchanan MYCIN Model)
import { AthleteInput, CertaintyFactorResult, TriggeredCfDetail } from "./types";

/**
 * Combines two Certainty Factor values following the MYCIN formulation
 */
export function combineTwoCf(cf1: number, cf2: number): number {
  // Case 1: Both positive
  if (cf1 > 0 && cf2 > 0) {
    return cf1 + cf2 * (1 - cf1);
  }
  // Case 2: Both negative
  if (cf1 < 0 && cf2 < 0) {
    return cf1 + cf2 * (1 + cf1);
  }
  // Case 3: One positive and one negative (opposite signs)
  const minAbs = Math.min(Math.abs(cf1), Math.abs(cf2));
  if (minAbs >= 1.0) {
    return 0.0; // Perfect conflict resolves to neutral
  }
  return (cf1 + cf2) / (1 - minAbs);
}

/**
 * Standard Expert CF Rules for Muaythai Athlete Readiness (Pengkot Pontianak)
 * Based on Catatan Pakar Berbasis Literatur
 */
export const DEFAULT_CF_RULES = [
  {
    code: "CF-R01",
    description: "Kehadiran latihan >= 80% membuktikan disiplin & komitmen persiapan",
    evaluate: (ath: AthleteInput) => ({
      isTriggered: ath.attendanceRate >= 80.0,
      userCertainty: 1.0,
    }),
    cfExpert: 0.6,
  },
  {
    code: "CF-R02",
    description: "Kehadiran latihan di bawah 60% menunjukkan minimnya adaptasi fisik kompetisi",
    evaluate: (ath: AthleteInput) => ({
      isTriggered: ath.attendanceRate < 60.0,
      userCertainty: 1.0,
    }),
    cfExpert: -0.5,
  },
  {
    code: "CF-R03",
    description: "Laporan cedera aktif (K-10) sangat mereduksi kesiapan tanding",
    evaluate: (ath: AthleteInput) => ({
      isTriggered: ath.hasActiveInjury,
      userCertainty: 1.0,
    }),
    cfExpert: -0.7,
  },
  {
    code: "CF-R04",
    description: "Daya anaerobik relatif tinggi (>= 14 W/kg) menjamin output strike eksplosif",
    evaluate: (ath: AthleteInput) => ({
      isTriggered: (ath.rawScores["C1"] || 0) >= 14.0,
      userCertainty: 1.0,
    }),
    cfExpert: 0.55,
  },
  {
    code: "CF-R05",
    description: "Daya anaerobik relatif rendah (< 10 W/kg) rentan kelelahan & penurunan proteksi",
    evaluate: (ath: AthleteInput) => ({
      isTriggered: (ath.rawScores["C1"] || 0) > 0 && (ath.rawScores["C1"] || 0) < 10.0,
      userCertainty: 1.0,
    }),
    cfExpert: -0.6,
  },
  {
    code: "CF-R06",
    description: "Penguasaan teknik Muaythai mumpuni (skor >= 4.0 / 5) mendukung kepatuhan aturan IFMA",
    evaluate: (ath: AthleteInput) => ({
      isTriggered: (ath.rawScores["C2"] || 0) >= 4.0,
      userCertainty: 1.0,
    }),
    cfExpert: 0.5,
  },
  {
    code: "CF-R07",
    description: "Daya tahan aerobik (VO2max >= 52 ml/kg/min) menjaga ritme hingga ronde ketiga",
    evaluate: (ath: AthleteInput) => ({
      isTriggered: (ath.rawScores["C3"] || 0) >= 52.0,
      userCertainty: 1.0,
    }),
    cfExpert: 0.45,
  },
  {
    code: "CF-R08",
    description: "Pengalaman bertanding kompetitif (>= 5 partai resmi) memitigasi demam panggung",
    evaluate: (ath: AthleteInput) => ({
      isTriggered: (ath.rawScores["C4"] || 0) >= 5,
      userCertainty: 1.0,
    }),
    cfExpert: 0.4,
  },
];

/**
 * Computes Combined Certainty Factor for an athlete across all active rules
 */
export function computeCertaintyFactor(
  athlete: AthleteInput,
  rules = DEFAULT_CF_RULES
): CertaintyFactorResult {
  const triggeredRules: TriggeredCfDetail[] = [];
  let combined = 0.0;
  let isFirst = true;

  let posSum = 0;
  let negSum = 0;

  for (const rule of rules) {
    const { isTriggered, userCertainty } = rule.evaluate(athlete);

    if (isTriggered) {
      const cfRuleVal = parseFloat((userCertainty * rule.cfExpert).toFixed(4));
      triggeredRules.push({
        ruleCode: rule.code,
        description: rule.description,
        cfUser: userCertainty,
        cfExpert: rule.cfExpert,
        cfResult: cfRuleVal,
      });

      if (cfRuleVal > 0) {
        posSum = isFirst ? cfRuleVal : combineTwoCf(posSum, cfRuleVal);
      } else {
        negSum = isFirst ? cfRuleVal : combineTwoCf(negSum, cfRuleVal);
      }

      if (isFirst) {
        combined = cfRuleVal;
        isFirst = false;
      } else {
        combined = combineTwoCf(combined, cfRuleVal);
      }
    }
  }

  // Constrain to [-1.0, 1.0]
  combined = Math.max(-1.0, Math.min(1.0, combined));

  return {
    athleteId: athlete.id,
    combinedCf: parseFloat(combined.toFixed(4)),
    triggeredRules,
    cfPositiveEvidence: parseFloat(posSum.toFixed(4)),
    cfNegativeEvidence: parseFloat(negSum.toFixed(4)),
  };
}

