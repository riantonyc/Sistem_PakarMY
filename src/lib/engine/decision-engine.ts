// Deterministic Decision Engine
// Hybrid Fuzzy AHP - TOPSIS - Certainty Factor
import {
  AthleteInput,
  CriterionDefinition,
  ReadinessDecision,
  FinalReadinessAssessment,
} from "./types";

export interface DecisionEngineConfig {
  thresholdReadyCi: number;           // Default: 0.70 (K-08)
  thresholdConditionalCi: number;     // Default: 0.45 (K-08)
  thresholdReadyCf: number;           // Default: 0.40
  borderlineMargin: number;           // Default: 0.03
  strongNegativeCfThreshold: number;  // Default: -0.50 (K-07)
}

export const DEFAULT_ENGINE_CONFIG: DecisionEngineConfig = {
  thresholdReadyCi: 0.7,
  thresholdConditionalCi: 0.45,
  thresholdReadyCf: 0.4,
  borderlineMargin: 0.03,
  strongNegativeCfThreshold: -0.5,
};

/**
 * Evaluates athlete readiness deterministically
 * Follows K-06, K-07, K-08, K-10 and SRS FR-28 to FR-32
 */
export function evaluateReadiness(
  athlete: AthleteInput,
  criteria: CriterionDefinition[],
  closenessScoreCi: number,
  certaintyFactorCf: number,
  config: DecisionEngineConfig = DEFAULT_ENGINE_CONFIG
): FinalReadinessAssessment {
  const activeRules: string[] = [];
  const mandatoryViolations: string[] = [];
  let category: ReadinessDecision = "BELUM_SIAP";
  let medicalAlert = false;

  // 1. Check Mandatory Criteria (Hard Gates per K-06)
  for (const crit of criteria) {
    if (crit.isMandatory && crit.minThreshold !== undefined) {
      const val = athlete.rawScores[crit.code] || 0;
      if (val < crit.minThreshold) {
        mandatoryViolations.push(
          `Kriteria Wajib [${crit.code}] ${crit.name}: skor ${val} < ambang minimum ${crit.minThreshold}`
        );
      }
    }
  }

  // 2. Initial Matrix Classification (K-08)
  if (
    closenessScoreCi >= config.thresholdReadyCi &&
    certaintyFactorCf >= config.thresholdReadyCf
  ) {
    category = "SIAP";
    activeRules.push(`RULE-01: Ci (${closenessScoreCi.toFixed(3)}) >= ${config.thresholdReadyCi} AND CF (${certaintyFactorCf.toFixed(3)}) >= ${config.thresholdReadyCf}`);
  } else if (
    closenessScoreCi >= config.thresholdConditionalCi &&
    certaintyFactorCf >= 0.0
  ) {
    category = "SIAP_DENGAN_CATATAN";
    activeRules.push(`RULE-02: Ci (${closenessScoreCi.toFixed(3)}) >= ${config.thresholdConditionalCi} AND CF (${certaintyFactorCf.toFixed(3)}) >= 0.0`);
  } else {
    category = "BELUM_SIAP";
    activeRules.push(`RULE-03: Ci (${closenessScoreCi.toFixed(3)}) < ${config.thresholdConditionalCi} OR CF (${certaintyFactorCf.toFixed(3)}) < 0.0`);
  }

  // 3. Conservative CF Override (K-07: CF negatif kuat menurunkan kategori satu tingkat)
  if (certaintyFactorCf <= config.strongNegativeCfThreshold) {
    if (category === "SIAP") {
      category = "SIAP_DENGAN_CATATAN";
      activeRules.push(`RULE-OVERRIDE-CF (K-07): CF negatif kuat (${certaintyFactorCf.toFixed(3)} <= ${config.strongNegativeCfThreshold}) mendowngrade SIAP -> SIAP DENGAN CATATAN`);
    } else if (category === "SIAP_DENGAN_CATATAN") {
      category = "BELUM_SIAP";
      activeRules.push(`RULE-OVERRIDE-CF (K-07): CF negatif kuat (${certaintyFactorCf.toFixed(3)} <= ${config.strongNegativeCfThreshold}) mendowngrade SIAP DENGAN CATATAN -> BELUM SIAP`);
    }
  }

  // 4. Mandatory Criteria Violation Override (K-06)
  if (mandatoryViolations.length > 0) {
    category = "BELUM_SIAP";
    activeRules.push(`RULE-MANDATORY-GATE (K-06): Pelanggaran kriteria wajib mendiskualifikasi kategori menjadi BELUM SIAP`);
  }

  // 5. Active Injury Rule (K-10)
  if (athlete.hasActiveInjury) {
    medicalAlert = true;
    const note = athlete.injuryNotes || athlete.injuryDescription || "Tanpa catatan spesifik";
    activeRules.push(`RULE-INJURY-SAFETY (K-10): Terdeteksi cedera aktif (${note}). Wajib rujukan medis formal.`);
    if (category === "SIAP") {
      category = "SIAP_DENGAN_CATATAN";
    }
  }

  // 6. Borderline Case Detection (FR-32)
  const isBorderline =
    Math.abs(closenessScoreCi - config.thresholdReadyCi) <= config.borderlineMargin ||
    Math.abs(closenessScoreCi - config.thresholdConditionalCi) <= config.borderlineMargin;

  // 7. Deterministic Narrative Explanation Generation (FR-37)
  const narrative = generateDeterministicExplanation(
    athlete,
    closenessScoreCi,
    certaintyFactorCf,
    category,
    activeRules,
    mandatoryViolations,
    medicalAlert
  );

  return {
    athleteId: athlete.id,
    athleteName: athlete.name,
    weightClass: athlete.weightClass,
    topsisCloseness: closenessScoreCi,
    certaintyFactor: certaintyFactorCf,
    category,
    isBorderline,
    activeRules,
    mandatoryCriteriaViolations: mandatoryViolations,
    medicalAlert,
    narrativeExplanation: narrative,
  };
}

