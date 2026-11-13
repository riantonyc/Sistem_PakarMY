// TOPSIS Engine (Technique for Order Preference by Similarity to Ideal Solution)
// Hwang & Yoon (1981) with Vector Normalization
import { AthleteInput, CriterionDefinition, TopsisResult, TopsisAthleteScore } from "./types";

/**
 * Computes TOPSIS ranking for athletes given criteria and weights
 */
export function computeTopsis(
  athletes: AthleteInput[],
  criteria: CriterionDefinition[],
  weights: Record<string, number>
): TopsisResult {
  const m = athletes.length;
  const n = criteria.length;

  if (m === 0) {
    return {
      idealPositiveSolution: {},
      idealNegativeSolution: {},
      athleteScores: [],
    };
  }

  // 1. Calculate denominator for vector normalization for each criterion: sqrt(sum(x_ij^2))
  const denomMap: Record<string, number> = {};
  for (const crit of criteria) {
    let sumSq = 0;
    for (const ath of athletes) {
      const val = ath.rawScores[crit.code] || 0;
      sumSq += val * val;
    }
    denomMap[crit.code] = Math.sqrt(sumSq);
  }

  // 2. Compute normalized matrix (r_ij) and weighted matrix (y_ij)
  const normalizedRecords: Record<string, Record<string, number>> = {};
  const weightedRecords: Record<string, Record<string, number>> = {};

  for (const ath of athletes) {
    normalizedRecords[ath.id] = {};
    weightedRecords[ath.id] = {};

    for (const crit of criteria) {
      const val = ath.rawScores[crit.code] || 0;
      const denom = denomMap[crit.code];
      const r_ij = denom > 0 ? val / denom : 0;
      const w_j = weights[crit.code] || 0;
      const y_ij = r_ij * w_j;

      normalizedRecords[ath.id][crit.code] = parseFloat(r_ij.toFixed(5));
      weightedRecords[ath.id][crit.code] = parseFloat(y_ij.toFixed(5));
    }
  }

  // 3. Determine Positive Ideal Solution (A+) and Negative Ideal Solution (A-)
  const idealPositive: Record<string, number> = {};
  const idealNegative: Record<string, number> = {};

  for (const crit of criteria) {
    const values = athletes.map((ath) => weightedRecords[ath.id][crit.code]);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    if (crit.type === "BENEFIT") {
      idealPositive[crit.code] = maxVal;
      idealNegative[crit.code] = minVal;
    } else {
      // COST criterion
      idealPositive[crit.code] = minVal;
      idealNegative[crit.code] = maxVal;
    }
  }

  // 4. Compute Euclidean Distances D+ and D- and Closeness Coefficient C_i
  const athleteScores: TopsisAthleteScore[] = [];

  for (const ath of athletes) {
    let sumSqPos = 0;
    let sumSqNeg = 0;

    for (const crit of criteria) {
      const y_ij = weightedRecords[ath.id][crit.code];
      const aPos = idealPositive[crit.code];
      const aNeg = idealNegative[crit.code];

      sumSqPos += Math.pow(y_ij - aPos, 2);
      sumSqNeg += Math.pow(y_ij - aNeg, 2);
    }

    const dPos = Math.sqrt(sumSqPos);
    const dNeg = Math.sqrt(sumSqNeg);
    const totalDist = dPos + dNeg;
    const c_i = totalDist > 0 ? dNeg / totalDist : 0.0;

    athleteScores.push({
      athleteId: ath.id,
      athleteName: ath.name,
      normalizedVector: normalizedRecords[ath.id],
      weightedVector: weightedRecords[ath.id],
      distancePositive: parseFloat(dPos.toFixed(4)),
      distanceNegative: parseFloat(dNeg.toFixed(4)),
      closenessScore: parseFloat(c_i.toFixed(4)),
      rank: 0, // Assigned below
    });
  }

  // 5. Rank athletes in descending order of closeness score C_i
  athleteScores.sort((a, b) => b.closenessScore - a.closenessScore);
  athleteScores.forEach((score, index) => {
    score.rank = index + 1;
  });

  return {
    idealPositiveSolution: idealPositive,
    idealNegativeSolution: idealNegative,
    athleteScores,
  };
}

