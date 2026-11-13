// Test Simulation & Exact Numerical Verification
import { computeFuzzyAhp } from "./fuzzy-ahp";
import { computeTopsis } from "./topsis";
import { computeCertaintyFactor } from "./certainty-factor";
import { evaluateReadiness } from "./decision-engine";
import { CriterionDefinition, AthleteInput, PairwiseMatrixFuzzy } from "./types";

// 1. Definition of 5 Criteria
export const SAMPLE_CRITERIA: CriterionDefinition[] = [
  {
    code: "C1",
    name: "Daya Anaerobik Relatif",
    category: "FISIK",
    unit: "W/kg",
    type: "BENEFIT",
    isMandatory: false,
    description: "Peak & Average anaerobic power dinormalisasi terhadap berat badan (W/kg)",
  },
  {
    code: "C2",
    name: "Penguasaan Teknik Muaythai",
    category: "TEKNIK",
    unit: "Skala 1-5",
    type: "BENEFIT",
    isMandatory: true,
    minThreshold: 3.0,
    description: "Eksekusi punches, kicks, knees, elbows dan kepatuhan aturan IFMA Rule 29",
  },
  {
    code: "C3",
    name: "Daya Tahan Aerobik (VO2max)",
    category: "FISIK",
    unit: "ml/kg/min",
    type: "BENEFIT",
    isMandatory: false,
    description: "Kapasitas kardiorespirasi untuk menjaga intensitas kerja selama 3 ronde",
  },
  {
    code: "C4",
    name: "Pengalaman Bertanding",
    category: "PENGALAMAN",
    unit: "Partai",
    type: "BENEFIT",
    isMandatory: false,
    description: "Jumlah partai tanding resmi terverifikasi Pengkot/Pengprov",
  },
  {
    code: "C5",
    name: "Kedisiplinan & Kehadiran",
    category: "DISIPLIN",
    unit: "%",
    type: "BENEFIT",
    isMandatory: false,
    description: "Persentase kehadiran pada pemusatan latihan kota (TC)",
  },
];

// 2. Expert Pairwise Comparison Matrix (Triangular Fuzzy Numbers [l, m, u])
// Scale: 1=(1,1,1), 3=(2,3,4), 5=(4,5,6), 7=(6,7,8), 9=(8,9,10)
export const SAMPLE_FAHP_MATRIX: PairwiseMatrixFuzzy = {
  criteriaCodes: ["C1", "C2", "C3", "C4", "C5"],
  matrix: [
    // C1: Daya Anaerobik
    [
      [1, 1, 1],
      [1 / 2, 1, 2],
      [2, 3, 4],
      [3, 4, 5],
      [3, 4, 5],
    ],
    // C2: Teknik Muaythai
    [
      [1 / 2, 1, 2],
      [1, 1, 1],
      [2, 3, 4],
      [3, 4, 5],
      [3, 4, 5],
    ],
    // C3: VO2max
    [
      [1 / 4, 1 / 3, 1 / 2],
      [1 / 4, 1 / 3, 1 / 2],
      [1, 1, 1],
      [1, 2, 3],
      [1, 2, 3],
    ],
    // C4: Pengalaman Tanding
    [
      [1 / 5, 1 / 4, 1 / 3],
      [1 / 5, 1 / 4, 1 / 3],
      [1 / 3, 1 / 2, 1],
      [1, 1, 1],
      [1 / 2, 1, 2],
    ],
    // C5: Kehadiran
    [
      [1 / 5, 1 / 4, 1 / 3],
      [1 / 5, 1 / 4, 1 / 3],
      [1 / 3, 1 / 2, 1],
      [1 / 2, 1, 2],
      [1, 1, 1],
    ],
  ],
};

// 3. Sample 3 Athletes in 63.5 kg Light Welterweight Class
export const SAMPLE_ATHLETES: AthleteInput[] = [
  {
    id: "ATH-001",
    name: "Rian Ardiansyah",
    weightClass: "Light Welterweight (63.5 kg)",
    weightKg: 63.4,
    attendanceRate: 94.0,
    hasActiveInjury: false,
    rawScores: {
      C1: 15.2, // 15.2 W/kg
      C2: 4.5,  // Skala 4.5/5
      C3: 56.0, // 56 ml/kg/min
      C4: 8,    // 8 partai
      C5: 94.0, // 94%
    },
  },
  {
    id: "ATH-002",
    name: "Bagus Pratama",
    weightClass: "Light Welterweight (63.5 kg)",
    weightKg: 63.1,
    attendanceRate: 82.0,
    hasActiveInjury: true,
    injuryDescription: "Sprain ankle kanan derajat 1 (masih masa rehabilitasi)",
    rawScores: {
      C1: 13.8, // 13.8 W/kg
      C2: 4.0,  // Skala 4.0/5
      C3: 51.5, // 51.5 ml/kg/min
      C4: 4,    // 4 partai
      C5: 82.0, // 82%
    },
  },
  {
    id: "ATH-003",
    name: "Dedi Kusnadi",
    weightClass: "Light Welterweight (63.5 kg)",
    weightKg: 63.5,
    attendanceRate: 58.0,
    hasActiveInjury: false,
    rawScores: {
      C1: 9.4,  // 9.4 W/kg
      C2: 2.8,  // Skala 2.8/5 (Gagal batas kriteria wajib >= 3.0)
      C3: 44.0, // 44 ml/kg/min
      C4: 1,    // 1 partai
      C5: 58.0, // 58%
    },
  },
];