/**
 * Generates deterministic narrative explanation (FR-37)
 */
function generateDeterministicExplanation(
  athlete: AthleteInput,
  ci: number,
  cf: number,
  category: ReadinessDecision,
  rules: string[],
  violations: string[],
  medicalAlert: boolean
): string {
  let categoryLabel = "";
  let actionAdvice = "";

  switch (category) {
    case "SIAP":
      categoryLabel = "SIAP (Tingkat Kesiapan Tinggi)";
      actionAdvice =
        "Atlet direkomendasikan masuk roster utama kejuaraan. Pertahankan fase tapering latihan dan kontrol berat badan berkala.";
      break;
    case "SIAP_DENGAN_CATATAN":
      categoryLabel = "SIAP DENGAN CATATAN (Kesiapan Bersyarat)";
      actionAdvice =
        "Atlet memerlukan evaluasi tambahan oleh tim pelatih. Perbaiki parameter fisik/teknis minor sebelum penetapan kontingen final.";
      break;
    case "BELUM_SIAP":
      categoryLabel = "BELUM SIAP (Belum Memenuhi Ambang Kompetisi)";
      actionAdvice =
        "Atlet tidak disarankan diturunkan pada kejuaraan target saat ini guna menghindari risiko cedera berat dan penurunan performa tim.";
      break;
  }

  const parts = [
    `HASIL PENILAIAN KESIAPAN ATLET: ${athlete.name.toUpperCase()} (${athlete.weightClass})`,
    `--------------------------------------------------------------------------------`,
    `Status Klasifikasi : ${categoryLabel}`,
    `Skor Kedekatan Ci  : ${ci.toFixed(4)} (Skala TOPSIS 0.0000 - 1.0000)`,
    `Certainty Factor   : ${cf.toFixed(4)} (Skala Keyakinan Heuristik -1.0000 s/d +1.0000)`,
    `Tingkat Kehadiran  : ${athlete.attendanceRate.toFixed(1)}%`,
    `Kondisi Cedera     : ${medicalAlert ? `PERINGATAN MEDIS: ${athlete.injuryNotes || "Cedera aktif tercatat"}` : "Kondisi Fisik Bebas Cedera Aktif"}`,
    ``,
    `Rekomendasi Operasional:`,
    actionAdvice,
  ];

  if (violations.length > 0) {
    parts.push(``, `Catatan Pelanggaran Kriteria Wajib:`);
    violations.forEach((v) => parts.push(`- ${v}`));
  }

  parts.push(``, `Dasar Aturan yang Aktif:`);
  rules.forEach((r) => parts.push(`- ${r}`));

  return parts.join("\n");
}
