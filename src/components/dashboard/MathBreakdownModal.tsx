"use client";

import React from "react";
import {
  AthleteInput,
  FinalReadinessAssessment,
  CriterionDefinition,
  TopsisAthleteScore,
} from "@/lib/engine/types";
import { X, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Activity } from "lucide-react";

interface MathBreakdownModalProps {
  athlete: AthleteInput | null;
  assessment: FinalReadinessAssessment | null;
  topsisScore: TopsisAthleteScore | null;
  criteria: CriterionDefinition[];
  onClose: () => void;
}

export function MathBreakdownModal({
  athlete,
  assessment,
  topsisScore,
  criteria,
  onClose,
}: MathBreakdownModalProps) {
  if (!athlete || !assessment || !topsisScore) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border-grid w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-border-grid bg-surface-dim flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent-gold">
              AUDIT TRAIL MATEMATIS & TELEMETRI KEPUTUSAN
            </span>
            <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight text-primary">
              {athlete.name} — {athlete.weightClass}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border border-border-grid bg-surface-elevated hover:bg-accent-red hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-elevated border border-border-grid">
              <span className="text-[10px] font-mono text-primary-muted uppercase">STATUS AKHIR</span>
              <div className="text-base font-bold text-accent-green uppercase mt-1">
                {assessment.category.replace(/_/g, " ")}
              </div>
            </div>
            <div className="p-3 bg-surface-elevated border border-border-grid">
              <span className="text-[10px] font-mono text-primary-muted uppercase">TOPSIS C_I</span>
              <div className="text-lg font-mono font-bold text-accent-blue mt-1 tabular-nums">
                {assessment.topsisCloseness.toFixed(4)}
              </div>
            </div>
            <div className="p-3 bg-surface-elevated border border-border-grid">
              <span className="text-[10px] font-mono text-primary-muted uppercase">CERTAINTY (CF)</span>
              <div className="text-lg font-mono font-bold text-accent-gold mt-1 tabular-nums">
                {assessment.certaintyFactor >= 0 ? `+${assessment.certaintyFactor.toFixed(4)}` : assessment.certaintyFactor.toFixed(4)}
              </div>
            </div>
            <div className="p-3 bg-surface-elevated border border-border-grid">
              <span className="text-[10px] font-mono text-primary-muted uppercase">JARAK D+ / D-</span>
              <div className="text-sm font-mono text-primary mt-1 tabular-nums">
                D+: {topsisScore.distancePositive.toFixed(4)} <br />
                D-: {topsisScore.distanceNegative.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Section 1: TOPSIS Vector Normalization & Weighting */}
          <div>
            <h4 className="font-display font-bold text-base uppercase tracking-tight text-primary pb-2 border-b border-border-grid">
              1. Matriks Normalisasi Vektor & Pembobotan TOPSIS
            </h4>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-surface-elevated text-primary-muted uppercase border-b border-border-grid">
                  <tr>
                    <th className="py-2 px-3">KODE</th>
                    <th className="py-2 px-3">KRITERIA</th>
                    <th className="py-2 px-3 text-right">RAW VALUE</th>
                    <th className="py-2 px-3 text-right">NORMALISASI (R_IJ)</th>
                    <th className="py-2 px-3 text-right">TERBOBOT (Y_IJ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-grid">
                  {criteria.map((crit) => (
                    <tr key={crit.code}>
                      <td className="py-2 px-3 font-bold text-accent-gold">{crit.code}</td>
                      <td className="py-2 px-3 font-sans text-primary">{crit.name}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-primary font-bold">
                        {athlete.rawScores[crit.code]} {crit.unit}
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-primary-muted">
                        {topsisScore.normalizedVector[crit.code]?.toFixed(5) || "-"}
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-accent-blue font-semibold">
                        {topsisScore.weightedVector[crit.code]?.toFixed(5) || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Deterministic Decision Engine & Rules */}
          <div>
            <h4 className="font-display font-bold text-base uppercase tracking-tight text-primary pb-2 border-b border-border-grid">
              2. Kaidah Aturan Deterministik yang Terpicu
            </h4>
            <div className="mt-3 space-y-2">
              {assessment.activeRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-surface-elevated border-l-2 border-accent-gold border-y border-r border-border-grid text-xs font-mono"
                >
                  <span className="text-accent-gold font-bold">{rule}</span>
                </div>
              ))}

              {assessment.mandatoryCriteriaViolations.length > 0 && (
                <div className="p-3 bg-accent-red/10 border-l-2 border-accent-red border-y border-r border-accent-red/40 text-xs font-mono text-accent-red">
                  <div className="font-bold flex items-center space-x-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>PELANGGARAN KRITERIA WAJIB (HARD GATE K-06):</span>
                  </div>
                  {assessment.mandatoryCriteriaViolations.map((v, i) => (
                    <div key={i}>• {v}</div>
                  ))}
                </div>
              )}

              {assessment.medicalAlert && (
                <div className="p-3 bg-accent-red/10 border-l-2 border-accent-red border-y border-r border-accent-red/40 text-xs font-mono text-accent-red">
                  <div className="font-bold flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>PERINGATAN KESELAMATAN MEDIS (K-10):</span>
                  </div>
                  <p className="mt-1">
                    Atlet terindikasi mengalami cedera aktif:{" "}
                    <strong>{athlete.injuryDescription || "Belum ada keterangan spesifik"}</strong>.
                    Kategori kesiapan dibatasi bersyarat dan wajib melampirkan persetujuan tim medis.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Deterministic Narrative Explanation */}
          <div>
            <h4 className="font-display font-bold text-base uppercase tracking-tight text-primary pb-2 border-b border-border-grid flex items-center space-x-2">
              <FileText className="w-4 h-4 text-accent-green" />
              <span>3. Narasi Penjelasan Resmi (Deterministic Explanation Layer)</span>
            </h4>
            <div className="mt-3 p-4 bg-surface-dim border border-border-grid">
              <pre className="text-xs font-mono text-primary whitespace-pre-wrap leading-relaxed">
                {assessment.narrativeExplanation}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border-grid bg-surface-dim flex justify-end">
          <button
            onClick={onClose}
            className="h-10 px-5 bg-surface-elevated hover:bg-border-focus border border-border-grid text-primary text-xs font-mono uppercase tracking-wider transition-colors"
          >
            TUTUP AUDIT
          </button>
        </div>
      </div>
    </div>
  );
}

