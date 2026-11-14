import { NextResponse } from "next/server";

export async function GET() {
  const endpoint = process.env.NINE_ROUTER_ENDPOINT || "http://localhost:20128/v1";
  const configuredModel = process.env.AI_EXPLANATION_MODEL || "MyCodeDec";
  const apiKey = process.env.AI_GATEWAY_API_KEY || "";

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const headers: Record<string, string> = {};
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${endpoint.replace(/\/+$/, "")}/models`, {
      method: "GET",
      headers,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (!response.ok) {
      return NextResponse.json({
        connected: false,
        status: "ERROR",
        message: `HTTP ${response.status}: ${response.statusText}`,
        model: configuredModel,
        endpoint,
        durationMs: duration,
      });
    }

    const data = await response.json();
    const modelList = Array.isArray(data?.data) ? data.data : [];
    const modelFound = modelList.some(
      (m: any) => m.id === configuredModel || m.id?.toLowerCase() === configuredModel.toLowerCase()
    );

    return NextResponse.json({
      connected: true,
      status: "CONNECTED",
      message: "Gateway LLM 9Router Terhubung & Siap",
      model: configuredModel,
      modelFound,
      totalModels: modelList.length,
      endpoint,
      durationMs: duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const isTimeout = error.name === "AbortError";
    return NextResponse.json({
      connected: false,
      status: isTimeout ? "TIMEOUT" : "OFFLINE",
      message: isTimeout
        ? "Timeout saat menghubungkan ke 9Router (>3s)"
        : (error.message || "Gateway 9Router tidak terjangkau"),
      model: configuredModel,
      endpoint,
      durationMs: duration,
      timestamp: new Date().toISOString(),
    });
  }
}
