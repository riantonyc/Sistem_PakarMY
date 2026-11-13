"use client";

import React, { useState } from "react";
import { AthleteInput, FinalReadinessAssessment } from "@/lib/engine/types";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

interface AthleteTableProps {
  athletes: AthleteInput[];
  assessments: Record<string, FinalReadinessAssessment>;
  ranks: Record<string, number>;
  onSelectAthlete: (athleteId: string) => void;
  onEditAthlete: (athlete: AthleteInput) => void;
  onDeleteAthlete: (athleteId: string) => void;
}

export function AthleteTable({
  athletes,
  assessments,
  ranks,
  onSelectAthlete,
  onEditAthlete,
  onDeleteAthlete,
}: AthleteTableProps) {
  const [athleteToDelete, setAthleteToDelete] = useState<AthleteInput | null>(null);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "SIAP":
        return "bg-accent-green/15 text-accent-green border-accent-green/40";
      case "SIAP_DENGAN_CATATAN":
        return "bg-accent-gold/15 text-accent-gold border-accent-gold/40";
      case "BELUM_SIAP":
        return "bg-accent-red/15 text-accent-red border-accent-red/40";
      default:
        return "bg-surface-elevated text-primary border-border-grid";
    }
  };

  // Sort athletes by rank
  const sortedAthletes = [...athletes].sort((a, b) => {
    const rankA = ranks[a.id] || 999;
    const rankB = ranks[b.id] || 999;
    return rankA - rankB;
  });

  const confirmDelete = () => {
    if (athleteToDelete) {
      onDeleteAthlete(athleteToDelete.id);
      setAthleteToDelete(null);
    }
  };

  return (
    <div className="border border-border-grid bg-surface overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-border-grid bg-surface-dim flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase tracking-tight text-primary">
            DAFTAR & KLASEMEN TELEMETRI ATLET
          </h2>
          <p className="text-xs text-primary-muted font-sans">
            Data penilaian atlet yang aktif dalam sistem pakar. Anda dapat mengedit, menghapus, atau melihat audit detail.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-surface-elevated border border-border-grid text-primary-muted">
            TOTAL ATLET: <strong className="text-primary">{athletes.length}</strong>
          </span>
          <span className="px-2.5 py-1 bg-surface-elevated border border-border-grid text-primary-muted">
            STATUS: <strong className="text-accent-green">LOCKED & VERIFIED</strong>
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-elevated text-primary-muted uppercase tracking-wider border-b border-border-grid">
            <tr>
              <th className="py-3 px-3 text-center">RANK</th>
              <th className="py-3 px-4">NAMA ATLET / SASANA</th>
              <th className="py-3 px-3 text-right">ANAEROBIK (W/KG)</th>
              <th className="py-3 px-3 text-right">TEKNIK (1-5)</th>
              <th className="py-3 px-3 text-right">VO2MAX</th>
              <th className="py-3 px-3 text-right">PARTAI</th>
              <th className="py-3 px-3 text-right">DISIPLIN</th>
              <th className="py-3 px-3 text-right">TOPSIS C_I</th>
              <th className="py-3 px-3 text-right">CERTAINTY (CF)</th>
              <th className="py-3 px-4 text-center">KEPUTUSAN</th>
              <th className="py-3 px-4 text-center">MANAJEMEN / AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-grid">
            {sortedAthletes.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-primary-muted">
                  Belum ada data atlet yang tersimpan. Silakan masukkan atlet baru melalui form di atas.
                </td>
              </tr>
            ) : (
              sortedAthletes.map((ath) => {
                const assessment = assessments[ath.id];
                const rank = ranks[ath.id] || "-";

                return (
                  <tr
                    key={ath.id}
                    className="hover:bg-surface-elevated/70 transition-colors duration-100"
                  >
                    <td className="py-3 px-3 text-center font-bold text-accent-gold text-sm tabular-nums">
                      #{rank}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-primary flex items-center space-x-2">
                        <span>{ath.name}</span>
                        {ath.hasActiveInjury && (
                          <span title="Laporan Cedera Aktif" className="text-accent-red">
                            <HeartPulse className="w-3.5 h-3.5 inline animate-pulse" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-primary-muted mt-0.5">
                        {ath.weightKg} kg • {ath.weightClass}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold text-primary">
                      {ath.rawScores["C1"]}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-semibold text-primary">
                      {ath.rawScores["C2"]}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-primary-muted">
                      {ath.rawScores["C3"]}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-primary-muted">
                      {ath.rawScores["C4"]}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-primary-muted">
                      {ath.attendanceRate}%
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-accent-blue">
                      {assessment ? assessment.topsisCloseness.toFixed(4) : "-"}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-accent-gold">
                      {assessment
                        ? assessment.certaintyFactor >= 0
                          ? `+${assessment.certaintyFactor.toFixed(4)}`
                          : assessment.certaintyFactor.toFixed(4)
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {assessment && (
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${getCategoryBadge(
                            assessment.category
                          )}`}
                        >
                          {assessment.category.replace(/_/g, " ")}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* Audit Detail Button */}
                        <button
                          onClick={() => onSelectAthlete(ath.id)}
                          className="h-8 px-2.5 bg-surface-elevated hover:bg-border-focus text-primary border border-border-grid text-[10px] font-mono uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                          title="Lihat Rincian Perhitungan Matematis"
                        >
                          <span>AUDIT</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditAthlete(ath)}
                          className="h-8 px-2.5 bg-accent-gold/15 hover:bg-accent-gold/30 text-accent-gold border border-accent-gold/40 text-[10px] font-mono uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                          title="Edit Data Atlet Ini"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>EDIT</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setAthleteToDelete(ath)}
                          className="h-8 px-2 bg-accent-red/15 hover:bg-accent-red/30 text-accent-red border border-accent-red/40 text-[10px] font-mono uppercase tracking-wider transition-colors inline-flex items-center"
                          title="Hapus Atlet dari Daftar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {athleteToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-accent-red/50 max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-accent-red">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-primary">
                KONFIRMASI HAPUS ATLET
              </h3>
            </div>

            <p className="text-xs font-sans text-primary-muted leading-relaxed">
              Apakah Anda yakin ingin menghapus atlet{" "}
              <strong className="text-primary">{athleteToDelete.name}</strong> dari daftar?
              Perankingan TOPSIS dan klasemen akan langsung dihitung ulang secara otomatis.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setAthleteToDelete(null)}
                className="h-10 px-4 bg-surface-elevated hover:bg-border-focus border border-border-grid text-primary text-xs font-mono uppercase tracking-wider transition-colors"
              >
                BATAL
              </button>
              <button
                onClick={confirmDelete}
                className="h-10 px-4 bg-accent-red hover:bg-accent-red/90 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
              >
                YA, HAPUS SEKARANG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
