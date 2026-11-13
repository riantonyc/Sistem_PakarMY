import React from "react";
import { ShieldAlert, Activity, CheckCircle2, Award } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border-grid bg-surface/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Organization Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-surface-elevated border border-accent-gold/40 flex items-center justify-center rounded-none shadow-gold-glow">
            <Award className="w-5 h-5 text-accent-gold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-lg tracking-wider text-primary uppercase">
                PENGKOT MUAYTHAI PONTIANAK
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                IFMA RULES
              </span>
            </div>
            <p className="text-xs text-primary-muted font-sans tracking-tight">
              Sistem Pakar Hibrida Evaluasi Kesiapan Atlet (FAHP – TOPSIS – Certainty Factor)
            </p>
          </div>
        </div>

        {/* Tactical Telemetry & Mode Badges */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-none bg-accent-green animate-pulse"></span>
            <span className="text-primary-muted">ENGINE STATUS:</span>
            <span className="text-accent-green font-bold">DETERMINISTIC VERIFIED</span>
          </div>

          <div className="h-4 w-px bg-border-grid"></div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-accent-blue" />
            <span className="text-primary-muted">AHP CR:</span>
            <span className="text-primary font-bold">0.0059 (&lt; 0.10)</span>
          </div>

          <div className="h-4 w-px bg-border-grid"></div>

          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-mono font-semibold uppercase bg-surface-elevated border border-border-grid text-primary">
              DIVISI: LIGHT WELTER (63.5 KG)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

