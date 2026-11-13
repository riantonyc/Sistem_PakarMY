// 9Router & AI Explanation Service
// Strictly enforces SRS FR-33 to FR-38: Read-Only, Non-Binding Narrative Layer
// Structured JSON Output Template for Expert System Muaythai

import { AthleteInput, FinalReadinessAssessment } from "../engine/types";

export interface CriterionAnalysisItem {
  nilai: number;
  satuan?: string;
  evaluasi: string;
  status: "BAIK" | "CUKUP" | "KURANG" | "GAGAL_SYARAT_WAJIB" | "MATANG" | "MENENGAH" | "PEMULA" | "DISIPLIN_TINGGI" | "INDISIPLINER" | string;
}

export interface StructuredAiExplanation {
  keputusanFinal: "SIAP" | "SIAP_DENGAN_CATATAN" | "BELUM_SIAP";
  ringkasanEksekutif: string;
  analisisKriteria: {
    c1Anaerobik: CriterionAnalysisItem;
    c2Teknik: CriterionAnalysisItem & { skalaMaksimal: number; syaratMinimum: number };
    c3Vo2max: CriterionAnalysisItem;
    c4Pengalaman: CriterionAnalysisItem;
    kedisiplinanKehadiran: {
      persentase: number;
      evaluasi: string;
      status: string;
    };
  };
  analisisSistemPakar: {
    skorTopsisCi: number;
    interpretasiTopsis: string;
    certaintyFactorCf: number;
    interpretasiCf: string;
    aturanAktif: string[];
  };
  auditMedisDanBeratBadan: {
    statusCedera: string;
    catatanCedera?: string;
    analisisBerat: string;
    peringatanMedis: boolean;
  };
  rekomendasiPelatih: string[];
  instruksiOperasional: string[];
  kesimpulan: string;
}

export interface AiExplanationResponse {
  success: boolean;
  explanation: string;
  structured: StructuredAiExplanation;
  source: "9ROUTER_AI" | "DETERMINISTIC_FALLBACK";
  modelUsed: string;
  error?: string;
}

/**
 * Deterministic Fallback Generator that matches the exact StructuredAiExplanation schema
 * Guarantees zero downtime and 100% schema integrity even without network/LLM.
 */
