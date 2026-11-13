// Fuzzy AHP Engine (Chang 1996 Extent Analysis & Zhu et al. 1999 Improvements)
import { TriangularFuzzyNumber, PairwiseMatrixFuzzy, FuzzyAhpResult } from "./types";

// Saaty Random Index (RI) table for matrix sizes 1 to 10
const RANDOM_INDEX: Record<number, number> = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

/**
 * Calculates Degree of Possibility V(M2 >= M1)
 * Chang (1996) Equation:
 * If m2 >= m1 => 1
 * If l1 >= u2 => 0
 * Else => (l1 - u2) / ((m2 - u2) - (m1 - l1))
 */
export function calculatePossibilityDegree(
  m2: TriangularFuzzyNumber,
  m1: TriangularFuzzyNumber
): number {
  const [l2, mid2, u2] = m2;
  const [l1, mid1, u1] = m1;

  if (mid2 >= mid1) {
    return 1.0;
  }
  if (l1 >= u2) {
    return 0.0;
  }

  const numerator = l1 - u2;
  const denominator = (mid2 - u2) - (mid1 - l1);

  if (Math.abs(denominator) < 1e-12) {
    return 0.0;
  }

  return Math.max(0.0, Math.min(1.0, numerator / denominator));
}

/**
 * Calculates Saaty's Consistency Ratio (CR) from defuzzified median matrix
 */
export function calculateConsistencyRatio(
  matrix: TriangularFuzzyNumber[][],
  n: number
): { cr: number; isConsistent: boolean; lambdaMax: number } {
  if (n <= 2) {
    return { cr: 0.0, isConsistent: true, lambdaMax: n };
  }

  // Defuzzify matrix using middle values (m)
  const crispMatrix: number[][] = matrix.map((row) => row.map((tfn) => tfn[1]));

  // Calculate column sums
  const colSums = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += crispMatrix[i][j];
    }
  }

  // Normalize columns and calculate priority vector (average of normalized rows)
  const priorityVector = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += crispMatrix[i][j] / colSums[j];
    }
    priorityVector[i] = rowSum / n;
  }

  // Multiply crisp matrix by priority vector: Ax
  const ax = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      ax[i] += crispMatrix[i][j] * priorityVector[j];
    }
  }

  // Calculate lambda max: mean of (Ax)_i / x_i
  let lambdaMax = 0;
  for (let i = 0; i < n; i++) {
    lambdaMax += ax[i] / priorityVector[i];
  }
  lambdaMax /= n;

  // Consistency Index: CI = (lambdaMax - n) / (n - 1)
  const ci = (lambdaMax - n) / (n - 1);
  const ri = RANDOM_INDEX[n] || 1.49;
  const cr = ci / ri;

  return {
    cr: Math.max(0, parseFloat(cr.toFixed(4))),
    isConsistent: cr < 0.1,
    lambdaMax: parseFloat(lambdaMax.toFixed(4)),
  };
}

/**
 * Performs Chang's Extent Analysis for Fuzzy AHP
 */
export function computeFuzzyAhp(pairwiseData: PairwiseMatrixFuzzy): FuzzyAhpResult {
  const { criteriaCodes, matrix } = pairwiseData;
  const n = criteriaCodes.length;

  // 1. Calculate row sums: sum_j M_gi^j = (sum l, sum m, sum u)
  const rowSums: TriangularFuzzyNumber[] = [];
  let totalL = 0;
  let totalM = 0;
  let totalU = 0;

  for (let i = 0; i < n; i++) {
    let rowL = 0;
    let rowM = 0;
    let rowU = 0;
    for (let j = 0; j < n; j++) {
      rowL += matrix[i][j][0];
      rowM += matrix[i][j][1];
      rowU += matrix[i][j][2];
    }
    rowSums.push([rowL, rowM, rowU]);
    totalL += rowL;
    totalM += rowM;
    totalU += rowU;
  }

  // 2. Compute Fuzzy Synthetic Extent: S_i = rowSum_i (x) [totalSum]^-1
  // [totalSum]^-1 = (1 / totalU, 1 / totalM, 1 / totalL)
  const syntheticExtents: Record<string, TriangularFuzzyNumber> = {};
  const sList: TriangularFuzzyNumber[] = [];

  for (let i = 0; i < n; i++) {
    const s_i: TriangularFuzzyNumber = [
      rowSums[i][0] / totalU,
      rowSums[i][1] / totalM,
      rowSums[i][2] / totalL,
    ];
    syntheticExtents[criteriaCodes[i]] = s_i;
    sList.push(s_i);
  }

  // 3. Compute Degree of Possibility V(S_i >= S_k)
  const possibilityDegrees: Record<string, Record<string, number>> = {};
  const minVVector: number[] = [];

  for (let i = 0; i < n; i++) {
    possibilityDegrees[criteriaCodes[i]] = {};
    let minV = 1.0;

    for (let k = 0; k < n; k++) {
      if (i === k) continue;
      const v = calculatePossibilityDegree(sList[i], sList[k]);
      possibilityDegrees[criteriaCodes[i]][criteriaCodes[k]] = parseFloat(v.toFixed(4));
      if (v < minV) {
        minV = v;
      }
    }
    // Zhu et al. (1999) improvement: apply epsilon floor (0.05) to eliminate zero-weight flaw
    const effectiveMinV = Math.max(minV, 0.05);
    minVVector.push(effectiveMinV);
  }

  // 4. Normalize weight vector W: w_i = d'(A_i) / sum(d'(A_k))
  const sumMinV = minVVector.reduce((acc, curr) => acc + curr, 0);
  const weights: Record<string, number> = {};

  if (sumMinV <= 0) {
    // Fallback if all possibilities are 0 (equal weights)
    const equalW = 1.0 / n;
    criteriaCodes.forEach((code) => {
      weights[code] = parseFloat(equalW.toFixed(4));
    });
  } else {
    for (let i = 0; i < n; i++) {
      const normalizedW = minVVector[i] / sumMinV;
      weights[criteriaCodes[i]] = parseFloat(normalizedW.toFixed(4));
    }
  }

  // 5. Check Consistency
  const consistency = calculateConsistencyRatio(matrix, n);

  return {
    weights,
    syntheticExtents,
    possibilityDegrees,
    consistencyRatio: consistency.cr,
    isConsistent: consistency.isConsistent,
  };
}