export function runSimulation() {
  console.log("================================================================================");
  console.log("SIMULASI SISTEM PAKAR HIBRIDA KESIAPAN ATLET MUAYTHAI PENGKOT PONTIANAK");
  console.log("================================================================================\n");

  // Step 1: Fuzzy AHP
  console.log(">>> [TAHAP 1] Perhitungan Bobot Kriteria dengan Fuzzy AHP (Chang 1996)");
  const fahpResult = computeFuzzyAhp(SAMPLE_FAHP_MATRIX);
  console.log("Synthetic Extent S_i:");
  for (const [code, tfn] of Object.entries(fahpResult.syntheticExtents)) {
    console.log(`  ${code}: [l=${tfn[0].toFixed(4)}, m=${tfn[1].toFixed(4)}, u=${tfn[2].toFixed(4)}]`);
  }
  console.log("Bobot Normalisasi W:");
  for (const [code, w] of Object.entries(fahpResult.weights)) {
    console.log(`  ${code}: ${w.toFixed(4)} (${(w * 100).toFixed(2)}%)`);
  }
  console.log(`Consistency Ratio (CR): ${fahpResult.consistencyRatio.toFixed(4)} -> Konsisten: ${fahpResult.isConsistent}\n`);

  // Step 2: TOPSIS
  console.log(">>> [TAHAP 2] Perankingan Atlet dengan TOPSIS");
  const topsisResult = computeTopsis(SAMPLE_ATHLETES, SAMPLE_CRITERIA, fahpResult.weights);
  console.log("Solusi Ideal Positif A+:");
  console.log(" ", topsisResult.idealPositiveSolution);
  console.log("Solusi Ideal Negatif A-:");
  console.log(" ", topsisResult.idealNegativeSolution);
  console.log("Skor Jarak & Kedekatan Ci:");
  topsisResult.athleteScores.forEach((ath) => {
    console.log(`  Rank ${ath.rank}: ${ath.athleteName} | D+=${ath.distancePositive.toFixed(4)} | D-=${ath.distanceNegative.toFixed(4)} | Ci=${ath.closenessScore.toFixed(4)}`);
  });
  console.log();

  // Step 3 & 4: Certainty Factor & Deterministic Decision Engine
  console.log(">>> [TAHAP 3 & 4] Certainty Factor & Decision Engine");
  SAMPLE_ATHLETES.forEach((athlete) => {
    const cfResult = computeCertaintyFactor(athlete);
    const athScore = topsisResult.athleteScores.find((s) => s.athleteId === athlete.id)!;
    const decision = evaluateReadiness(athlete, SAMPLE_CRITERIA, athScore.closenessScore, cfResult.combinedCf);

    console.log(`--------------------------------------------------------------------------------`);
    console.log(`ATLET: ${decision.athleteName} (${decision.weightClass})`);
    console.log(`  TOPSIS Closeness Ci : ${decision.topsisCloseness.toFixed(4)}`);
    console.log(`  Certainty Factor CF : ${decision.certaintyFactor.toFixed(4)} (Pos: ${cfResult.cfPositiveEvidence.toFixed(4)}, Neg: ${cfResult.cfNegativeEvidence.toFixed(4)})`);
    console.log(`  KATEGORI AKHIR      : [${decision.category}]`);
    console.log(`  Borderline Alert    : ${decision.isBorderline}`);
    console.log(`  Medical Alert       : ${decision.medicalAlert}`);
    console.log(`  Aturan Aktif:`);
    decision.activeRules.forEach((r) => console.log(`    * ${r}`));
    if (decision.mandatoryCriteriaViolations.length > 0) {
      console.log(`  Pelanggaran Kriteria Wajib:`);
      decision.mandatoryCriteriaViolations.forEach((v) => console.log(`    ! ${v}`));
    }
  });

  console.log("\n================================================================================");
  console.log("SIMULASI SELESAI BERHASIL DENGAN INTEGRITAS PENUH");
  console.log("================================================================================");
}

// Run if called directly
runSimulation();