export function generateDeterministicStructuredExplanation(
  athlete: AthleteInput,
  assessment: FinalReadinessAssessment
): StructuredAiExplanation {
  const c1 = athlete.rawScores["C1"] || 0;
  const c2 = athlete.rawScores["C2"] || 0;
  const c3 = athlete.rawScores["C3"] || 0;
  const c4 = athlete.rawScores["C4"] || 0;
  const presensi = athlete.attendanceRate || 0;

  let ringkasan = "";
  let kesimpulan = "";

  if (assessment.category === "SIAP") {
    ringkasan = `Atlet ${athlete.name} dinyatakan SIAP bertanding. Skor fisik mendekati profil ideal (Ci: ${assessment.topsisCloseness.toFixed(4)}) dan didukung faktor keyakinan lapangan tinggi (CF: ${assessment.certaintyFactor.toFixed(4)}) serta kedisiplinan ${presensi}%.`;
    kesimpulan = `Berdasarkan integrasi evaluasi Fuzzy AHP - TOPSIS (skor kedekatan fisik Ci: ${assessment.topsisCloseness.toFixed(4)}) dan Certainty Factor (tingkat keyakinan lapangan CF: ${assessment.certaintyFactor.toFixed(4)}), atlet ${athlete.name} secara resmi dinyatakan SIAP dan memenuhi seluruh kualifikasi standar regulasi IFMA untuk diterjunkan ke arena kejuaraan. Atlet menunjukkan keunggulan pada daya ledak anaerobik (C1: ${c1} W/kg) dan kematangan teknik bertarung (C2: ${c2}/5.0), didukung oleh dedikasi kehadiran latihan pemusatan yang mencapai ${presensi}%. Dari aspek keselamatan medis, atlet berstatus bebas cedera aktif dengan toleransi berat badan yang berada dalam koridor aman kompetisi. Tim pelatih sasana diarahkan untuk memfokuskan program pada fase tapering, pematangan strategi kontra-taktik lawan, dan pemeliharaan stabilitas mental juara tanpa memberikan beban latihan berlebih di hari-hari menjelang pertandingan.`;
  } else if (assessment.category === "SIAP_DENGAN_CATATAN") {
    ringkasan = `Atlet ${athlete.name} berada pada kategori SIAP DENGAN CATATAN (Ci: ${assessment.topsisCloseness.toFixed(4)}, CF: ${assessment.certaintyFactor.toFixed(4)}). ${assessment.medicalAlert ? "Terdapat peringatan cedera aktif yang wajib penanganan dokter tim." : "Memerlukan pengawasan intensif pada parameter batas."}`;
    kesimpulan = `Hasil evaluasi hibrida sistem pakar menempatkan atlet ${athlete.name} pada kategori SIAP DENGAN CATATAN (skor kedekatan fisik Ci: ${assessment.topsisCloseness.toFixed(4)}, faktor keyakinan CF: ${assessment.certaintyFactor.toFixed(4)}). Secara fundamental, potensi teknik dan kebugaran atlet berada pada batas kelayakan, namun terdapat parameter kritis yang memerlukan mitigasi segera. ${assessment.medicalAlert ? `Peringatan medis aktif terdeteksi (${athlete.injuryNotes || athlete.injuryDescription || "indikasi cedera"}), sehingga atlet DILARANG bertanding sebelum memperoleh rekomendasi tertulis (medical clearance) dari dokter spesialis olahraga tim.` : `Tingkat presensi latihan (${presensi}%) atau parameter fisik masih berada di area ambang batas (borderline), memerlukan pengawasan ketat dari tim pelatih.`} Keputusan akhir penerjunan atlet ke ring ditangguhkan hingga dilaksanakannya evaluasi medis terakhir dan penimbangan berat badan resmi. Tim pelatih wajib menyiapkan opsi atlet cadangan bila kondisi fisik tidak mencapai 100% pada saat technical meeting.`;
  } else {
    ringkasan = `Atlet ${athlete.name} dinyatakan BELUM SIAP (Ci: ${assessment.topsisCloseness.toFixed(4)}, CF: ${assessment.certaintyFactor.toFixed(4)}). ${assessment.mandatoryCriteriaViolations.length > 0 ? "Gagal memenuhi kriteria wajib teknik dasar." : "Kebugaran fisik dan keyakinan lapangan belum memenuhi standar kompetisi."}`;
    kesimpulan = `Berdasarkan audit komputasi sistem pakar berbasis standar regulasi IFMA, atlet ${athlete.name} secara definitif dinyatakan BELUM SIAP (skor kedekatan fisik Ci: ${assessment.topsisCloseness.toFixed(4)}, faktor keyakinan CF: ${assessment.certaintyFactor.toFixed(4)}). ${assessment.mandatoryCriteriaViolations.length > 0 ? `Sistem mendeteksi kegagalan pada kriteria wajib (Hard Gate): ${assessment.mandatoryCriteriaViolations.join(", ")}, di mana regulasi keselamatan IFMA mewajibkan penguasaan teknik dasar minimal sebelum seorang atlet diizinkan beradu kontak fisik di ring kejuaraan.` : `Kapasitas fisik aerobik/anaerobik serta tingkat kehadiran latihan (${presensi}%) belum memenuhi standar ambang kompetisi resmi.`} Demi memproteksi keselamatan atlet dari risiko cedera fatal dan menjaga integritas prestasi sasana, atlet TIDAK DIREKOMENDASIKAN untuk diturunkan pada ajang ini. Pengkot Muaythai dan pelatih disarankan mengalihkan atlet ke program pemulihan dan pembinaan jangka panjang di sasana.`;
  }

  return {
    keputusanFinal: assessment.category,
    ringkasanEksekutif: ringkasan,
    analisisKriteria: {
      c1Anaerobik: {
        nilai: c1,
        satuan: "W/kg",
        evaluasi: c1 >= 14.0 ? "Daya ledak anaerobik sangat eksplosif." : c1 >= 11.0 ? "Daya anaerobik cukup memadai untuk duel jarak dekat." : "Daya ledak pukulan/tendangan di bawah standar kelas.",
        status: c1 >= 14.0 ? "BAIK" : c1 >= 11.0 ? "CUKUP" : "KURANG",
      },
      c2Teknik: {
        nilai: c2,
        satuan: "Skala 1-5",
        skalaMaksimal: 5.0,
        syaratMinimum: 3.0,
        evaluasi: c2 >= 4.0 ? "Penguasaan 8 organ tubuh (clinch, elbow, knee, teep) sangat matang." : c2 >= 3.0 ? "Teknik dasar memenuhi batas minimum kompetisi." : "Gagal syarat wajib teknik dasar (di bawah batas 3.0).",
        status: c2 < 3.0 ? "GAGAL_SYARAT_WAJIB" : c2 >= 4.0 ? "BAIK" : "CUKUP",
      },
      c3Vo2max: {
        nilai: c3,
        satuan: "ml/kg/min",
        evaluasi: c3 >= 55.0 ? "Daya tahan aerobik prima, mampu menjaga ritme tinggi hingga ronde 3." : c3 >= 48.0 ? "Daya tahan cukup, namun rentan penurunan tempo di ronde penutup." : "Kapasitas aerobik rendah, berisiko kehabisan nafas.",
        status: c3 >= 55.0 ? "BAIK" : c3 >= 48.0 ? "CUKUP" : "KURANG",
      },
      c4Pengalaman: {
        nilai: c4,
        satuan: "Partai",
        evaluasi: c4 >= 8 ? "Jam terbang tanding resmi tinggi, mental bertarung teruji." : c4 >= 3 ? "Pengalaman tanding menengah, butuh adaptasi atmosfer panggung." : "Atlet debutan/pemula, memerlukan ketenangan mental ekstra.",
        status: c4 >= 8 ? "MATANG" : c4 >= 3 ? "MENENGAH" : "PEMULA",
      },
      kedisiplinanKehadiran: {
        persentase: presensi,
        evaluasi: presensi >= 85.0 ? "Tingkat kehadiran TC sangat tinggi, menunjukkan dedikasi juara." : presensi >= 75.0 ? "Kehadiran cukup, namun terdapat beberapa sesi penting terlewat." : "Tingkat ketidakhadiran tinggi, mengindikasikan inkonsistensi persiapan.",
        status: presensi >= 85.0 ? "DISIPLIN_TINGGI" : presensi >= 75.0 ? "CUKUP" : "INDISIPLINER",
      },
    },
    analisisSistemPakar: {
      skorTopsisCi: assessment.topsisCloseness,
      interpretasiTopsis: assessment.topsisCloseness >= 0.7 ? "Sangat dekat dengan Solusi Ideal Positif (A+)." : assessment.topsisCloseness >= 0.45 ? "Berada di zona moderat antara A+ dan A-." : "Mendekati Solusi Ideal Negatif (A-).",
      certaintyFactorCf: assessment.certaintyFactor,
      interpretasiCf: assessment.certaintyFactor >= 0.7 ? "Fakta lapangan membuktikan keyakinan sangat kuat." : assessment.certaintyFactor >= 0.3 ? "Keyakinan berada pada derajat cukup positif." : "Terdapat bukti negatif yang menekan keyakinan kesiapan.",
      aturanAktif: assessment.activeRules,
    },
    auditMedisDanBeratBadan: {
      statusCedera: athlete.hasActiveInjury ? "CEDERA AKTIF" : "Bebas Cedera",
      catatanCedera: athlete.injuryNotes || athlete.injuryDescription || "Tidak ada riwayat cedera pembatas.",
      analisisBerat: `Berat badan saat ini ${athlete.weightKg} kg pada kelas pertandingan ${athlete.weightClass}.`,
      peringatanMedis: assessment.medicalAlert,
    },
    rekomendasiPelatih: [
      c2 < 3.0 ? "Prioritaskan drill teknik dasar pertahanan dan clinch sebelum sparring keras." : "Pertajam variasi serangan kombinasi pukulan-tendangan-siku.",
      c3 < 50.0 ? "Tingkatkan porsi latihan kardio interval (HIIT) 3x per minggu." : "Pertahankan kapasitas aerobik dengan continuous running zona 2.",
      athlete.hasActiveInjury ? "Segera lakukan terapi fisioterapi dan rontgen/evaluasi dokter tim." : "Lakukan program prehabilitasi sendi untuk mencegah cedera akut.",
    ],
    instruksiOperasional: [
      "Lakukan timbang badan berkala setiap pagi sebelum asupan nutrisi.",
      "Jaga kecukupan hidrasi dan pemulihan tidur minimal 8 jam per hari.",
      "Verifikasi berkas administrasi dan buku rekam medis atlet ke Pengkot Muaythai.",
    ],
    kesimpulan,
  };
}

