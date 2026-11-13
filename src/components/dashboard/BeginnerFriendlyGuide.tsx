"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HeartPulse,
  Target,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function BeginnerFriendlyGuide() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-border-grid bg-surface overflow-hidden my-8">
      {/* Accordion Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-surface-dim hover:bg-surface-elevated flex items-center justify-between text-left transition-colors border-b border-border-grid"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent-gold/20 border border-accent-gold/50 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-accent-gold" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-primary">
              PANDUAN MEMAHAMI HASIL PERHITUNGAN (UNTUK PELATIH & PENGURUS)
            </h3>
            <p className="text-xs text-primary-muted font-sans">
              Penjelasan arti angka, skor kedekatan, dan keputusan kesiapan dalam bahasa olahraga sehari-hari
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-primary-muted">
          <span>{isOpen ? "SEMBUNYIKAN PANDUAN" : "BUKA PANDUAN LENGKAP"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Guide Content */}
      {isOpen && (
        <div className="p-5 space-y-6 text-sm font-sans">
          {/* Section 1: Meaning of the 3 Readiness Categories */}
          <div>
            <h4 className="font-display font-bold text-base uppercase tracking-tight text-primary pb-2 border-b border-border-grid flex items-center space-x-2">
              <span>1. Arti 3 Status Rekomendasi Resmi</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {/* SIAP */}
              <div className="p-3.5 bg-surface-elevated border border-accent-green/40">
                <div className="flex items-center space-x-2 text-accent-green font-mono font-bold text-xs uppercase mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SIAP (LOLOS UTAMA)</span>
                </div>
                <p className="text-xs text-primary-muted leading-relaxed">
                  <strong className="text-primary">Artinya:</strong> Fisik atlet prima, pukulan & tendangan bertenaga, kehadiran latihan disiplin (&gt;= 80%), dan bebas dari cedera. Atlet sangat layak masuk susunan tim inti kejuaraan.
                </p>
              </div>

              {/* SIAP DENGAN CATATAN */}
              <div className="p-3.5 bg-surface-elevated border border-accent-gold/40">
                <div className="flex items-center space-x-2 text-accent-gold font-mono font-bold text-xs uppercase mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>SIAP DENGAN CATATAN (BERSYARAT)</span>
                </div>
                <p className="text-xs text-primary-muted leading-relaxed">
                  <strong className="text-primary">Artinya:</strong> Atlet memiliki potensi fisik yang baik, namun ada catatan peringatan — misalnya sedang masa pemulihan cedera ringan atau kehadiran latihan pas-pasan. Perlu izin dokter/pantauan pelatih sebelum bertanding.
                </p>
              </div>

              {/* BELUM SIAP */}
              <div className="p-3.5 bg-surface-elevated border border-accent-red/40">
                <div className="flex items-center space-x-2 text-accent-red font-mono font-bold text-xs uppercase mb-1">
                  <XCircle className="w-4 h-4" />
                  <span>BELUM SIAP (TIDAK DISARANKAN)</span>
                </div>
                <p className="text-xs text-primary-muted leading-relaxed">
                  <strong className="text-primary">Artinya:</strong> Kebugaran belum memadai atau teknik dasar belum aman (&lt; 3.0). Dilarang bertanding demi keselamatan atlet agar tidak cedera parah atau kalah telak di ring.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Deciphering Ci (TOPSIS) & CF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TOPSIS Score */}
            <div className="p-4 bg-surface-elevated border border-border-grid">
              <div className="flex items-center space-x-2 text-accent-blue font-mono font-bold text-xs uppercase mb-2">
                <Target className="w-4 h-4" />
                <span>Skor Kedekatan TOPSIS (C_i) — "Uji Fisik Terhadap Juara"</span>
              </div>
              <p className="text-xs text-primary-muted leading-relaxed">
                Diibaratkan sebagai <strong className="text-primary">persentase kemiripan fisik atlet dengan atlet juara ideal</strong> di kelas beratnya:
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-primary-muted">
                <li>
                  • <strong className="text-primary font-mono font-bold">1.0000 (100%):</strong> Fisik atlet sempurna dan paling mendekati profil benchmark juara.
                </li>
                <li>
                  • <strong className="text-primary font-mono font-bold">&gt;= 0.7000 (70%):</strong> Ambang batas lulus untuk kategori <strong>SIAP</strong>.
                </li>
                <li>
                  • <strong className="text-primary font-mono font-bold">0.4500 - 0.6999:</strong> Masuk rentang <strong>SIAP BERSYARAT</strong>.
                </li>
                <li>
                  • <strong className="text-primary font-mono font-bold">&lt; 0.4500 (&lt; 45%):</strong> Fisik masih jauh di bawah standar atlet kompetisi.
                </li>
              </ul>
            </div>

            {/* Certainty Factor */}
            <div className="p-4 bg-surface-elevated border border-border-grid">
              <div className="flex items-center space-x-2 text-accent-gold font-mono font-bold text-xs uppercase mb-2">
                <Shield className="w-4 h-4" />
                <span>Certainty Factor (CF) — "Tingkat Keyakinan di Lapangan"</span>
              </div>
              <p className="text-xs text-primary-muted leading-relaxed">
                Mengukur <strong className="text-primary">seberapa kuat bukti nyata di tempat latihan</strong> mendukung kesiapan atlet (skala -100% s/d +100%):
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-primary-muted">
                <li>
                  • <strong className="text-accent-green font-mono font-bold">Positif (+0.40 s/d +0.97):</strong> Bukti kuat (hadir rajin &gt;= 80%, teknik bagus, jam terbang banyak) membuktikan atlet siap.
                </li>
                <li>
                  • <strong className="text-accent-gold font-mono font-bold">Netral (0.00 s/d +0.39):</strong> Bukti pas-pasan, ada beberapa catatan yang meragukan.
                </li>
                <li>
                  • <strong className="text-accent-red font-mono font-bold">Negatif (-0.50 s/d -0.80):</strong> Ada faktor bahaya nyata (atlet cedera aktif atau malas latihan &lt; 60%) yang otomatis membatalkan status kelolosan.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Guardrails & Safety Checks */}
          <div className="p-4 bg-surface-dim border border-border-grid">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-accent-gold mb-2">
              ATURAN KESELAMATAN KHUSUS (GUARDRAILS PAKAR IFMA):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-primary-muted">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                <div>
                  <strong className="text-primary">Kriteria Wajib Teknik (K-06):</strong> Jika nilai teknik Muaythai atlet di bawah 3.0 dari 5, sistem otomatis menetapkan <strong>BELUM SIAP</strong> tanpa mempedulikan seberapa kuat fisiknya.
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <HeartPulse className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                <div>
                  <strong className="text-primary">Peringatan Medis Cedera (K-10):</strong> Jika atlet sedang cedera aktif, sistem memicu sanksi nilai keyakinan (-0.70) dan mewajibkan surat rekomendasi resmi dari dokter kontingen.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

