import { NextResponse } from "next/server";
import { computeFuzzyAhp } from "@/lib/engine/fuzzy-ahp";
import { computeTopsis } from "@/lib/engine/topsis";
import { computeCertaintyFactor } from "@/lib/engine/certainty-factor";
import { evaluateReadiness } from "@/lib/engine/decision-engine";
import {
  SAMPLE_CRITERIA,
  SAMPLE_FAHP_MATRIX,
  SAMPLE_ATHLETES,
} from "@/lib/engine/test-simulation";
import { AthleteInput } from "@/lib/engine/types";

export async function GET() {
  try {
    // 1. Compute Fuzzy AHP Weights
    const fahpResult = computeFuzzyAhp(SAMPLE_FAHP_MATRIX);

    // 2. Compute TOPSIS Ranking
    const topsisResult = computeTopsis(
      SAMPLE_ATHLETES,
      SAMPLE_CRITERIA,
      fahpResult.weights
    );

    // 3. Compute CF and Decision for each athlete
    const assessments: Record<string, any> = {};
    const ranks: Record<string, number> = {};

    topsisResult.athleteScores.forEach((athScore) => {
      const athlete = SAMPLE_ATHLETES.find((a) => a.id === athScore.athleteId)!;
      const cfResult = computeCertaintyFactor(athlete);
      const decision = evaluateReadiness(
        athlete,
        SAMPLE_CRITERIA,
        athScore.closenessScore,
        cfResult.combinedCf
      );

      assessments[athlete.id] = decision;
      ranks[athlete.id] = athScore.rank;
    });

    return NextResponse.json({
      success: true,
      data: {
        criteria: SAMPLE_CRITERIA,
        fahpResult,
        topsisResult,
        athletes: SAMPLE_ATHLETES,
        assessments,
        ranks,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const athletes: AthleteInput[] = body.athletes || SAMPLE_ATHLETES;

    const fahpResult = computeFuzzyAhp(SAMPLE_FAHP_MATRIX);
    const topsisResult = computeTopsis(
      athletes,
      SAMPLE_CRITERIA,
      fahpResult.weights
    );

    const assessments: Record<string, any> = {};
    const ranks: Record<string, number> = {};

    topsisResult.athleteScores.forEach((athScore) => {
      const athlete = athletes.find((a) => a.id === athScore.athleteId)!;
      const cfResult = computeCertaintyFactor(athlete);
      const decision = evaluateReadiness(
        athlete,
        SAMPLE_CRITERIA,
        athScore.closenessScore,
        cfResult.combinedCf
      );

      assessments[athlete.id] = decision;
      ranks[athlete.id] = athScore.rank;
    });

    return NextResponse.json({
      success: true,
      data: {
        fahpResult,
        topsisResult,
        assessments,
        ranks,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