export async function requestAiExplanation(
  athlete: AthleteInput,
  assessment: FinalReadinessAssessment
): Promise<AiExplanationResponse> {
  const endpoint = process.env.NINE_ROUTER_ENDPOINT || "http://localhost:20128/v1";
  const apiKey = process.env.AI_GATEWAY_API_KEY || "";
  const model = process.env.AI_EXPLANATION_MODEL || "MyCodeDec";

  const fallbackStructured = generateDeterministicStructuredExplanation(athlete, assessment);

  const jsonTemplateSchema = `{
  "keputusanFinal": "${assessment.category}",
  "ringkasanEksekutif": "Ringkasan ringkas status kesiapan atlet...",
  "analisisKriteria": {
    "c1Anaerobik": { "nilai": ${athlete.rawScores["C1"] || 0}, "satuan": "W/kg", "evaluasi": "Evaluasi kekuatan pukulan/tendangan", "status": "BAIK" },
    "c2Teknik": { "nilai": ${athlete.rawScores["C2"] || 0}, "satuan": "Skala 1-5", "skalaMaksimal": 5.0, "syaratMinimum": 3.0, "evaluasi": "Evaluasi teknik 8 organ tubuh", "status": "BAIK" },
    "c3Vo2max": { "nilai": ${athlete.rawScores["C3"] || 0}, "satuan": "ml/kg/min", "evaluasi": "Evaluasi stamina aerobik 3 ronde", "status": "BAIK" },
    "c4Pengalaman": { "nilai": ${athlete.rawScores["C4"] || 0}, "satuan": "Partai", "evaluasi": "Evaluasi jam terbang tanding", "status": "MATANG" },
    "kedisiplinanKehadiran": { "persentase": ${athlete.attendanceRate || 0}, "evaluasi": "Evaluasi presensi latihan", "status": "DISIPLIN_TINGGI" }
  },
  "analisisSistemPakar": {
    "skorTopsisCi": ${assessment.topsisCloseness.toFixed(4)},
    "interpretasiTopsis": "Penjelasan kedekatan fisik dengan juara ideal",
    "certaintyFactorCf": ${assessment.certaintyFactor.toFixed(4)},
    "interpretasiCf": "Penjelasan faktor keyakinan lapangan",
    "aturanAktif": ${JSON.stringify(assessment.activeRules)}
  },
  "auditMedisDanBeratBadan": {
    "statusCedera": "${athlete.hasActiveInjury ? "CEDERA AKTIF" : "Bebas Cedera"}",
    "catatanCedera": "${athlete.hasActiveInjury ? (athlete.injuryNotes || "Dalam perawatan") : "Tidak ada riwayat cedera"}",
    "analisisBerat": "Analisis berat riil (${athlete.weightKg} kg) terhadap kelas ${athlete.weightClass}",
    "peringatanMedis": ${assessment.medicalAlert}
  },
  "rekomendasiPelatih": [
    "Saran program latihan teknis 1",
    "Saran program latihan teknis 2"
  ],
  "instruksiOperasional": [
    "Instruksi timbang badan dan dehidrasi",
    "Instruksi pemulihan tidur dan nutrisi"
  ],
  "kesimpulan": "Uraian deskripsi komprehensif dan mendalam (4-6 kalimat) yang mencakup justifikasi yuridis IFMA, sintesis fisik dan teknik, mitigasi risiko medis/berat badan, serta arahan manajerial resmi untuk Kepala Pelatih dan Pengurus Muaythai Pontianak."
} `;

  const systemPrompt = `Anda adalah Asisten Sistem Pakar Pengkot Muaythai Pontianak berbasis regulasi resmi IFMA.
Format output Anda WAJIB berupa JSON murni (JSON only, valid RFC 8259) tanpa komentar pembuka, tanpa penutup, dan tanpa pembungkus markdown.

ATURAN MUTLAK (GUARDRAIL SISTEM PAKAR SRS FR-33 s/d FR-38):
1. Anda DILARANG KERAS mengubah keputusan final sistem (${assessment.category}). Nilai field "keputusanFinal" WAJIB "${assessment.category}".
2. Field "kesimpulan" WAJIB memuat uraian deskriptif komprehensif, mendalam, dan berbobot akademis/profesional (minimal 4-6 kalimat terpadu) yang mencakup:
   - Justifikasi yuridis kelayakan tanding atlet berdasarkan kaidah resmi IFMA dan audit TOPSIS-CF.
   - Sintesis kekuatan fisik (daya ledak anaerobik, VO2max), kematangan teknik 8 organ, dan kedisiplinan TC.
   - Analisis mitigasi risiko medis (cedera aktif / riwayat sendi) serta kontrol margin berat badan terhadap batas kelas.
   - Arahan operasional dan manajerial formal bagi Kepala Pelatih dan jajaran Pengkot Muaythai Kota Pontianak.
3. Output WAJIB mengikuti format JSON terstruktur persis seperti contoh berikut:
${jsonTemplateSchema}`;

  const userPrompt = `DATA EVALUASI ATLET:
- Nama: ${athlete.name}
- Kelas Berat: ${athlete.weightClass} (Berat Riil: ${athlete.weightKg} kg)
- Daya Anaerobik Relatif (C1): ${athlete.rawScores["C1"]} W/kg
- Penguasaan Teknik Muaythai (C2): ${athlete.rawScores["C2"]} / 5.0 (Syarat minimal: 3.0)
- VO2max Daya Tahan Aerobik (C3): ${athlete.rawScores["C3"]} ml/kg/min
- Pengalaman Tanding Resmi (C4): ${athlete.rawScores["C4"]} Partai
- Kehadiran Latihan TC: ${athlete.attendanceRate}%
- Status Cedera: ${athlete.hasActiveInjury ? `CEDERA AKTIF (${athlete.injuryNotes || "Dalam penanganan"})` : "Bebas Cedera"}
- Skor Kedekatan TOPSIS (C_i): ${assessment.topsisCloseness.toFixed(4)}
- Faktor Keyakinan Certainty Factor (CF): ${assessment.certaintyFactor.toFixed(4)}
- KEPUTUSAN FINAL SISTEM: [${assessment.category}]
- Kaidah Aturan Aktif:
${assessment.activeRules.map((r) => `  * ${r}`).join("\n")}
${assessment.mandatoryCriteriaViolations.length > 0 ? `- Pelanggaran Syarat Wajib: ${assessment.mandatoryCriteriaViolations.join(", ")}` : ""}

Hasilkan struktur JSON lengkap evaluasi kesiapan resmi atlet ini sekarang. Pastikan field "kesimpulan" memuat uraian deskripsi yang kaya, komprehensif, dan mendalam.`;

  let lastError: any = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeoutMs = 25000; // 25 seconds per attempt
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      let rawResponseText = "";
      try {
        const res = await fetch(`${endpoint}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.1,
            max_tokens: 2200,
            stream: false,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`9Router error ${res.status}: ${errText}`);
        }

        rawResponseText = await res.text();
      } finally {
        clearTimeout(timeoutId);
      }

      // Extract content from JSON or SSE lines
      let content = "";
      const trimmed = rawResponseText.trim();

      const extractChoiceContent = (choice: any): string => {
        if (!choice) return "";
        const msg = choice.message;
        if (msg) {
          if (typeof msg.content === "string" && msg.content.trim().length > 0) return msg.content;
          if (Array.isArray(msg.content) && msg.content.length > 0) {
            const joined = msg.content
              .map((part: any) => (typeof part === "string" ? part : part?.text || part?.content || ""))
              .join("");
            if (joined.trim().length > 0) return joined;
          }
          // Fallback for thinking models where JSON might be present in reasoning_content
          if (typeof msg.reasoning_content === "string" && msg.reasoning_content.includes("{")) {
            const firstB = msg.reasoning_content.indexOf("{");
            const lastB = msg.reasoning_content.lastIndexOf("}");
            if (firstB !== -1 && lastB > firstB) {
              return msg.reasoning_content.substring(firstB, lastB + 1);
            }
          }
        }
        const delta = choice.delta;
        if (delta) {
          if (typeof delta.content === "string" && delta.content.trim().length > 0) return delta.content;
          if (typeof delta.reasoning_content === "string" && delta.reasoning_content.includes("{")) {
            const firstB = delta.reasoning_content.indexOf("{");
            const lastB = delta.reasoning_content.lastIndexOf("}");
            if (firstB !== -1 && lastB > firstB) {
              return delta.reasoning_content.substring(firstB, lastB + 1);
            }
          }
        }
        if (typeof choice.text === "string") return choice.text;
        return "";
      };

      if (trimmed.startsWith("{")) {
        try {
          const json = JSON.parse(trimmed);
          content = extractChoiceContent(json.choices?.[0]);
        } catch (parseErr: any) {
          throw new Error(`Failed to parse 9Router JSON envelope: ${parseErr.message}`);
        }
      } else if (trimmed.includes("data:")) {
        const lines = trimmed.split("\n");
        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine.startsWith("data:")) continue;
          const dataStr = cleanLine.replace(/^data:\s*/, "").trim();
          if (dataStr === "[DONE]") continue;
          try {
            const chunk = JSON.parse(dataStr);
            const chunkText = extractChoiceContent(chunk.choices?.[0]);
            content += chunkText;
          } catch {}
        }
      } else {
        content = trimmed;
      }

      if (!content.trim()) {
        console.warn("9Router empty content debug:", trimmed.slice(0, 300));
        throw new Error("9Router returned an empty explanation content.");
      }

      // Strip markdown fences (```json ... ```) if LLM wrapped it
      let cleanJsonStr = content.trim();
      if (cleanJsonStr.startsWith("```")) {
        cleanJsonStr = cleanJsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      }

      // Parse structured JSON
      let parsed: StructuredAiExplanation;
      try {
        parsed = JSON.parse(cleanJsonStr);
      } catch {
        // If parsing the inner JSON fails, try to extract first '{' to last '}'
        const firstBrace = cleanJsonStr.indexOf("{");
        const lastBrace = cleanJsonStr.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          parsed = JSON.parse(cleanJsonStr.substring(firstBrace, lastBrace + 1));
        } else {
          throw new Error("Respon LLM bukan format JSON yang valid.");
        }
      }

      // Guardrail FR-35: Guarantee decision category cannot be altered by LLM
      if (parsed.keputusanFinal !== assessment.category) {
        console.warn("FR-35 Guardrail Triggered: AI response altered decision category. Overriding to system category.");
        parsed.keputusanFinal = assessment.category;
      }

      return {
        success: true,
        explanation: JSON.stringify(parsed, null, 2),
        structured: parsed,
        source: "9ROUTER_AI",
        modelUsed: model,
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`9Router attempt ${attempt} failed: ${err.message}. Rotating...`);
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }
  }

  const isTimeout = lastError?.name === "AbortError";
  const userError = isTimeout
    ? "Koneksi ke 9Router timeout (>25 detik). Sistem beralih otomatis ke narasi terstruktur resmi."
    : (lastError?.message || "Terjadi kesalahan koneksi 9Router.");

  console.warn("9Router unavailable or error. Using deterministic fallback (FR-37):", userError);
  return {
    success: false,
    explanation: JSON.stringify(fallbackStructured, null, 2),
    structured: fallbackStructured,
    source: "DETERMINISTIC_FALLBACK",
    modelUsed: "Deterministic Template Engine",
    error: userError,
  };
}
