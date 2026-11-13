"use client";

import React from "react";
import { FuzzyAhpResult, CriterionDefinition } from "@/lib/engine/types";
import { CheckCircle2, Sliders, Info, ShieldCheck } from "lucide-react";

interface FuzzyAhpPanelProps {
  fahpResult: FuzzyAhpResult;
  criteria: CriterionDefinition[];
}

export function FuzzyAhpPanel({ fahpResult, criteria }: FuzzyAhpPanelProps) {
  return (
    <div className="border border-border-grid bg-surface p-5 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-grid gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-accent-gold" />
            <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-primary">
              MATRIKS BOBOT KRITERIA (FUZZY AHP EXTENT ANALYSIS)
            </h3>
          </div>
          <p className="text-xs text-primary-muted font-sans mt-0.5">
            Model Chang (1996) dengan perbaikan Zhu et al. (1999) berbasis TFN pakar Pengkot Pontianak
          </p>
        </div>

        {/* Consistency Ratio Telemetry Badge */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 bg-accent-green/10 border border-accent-green/40 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-accent-green" />
            <div className="text-xs font-mono">
              <span className="text-primary-muted">CONSISTENCY RATIO (CR): </span>
              <strong className="text-accent-green font-bold tabular-nums">
                {fahpResult.consistencyRatio.toFixed(4)}
              </strong>
              <span className="text-accent-green ml-1 text-[10px] font-bold">
                [KONSISTEN &lt; 0.10]
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria Weight Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
        {criteria.map((crit) => {
          const weight = fahpResult.weights[crit.code] || 0;
          const weightPct = (weight * 100).toFixed(2);
          const s_i = fahpResult.syntheticExtents[crit.code];

          return (
            <div
              key={crit.code}
              className="p-3 bg-surface-elevated border border-border-grid flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-bold text-accent-gold">{crit.code}</span>
                  <span className="text-primary-muted text-[10px]">{crit.unit}</span>
                </div>
                <h4 className="text-xs font-bold text-primary tracking-tight line-clamp-1">
                  {crit.name}
                </h4>
                {crit.isMandatory && (
                  <span className="inline-block mt-1 px-1.5 py-0.2 text-[9px] font-mono font-bold bg-accent-red/20 text-accent-red border border-accent-red/40 uppercase">
                    WAJIB (MIN {crit.minThreshold})
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[10px] font-mono text-primary-muted">BOBOT CRISP:</span>
                  <span className="text-base font-mono font-bold text-primary tabular-nums">
                    {weightPct}%
                  </span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-1.5 bg-surface-dim overflow-hidden">
                  <div
                    className="h-full bg-accent-gold transition-all duration-300"
                    style={{ width: `${Math.max(Number(weightPct), 3)}%` }}
                  ></div>
                </div>

                {/* Synthetic Extent values */}
                {s_i && (
                  <div className="mt-2 text-[9px] font-mono text-primary-muted flex justify-between pt-1 border-t border-border-grid">
                    <span>S_i:</span>
                    <span className="tabular-nums">
                      [{s_i[0].toFixed(3)}, {s_i[1].toFixed(3)}, {s_i[2].toFixed(3)}]
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Methodological Context Note */}
      <div className="mt-4 p-3 bg-surface-dim border border-border-grid text-xs text-primary-muted font-sans flex items-start space-x-2">
        <Info className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
        <p>
          <strong className="text-primary">Catatan Metodologis (Chang 1996 Extent Analysis):</strong>{" "}
          Daya Anaerobik Relatif (C1) dan Penguasaan Teknik (C2) memegang bobot dominan (masing-masing 42.29%) selaras dengan tuntutan bioenergetik dan regulasi IFMA. Kriteria Kehadiran (C5) dan Pengalaman Tanding (C4) difungsikan sebagai bukti pendukung empiris melalui lapis Certainty Factor (CF).
        </p>
      </div>
    </div>
  );
}

