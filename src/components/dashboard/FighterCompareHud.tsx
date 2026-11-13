"use client";

import React from "react";
import { AthleteInput, FinalReadinessAssessment } from "@/lib/engine/types";
import { Shield, AlertTriangle, CheckCircle, HeartPulse, Zap, Target } from "lucide-react";

interface FighterCompareHudProps {
  redCornerAthlete: AthleteInput;
  blueCornerAthlete: AthleteInput;
  redDecision: FinalReadinessAssessment;
  blueDecision: FinalReadinessAssessment;
  onSelectAthlete: (athleteId: string) => void;
}

export function FighterCompareHud({
  redCornerAthlete,
  blueCornerAthlete,
  redDecision,
  blueDecision,
  onSelectAthlete,
}: FighterCompareHudProps) {
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case "SIAP":
        return "bg-accent-green/15 text-accent-green border-accent-green/40 shadow-green-glow";
      case "SIAP_DENGAN_CATATAN":
        return "bg-accent-gold/15 text-accent-gold border-accent-gold/40 shadow-gold-glow";
      case "BELUM_SIAP":
        return "bg-accent-red/15 text-accent-red border-accent-red/40 shadow-red-glow";
      default:
        return "bg-surface-elevated text-primary border-border-grid";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-6">
      {/* RED CORNER (LEFT SIDE - MANDATORY PER SKILL.MD) */}
      <div className="border border-border-grid bg-surface relative overflow-hidden flex flex-col justify-between">
        {/* Top Corner Color Bar */}
        <div className="h-1.5 w-full bg-accent-red"></div>

        <div className="p-5">
          {/* Corner Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border-grid">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-accent-red text-white">
                RED CORNER
              </span>
              <span className="text-xs font-mono text-primary-muted">
                {redCornerAthlete.weightClass}
              </span>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border ${getBadgeStyle(
                redDecision.category
              )}`}
            >
              {redDecision.category.replace(/_/g, " ")}
            </span>
          </div>

          {/* Fighter Name & Profile */}
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight text-primary">
                {redCornerAthlete.name}
              </h3>
              <p className="text-xs text-primary-muted font-mono mt-0.5">
                BOUT WEIGHT: {redCornerAthlete.weightKg} KG • KEHADIRAN: {redCornerAthlete.attendanceRate}%
              </p>
            </div>
            {redDecision.medicalAlert && (
              <div className="flex items-center space-x-1.5 px-2 py-1 bg-accent-red/20 border border-accent-red/50 text-accent-red text-xs font-mono font-bold">
                <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
                <span>MEDICAL ALERT</span>
              </div>
            )}
          </div>

          {/* Key Telemetry Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            <div className="p-3 bg-surface-elevated border border-border-grid">
              <div className="flex items-center space-x-1.5 text-primary-muted text-[11px] font-mono">
                <Target className="w-3.5 h-3.5 text-accent-red" />
                <span>TOPSIS C_i</span>
              </div>
              <div className="text-2xl font-mono font-bold text-primary mt-1 tabular-nums">
                {redDecision.topsisCloseness.toFixed(4)}
              </div>
              <div className="text-[10px] font-mono text-primary-muted mt-0.5">Kedekatan Ideal</div>
            </div>

            <div className="p-3 bg-surface-elevated border border-border-grid">
              <div className="flex items-center space-x-1.5 text-primary-muted text-[11px] font-mono">
                <Shield className="w-3.5 h-3.5 text-accent-gold" />
                <span>CERTAINTY (CF)</span>
              </div>
              <div className="text-2xl font-mono font-bold text-accent-gold mt-1 tabular-nums">
                {redDecision.certaintyFactor >= 0 ? `+${redDecision.certaintyFactor.toFixed(4)}` : redDecision.certaintyFactor.toFixed(4)}
              </div>
              <div className="text-[10px] font-mono text-primary-muted mt-0.5">Skor Bukti Heuristik</div>
            </div>

            <div className="p-3 bg-surface-elevated border border-border-grid">
              <div className="flex items-center space-x-1.5 text-primary-muted text-[11px] font-mono">
                <Zap className="w-3.5 h-3.5 text-accent-green" />
                <span>POWER W/KG</span>
              </div>
              <div className="text-2xl font-mono font-bold text-accent-green mt-1 tabular-nums">
                {redCornerAthlete.rawScores["C1"]}
              </div>
              <div className="text-[10px] font-mono text-primary-muted mt-0.5">Daya Anaerobik Relatif</div>
            </div>
          </div>

          {/* Metric Details Progress / Mini Badges */}
          <div className="mt-4 pt-3 border-t border-border-grid space-y-2 text-xs font-mono">
            <div className="flex justify-between text-primary-muted">
              <span>Teknik Muaythai (IFMA Rule 29):</span>
              <span className="text-primary font-bold">{redCornerAthlete.rawScores["C2"]} / 5.0</span>
            </div>
            <div className="flex justify-between text-primary-muted">
              <span>VO2max (Daya Tahan Aerobik):</span>
              <span className="text-primary font-bold">{redCornerAthlete.rawScores["C3"]} ml/kg/min</span>
            </div>
            <div className="flex justify-between text-primary-muted">
              <span>Pengalaman Tanding Resmi:</span>
              <span className="text-primary font-bold">{redCornerAthlete.rawScores["C4"]} Partai</span>
            </div>
          </div>
        </div>

        {/* Action Button (Min 48px touch target) */}
        <div className="p-4 bg-surface-dim border-t border-border-grid">
          <button
            onClick={() => onSelectAthlete(redCornerAthlete.id)}
            className="w-full h-12 bg-surface-elevated hover:bg-accent-red hover:text-white border border-accent-red/40 text-accent-red font-mono font-bold text-xs uppercase tracking-wider transition-colors duration-150 flex items-center justify-center space-x-2"
          >
            <span>INSPEKSI AUDIT MATEMATIS RED CORNER</span>
          </button>
        </div>
      </div>

      {/* BLUE CORNER (RIGHT SIDE - MANDATORY PER SKILL.MD) */}
      <div className="border border-border-grid bg-surface relative overflow-hidden flex flex-col justify-between">
        {/* Top Corner Color Bar */}
        <div className="h-1.5 w-full bg-accent-blue"></div>

        <div className="p-5">
          {/* Corner Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border-grid">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-accent-blue text-white">
                BLUE CORNER
              </span>
              <span className="text-xs font-mono text-primary-muted">
                {blueCornerAthlete.weightClass}
              </span>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border ${getBadgeStyle(
                blueDecision.category
              )}`}
            >
              {blueDecision.category.replace(/_/g, " ")}
            </span>
          </div>

          {/* Fighter Name & Profile */}
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight text-primary">
                {blueCornerAthlete.name}
              </h3>
              <p className="text-xs text-primary-muted font-mono mt-0.5">
                BOUT WEIGHT: {blueCornerAthlete.weightKg} KG • KEHADIRAN: {blueCornerAthlete.attendanceRate}%
              </p>
            </div>
            {blueDecision.medicalAlert ? (
              <div className="flex items-center space-x-1.5 px-2 py-1 bg-accent-red/20 border border-accent-red/50 text-accent-red text-xs font-mono font-bold">
                <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
                <span>MEDICAL ALERT (INJURY)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-2 py-1 bg-accent-green/10 border border-accent-green/30 text-accent-green text-xs font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>FIT FOR DRILLS</span>
              </div>
            )}
          </div>

          {/* Key Telemetry Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            <div className="p-3 bg-surface-elevated border border-border-grid">
              <div className="flex items-center space-x-1.5 text-primary-muted text-[11px] font-mono">
                <Target className="w-3.5 h-3.5 text-accent-blue" />
                <span>TOPSIS C_i</span>
              </div>
              <div className="text-2xl font-mono font-bold text-primary mt-1 tabular-nums">
                {blueDecision.topsisCloseness.toFixed(4)}
              </div>
              <div className="text-[10px] font-mono text-primary-muted mt-0.5">Kedekatan Ideal</div>
            </div>

            <div className="p-3 bg-surface-elevated border border-border-grid">
              <div className="flex items-center space-x-1.5 text-primary-muted text-[11px] font-mono">
                <Shield className="w-3.5 h-3.5 text-accent-gold" />
                <span>CERTAINTY (CF)</span>
              </div>
              <div className="text-2xl font-mono font-bold text-accent-gold mt-1 tabular-nums">
                {blueDecision.certaintyFactor >= 0 ? `+${blueDecision.certaintyFactor.toFixed(4)}` : blueDecision.certaintyFactor.toFixed(4)}
              </div>
              <div className="text-[10px] font-mono text-primary-muted mt-0.5">Skor Bukti Heuristik</div>
            </div>

            <div className="p-3 bg-surface-elevated border border-border-grid">
              <div className="flex items-center space-x-1.5 text-primary-muted text-[11px] font-mono">
                <Zap className="w-3.5 h-3.5 text-accent-green" />
                <span>POWER W/KG</span>
              </div>
              <div className="text-2xl font-mono font-bold text-accent-green mt-1 tabular-nums">
                {blueCornerAthlete.rawScores["C1"]}
              </div>
              <div className="text-[10px] font-mono text-primary-muted mt-0.5">Daya Anaerobik Relatif</div>
            </div>
          </div>

          {/* Metric Details */}
          <div className="mt-4 pt-3 border-t border-border-grid space-y-2 text-xs font-mono">
            <div className="flex justify-between text-primary-muted">
              <span>Teknik Muaythai (IFMA Rule 29):</span>
              <span className="text-primary font-bold">{blueCornerAthlete.rawScores["C2"]} / 5.0</span>
            </div>
            <div className="flex justify-between text-primary-muted">
              <span>VO2max (Daya Tahan Aerobik):</span>
              <span className="text-primary font-bold">{blueCornerAthlete.rawScores["C3"]} ml/kg/min</span>
            </div>
            <div className="flex justify-between text-primary-muted">
              <span>Pengalaman Tanding Resmi:</span>
              <span className="text-primary font-bold">{blueCornerAthlete.rawScores["C4"]} Partai</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-surface-dim border-t border-border-grid">
          <button
            onClick={() => onSelectAthlete(blueCornerAthlete.id)}
            className="w-full h-12 bg-surface-elevated hover:bg-accent-blue hover:text-white border border-accent-blue/40 text-accent-blue font-mono font-bold text-xs uppercase tracking-wider transition-colors duration-150 flex items-center justify-center space-x-2"
          >
            <span>INSPEKSI AUDIT MATEMATIS BLUE CORNER</span>
          </button>
        </div>
      </div>
    </div>
  );
}

