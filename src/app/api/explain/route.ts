import { NextResponse } from "next/server";
import { requestAiExplanation } from "@/lib/services/ai-explanation";

export async function POST(req: Request) {
  try {
    const { athlete, assessment } = await req.json();

    if (!athlete || !assessment) {
      return NextResponse.json(
        { success: false, error: "Missing athlete or assessment payload" },
        { status: 400 }
      );
    }

    const aiResult = await requestAiExplanation(athlete, assessment);
    return NextResponse.json(aiResult);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

