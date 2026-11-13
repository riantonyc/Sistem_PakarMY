"use client";

import React, { useState, useEffect } from "react";
import {
  AthleteInput,
  CriterionDefinition,
  FinalReadinessAssessment,
  FuzzyAhpResult,
} from "@/lib/engine/types";
import { computeCertaintyFactor } from "@/lib/engine/certainty-factor";
import { computeTopsis } from "@/lib/engine/topsis";
import { evaluateReadiness } from "@/lib/engine/decision-engine";
import {
  User,
  HeartPulse,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  PlusCircle,
  FileText,
  Save,
  X,
  HelpCircle,
  Sparkles,
  Bot,
  Cpu,
  Code,
  LayoutGrid,
  Copy,
  Check,
} from "lucide-react";
import {
  StructuredAiExplanation,
  generateDeterministicStructuredExplanation,
} from "@/lib/services/ai-explanation";

interface IndividualAthleteEvaluatorProps {
  criteria: CriterionDefinition[];
  fahpResult: FuzzyAhpResult;
  existingAthletes: AthleteInput[];
  editingAthlete: AthleteInput | null;
  onAddAthleteToRoster: (newAthlete: AthleteInput) => void;
  onUpdateAthlete: (updatedAthlete: AthleteInput) => void;
  onCancelEdit: () => void;
}

export function IndividualAthleteEvaluator({
  criteria,
  fahpResult,
  existingAthletes,
  editingAthlete,
  onAddAthleteToRoster,
  onUpdateAthlete,
  onCancelEdit,
}: IndividualAthleteEvaluatorProps) {
  // Form state
  const [name, setName] = useState<string>("Fajar Ramadhan");
  const [campName, setCampName] = useState<string>("Khatulistiwa Muaythai Camp");
  const [weightClass, setWeightClass] = useState<string>("Light Welterweight (63.5 kg)");
  const [weightKg, setWeightKg] = useState<number>(63.3);
  const [attendanceRate, setAttendanceRate] = useState<number>(88.0);
  const [hasActiveInjury, setHasActiveInjury] = useState<boolean>(false);
  const [injuryNotes, setInjuryNotes] = useState<string>("");

  // Criteria metrics
  const [c1Power, setC1Power] = useState<number>(14.5); // W/kg
  const [c2Technique, setC2Technique] = useState<number>(4.2); // 1-5
  const [c3Vo2max, setC3Vo2max] = useState<number>(53.0); // ml/kg/min
  const [c4Matches, setC4Matches] = useState<number>(6); // Partai

  // Result state
  const [evaluationResult, setEvaluationResult] = useState<FinalReadinessAssessment | null>(null);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiStructured, setAiStructured] = useState<StructuredAiExplanation | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "json">("card");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiSource, setAiSource] = useState<string | null>(null);
  const [aiErrorMsg, setAiErrorMsg] = useState<string | null>(null);

  // Sync form when editingAthlete changes
  useEffect(() => {
    if (editingAthlete) {
      setName(editingAthlete.name);
      setWeightClass(editingAthlete.weightClass);
      setWeightKg(editingAthlete.weightKg);
      setAttendanceRate(editingAthlete.attendanceRate);
      setHasActiveInjury(editingAthlete.hasActiveInjury);
      setInjuryNotes(editingAthlete.injuryNotes || editingAthlete.injuryDescription || "");
      setC1Power(editingAthlete.rawScores["C1"] || 12.0);
      setC2Technique(editingAthlete.rawScores["C2"] || 3.5);
      setC3Vo2max(editingAthlete.rawScores["C3"] || 50.0);
      setC4Matches(editingAthlete.rawScores["C4"] || 0);

      // Auto-evaluate current athlete
      const cohort = existingAthletes.some((a) => a.id === editingAthlete.id)
        ? existingAthletes
        : [...existingAthletes, editingAthlete];
      const topsisRes = computeTopsis(cohort, criteria, fahpResult.weights);
      const athScore = topsisRes.athleteScores.find((s) => s.athleteId === editingAthlete.id);
      const closenessCi = athScore ? athScore.closenessScore : 0.5;
      const cfRes = computeCertaintyFactor(editingAthlete);
      const decision = evaluateReadiness(editingAthlete, criteria, closenessCi, cfRes.combinedCf);
      setEvaluationResult(decision);
      const initialStructured = generateDeterministicStructuredExplanation(editingAthlete, decision);
      setAiStructured(initialStructured);
      setAiExplanation(JSON.stringify(initialStructured, null, 2));
      setAiSource("Template Terstruktur Standar");
      setIsAdded(true);
    }
  }, [editingAthlete, existingAthletes, criteria, fahpResult]);

  // Quick preset loader
  const handleLoadPreset = (preset: "ready" | "conditional" | "unready" | "clear") => {
    setIsAdded(false);
    if (preset === "ready") {
      setName("Reza Pratama");
      setCampName("Garuda Pontianak Muaythai");
      setWeightKg(63.2);
      setAttendanceRate(95.0);
      setHasActiveInjury(false);
      setInjuryNotes("");
      setC1Power(15.5);
      setC2Technique(4.8);
      setC3Vo2max(57.0);
      setC4Matches(9);
    } else if (preset === "conditional") {
      setName("Andi Kurniawan");
      setCampName("Pontianak Fight Club");
      setWeightKg(63.4);
      setAttendanceRate(84.0);
      setHasActiveInjury(true);
      setInjuryNotes("Memar tulang kering kaki kiri pasca sparring berat");
      setC1Power(13.9);
      setC2Technique(4.0);
      setC3Vo2max(51.0);
      setC4Matches(4);
    } else if (preset === "unready") {
      setName("Ilham Saputra");
      setCampName("Sasana Kapuas Warrior");
      setWeightKg(63.5);
      setAttendanceRate(54.0);
      setHasActiveInjury(false);
      setInjuryNotes("");
      setC1Power(9.2);
      setC2Technique(2.6); // < 3.0 (Kriteria wajib gagal)
      setC3Vo2max(42.0);
      setC4Matches(0);
    } else {
      setName("");
      setCampName("");
      setWeightKg(63.5);
      setAttendanceRate(75.0);
      setHasActiveInjury(false);
      setInjuryNotes("");
      setC1Power(12.0);
      setC2Technique(3.5);
      setC3Vo2max(48.0);
      setC4Matches(2);
      setEvaluationResult(null);
    }
  };

  // Perform calculation
  const handleCalculate = () => {
    if (!name.trim()) {
      alert("Silakan masukkan nama atlet terlebih dahulu!");
      return;
    }

    const targetId = editingAthlete ? editingAthlete.id : `ATH-${Date.now()}`;
    const currentAthlete: AthleteInput = {
      id: targetId,
      name: name.trim(),
      weightClass,
      weightKg: Number(weightKg),
      attendanceRate: Number(attendanceRate),
      hasActiveInjury,
      injuryNotes: hasActiveInjury ? injuryNotes.trim() : undefined,
      injuryDescription: hasActiveInjury ? injuryNotes.trim() : undefined,
      rawScores: {
        C1: Number(c1Power),
        C2: Number(c2Technique),
        C3: Number(c3Vo2max),
        C4: Number(c4Matches),
        C5: Number(attendanceRate),
      },
    };

    // Calculate TOPSIS: compare against cohort
    const otherAthletes = existingAthletes.filter((a) => a.id !== targetId);
    const cohort = [...otherAthletes, currentAthlete];
    const topsisRes = computeTopsis(cohort, criteria, fahpResult.weights);

    const athScore = topsisRes.athleteScores.find((s) => s.athleteId === currentAthlete.id);
    const closenessCi = athScore ? athScore.closenessScore : 0.5;

    // Calculate Certainty Factor
    const cfRes = computeCertaintyFactor(currentAthlete);

    // Evaluate Deterministic Decision Engine
    const decision = evaluateReadiness(
      currentAthlete,
      criteria,
      closenessCi,
      cfRes.combinedCf
    );

    setEvaluationResult(decision);
    const initialStructured = generateDeterministicStructuredExplanation(currentAthlete, decision);
    setAiStructured(initialStructured);
    setAiExplanation(JSON.stringify(initialStructured, null, 2));
    setAiSource("Template Terstruktur Standar");
    setAiErrorMsg(null);
    setIsAdded(false);
  };

  // Copy JSON handler
  const handleCopyJson = () => {
    const jsonToCopy = aiStructured
      ? JSON.stringify(aiStructured, null, 2)
      : (aiExplanation || "");
    navigator.clipboard.writeText(jsonToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Generate AI Explanation via 9Router (model: MyCodeDec)
  const handleGenerateAiExplanation = async () => {
    if (!evaluationResult) return;

    const currentAthlete: AthleteInput = {
      id: editingAthlete ? editingAthlete.id : `ATH-${Date.now()}`,
      name: name.trim(),
      weightClass,
      weightKg: Number(weightKg),
      attendanceRate: Number(attendanceRate),
      hasActiveInjury,
      injuryNotes: hasActiveInjury ? injuryNotes.trim() : undefined,
      injuryDescription: hasActiveInjury ? injuryNotes.trim() : undefined,
      rawScores: {
        C1: Number(c1Power),
        C2: Number(c2Technique),
        C3: Number(c3Vo2max),
        C4: Number(c4Matches),
        C5: Number(attendanceRate),
      },
    };

    setIsLoadingAi(true);
    setAiErrorMsg(null);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athlete: currentAthlete,
          assessment: evaluationResult,
        }),
      });

      const data = await res.json();
      if (data.structured) {
        setAiStructured(data.structured);
      }
      if (data.explanation) {
        setAiExplanation(data.explanation);
      }
      if (data.success && data.source === "9ROUTER_AI") {
        setAiSource(`9Router AI (${data.modelUsed})`);
      } else {
        setAiSource("Fallback Terstruktur Resmi (FR-37)");
        if (data.error) {
          setAiErrorMsg(data.error);
        }
      }
    } catch (err: any) {
      const fallback = generateDeterministicStructuredExplanation(currentAthlete, evaluationResult);
      setAiStructured(fallback);
      setAiExplanation(JSON.stringify(fallback, null, 2));
      setAiSource("Fallback Terstruktur Resmi (FR-37)");
      setAiErrorMsg(err.message);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Save changes (Update or Create)
  const handleSaveToRoster = () => {
    if (!name.trim()) {
      alert("Nama atlet wajib diisi!");
      return;
    }

    const athleteData: AthleteInput = {
      id: editingAthlete ? editingAthlete.id : `ATH-${Date.now()}`,
      name: name.trim(),
      weightClass,
      weightKg: Number(weightKg),
      attendanceRate: Number(attendanceRate),
      hasActiveInjury,
      injuryNotes: hasActiveInjury ? injuryNotes.trim() : undefined,
      injuryDescription: hasActiveInjury ? injuryNotes.trim() : undefined,
      rawScores: {
        C1: Number(c1Power),
        C2: Number(c2Technique),
        C3: Number(c3Vo2max),
        C4: Number(c4Matches),
        C5: Number(attendanceRate),
      },
    };

    if (editingAthlete) {
      onUpdateAthlete(athleteData);
    } else {
      onAddAthleteToRoster(athleteData);
    }
    setIsAdded(true);
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case "SIAP":
        return "bg-accent-green/15 text-accent-green border-accent-green shadow-green-glow";
      case "SIAP_DENGAN_CATATAN":
        return "bg-accent-gold/15 text-accent-gold border-accent-gold shadow-gold-glow";
      case "BELUM_SIAP":
        return "bg-accent-red/15 text-accent-red border-accent-red shadow-red-glow";
      default:
        return "bg-surface-elevated text-primary border-border-grid";
    }
  };

  return (
    <div className="border border-border-grid bg-surface p-5 my-6">
      {/* Editing State Notification Banner */}
      {editingAthlete && (
        <div className="mb-4 p-3 bg-accent-gold/15 border border-accent-gold flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-accent-gold font-bold">
            <Save className="w-4 h-4 animate-bounce" />
            <span>MODE EDIT AKTIF: Anda sedang mengubah data atlet "{editingAthlete.name}"</span>
          </div>
          <button
            onClick={onCancelEdit}
            className="px-2.5 py-1 bg-surface hover:bg-border-focus text-primary border border-border-grid uppercase text-[11px] flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>BATAL EDIT</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-grid gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-accent-gold" />
            <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-primary">
              {editingAthlete ? `EDIT DATA ATLET: ${editingAthlete.name.toUpperCase()}` : "FORM INPUT & EVALUASI INDIVIDU ATLET"}
            </h2>
          </div>
          <p className="text-xs text-primary-muted font-sans mt-0.5">
            {editingAthlete
              ? "Perbarui parameter fisik atau kehadiran atlet, lalu simpan untuk menghitung ulang hasil klasemen secara otomatis."
              : "Masukkan data telemetri fisik, teknis IFMA, dan kondisi riil untuk menilai kesiapan kompetisi secara deterministik."}
          </p>
        </div>

        {/* Quick Presets */}
        {!editingAthlete && (
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[10px] font-mono text-primary-muted uppercase mr-1">CONTOH DATA:</span>
            <button
              type="button"
              onClick={() => handleLoadPreset("ready")}
              className="px-2.5 py-1 text-[11px] font-mono bg-surface-elevated hover:bg-accent-green/20 border border-border-grid hover:border-accent-green/50 text-accent-green transition-colors"
            >
              Siap (Unggulan)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("conditional")}
              className="px-2.5 py-1 text-[11px] font-mono bg-surface-elevated hover:bg-accent-gold/20 border border-border-grid hover:border-accent-gold/50 text-accent-gold transition-colors"
            >
              Cedera (Bersyarat)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("unready")}
              className="px-2.5 py-1 text-[11px] font-mono bg-surface-elevated hover:bg-accent-red/20 border border-border-grid hover:border-accent-red/50 text-accent-red transition-colors"
            >
              Belum Siap
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("clear")}
              className="px-2 py-1 text-[11px] font-mono bg-surface-elevated hover:bg-border-focus border border-border-grid text-primary-muted transition-colors"
              title="Reset formulir"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Main Input Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Side: Profile & General Status (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-surface-elevated border border-border-grid space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-accent-gold border-b border-border-grid pb-2">
              A. IDENTITAS & DIVISI KELAS BERAT
            </h3>

            {/* Nama Atlet */}
            <div>
              <label className="block text-xs font-mono text-primary-muted mb-1 uppercase">
                Nama Lengkap Atlet *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Fajar Ramadhan"
                className="w-full h-11 px-3 bg-canvas border border-border-grid focus:border-accent-gold focus:outline-none text-primary text-sm font-sans"
              />
            </div>

            {/* Sasana / Klub */}
            <div>
              <label className="block text-xs font-mono text-primary-muted mb-1 uppercase">
                Sasana / Camp Asal
              </label>
              <input
                type="text"
                value={campName}
                onChange={(e) => setCampName(e.target.value)}
                placeholder="Misal: Khatulistiwa Muaythai Camp"
                className="w-full h-11 px-3 bg-canvas border border-border-grid focus:border-border-focus focus:outline-none text-primary text-sm font-sans"
              />
            </div>

            {/* Kelas Berat & Berat Riil */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-primary-muted mb-1 uppercase">
                  Kelas Berat (IFMA)
                </label>
                <select
                  value={weightClass}
                  onChange={(e) => setWeightClass(e.target.value)}
                  className="w-full h-11 px-2.5 bg-canvas border border-border-grid focus:border-border-focus focus:outline-none text-primary text-xs font-mono"
                >
                  <option value="Mini Flyweight (45.0 kg)">45.0 kg - Mini Fly</option>
                  <option value="Light Flyweight (48.0 kg)">48.0 kg - Light Fly</option>
                  <option value="Flyweight (51.0 kg)">51.0 kg - Flyweight</option>
                  <option value="Bantamweight (54.0 kg)">54.0 kg - Bantam</option>
                  <option value="Featherweight (57.0 kg)">57.0 kg - Feather</option>
                  <option value="Lightweight (60.0 kg)">60.0 kg - Light</option>
                  <option value="Light Welterweight (63.5 kg)">63.5 kg - Light Welter</option>
                  <option value="Welterweight (67.0 kg)">67.0 kg - Welter</option>
                  <option value="Light Middleweight (71.0 kg)">71.0 kg - Light Middle</option>
                  <option value="Middleweight (75.0 kg)">75.0 kg - Middle</option>
                  <option value="Light Heavyweight (81.0 kg)">81.0 kg - Light Heavy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-primary-muted mb-1 uppercase">
                  Timbangan Riil (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full h-11 px-3 bg-canvas border border-border-grid focus:border-border-focus focus:outline-none text-primary text-sm font-mono tabular-nums font-bold"
                />
              </div>
            </div>

            {/* Kehadiran Latihan TC */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono text-primary-muted uppercase">
                  Kedisiplinan & Kehadiran TC
                </label>
                <span className="text-xs font-mono font-bold text-accent-gold tabular-nums">
                  {attendanceRate}%
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="1"
                value={attendanceRate}
                onChange={(e) => setAttendanceRate(parseFloat(e.target.value))}
                className="w-full accent-accent-gold cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-primary-muted mt-0.5">
                <span>Minimal Disiplin (60%)</span>
                <span>Standar Unggul (&gt;= 80%)</span>
              </div>
            </div>

            {/* Toggle Status Cedera Aktif (K-10) */}
            <div className="pt-2 border-t border-border-grid">
              <div className="flex items-center justify-between p-3 bg-canvas border border-border-grid">
                <div className="flex items-center space-x-2">
                  <HeartPulse
                    className={`w-4 h-4 ${
                      hasActiveInjury ? "text-accent-red animate-pulse" : "text-primary-muted"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-primary block">
                      Status Cedera Aktif (K-10)
                    </span>
                    <span className="text-[10px] text-primary-muted font-sans">
                      Atlet sedang cedera fisik / fase terapi
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasActiveInjury}
                  onChange={(e) => setHasActiveInjury(e.target.checked)}
                  className="w-5 h-5 accent-accent-red cursor-pointer"
                />
              </div>

              {hasActiveInjury && (
                <div className="mt-2.5">
                  <label className="block text-[11px] font-mono text-accent-red mb-1 uppercase font-bold">
                    Catatan Rincian Cedera:
                  </label>
                  <input
                    type="text"
                    value={injuryNotes}
                    onChange={(e) => setInjuryNotes(e.target.value)}
                    placeholder="Misal: Sprain pergelangan kaki kanan derajat 1"
                    className="w-full h-10 px-3 bg-canvas border border-accent-red/60 text-primary text-xs font-sans focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quantitative Criteria Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 bg-surface-elevated border border-border-grid space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-accent-gold border-b border-border-grid pb-2">
              B. DATA KRITERIA PERHITUNGAN
            </h3>

            {/* C1: Daya Anaerobik Relatif */}
            <div className="p-3 bg-canvas border border-border-grid">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="text-xs font-mono font-bold text-accent-gold mr-1.5">[C1]</span>
                  <span className="text-xs font-bold text-primary">Daya Anaerobik Relatif (W/kg)</span>
                  <p className="text-[10px] text-primary-muted font-sans mt-0.5">
                    Kekuatan & ledakan serangan per kg berat badan (Bobot: <strong>42.29%</strong>)
                  </p>
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="22"
                    value={c1Power}
                    onChange={(e) => setC1Power(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-2.5 bg-surface-elevated border border-border-grid text-right font-mono font-bold text-sm text-primary tabular-nums focus:outline-none focus:border-accent-gold"
                  />
                </div>
              </div>
              <div className="text-[10px] font-mono text-primary-muted mt-1">
                Panduan: &gt;= 14.0 W/kg (Ledakan Pukulan/Tendangan Sangat Kuat)
              </div>
            </div>

            {/* C2: Penguasaan Teknik Muaythai (Mandatory Hard Gate K-06) */}
            <div
              className={`p-3 bg-canvas border ${
                c2Technique < 3.0 ? "border-accent-red" : "border-border-grid"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-mono font-bold text-accent-gold">[C2]</span>
                    <span className="text-xs font-bold text-primary">Penguasaan Teknik Muaythai</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-accent-red/20 text-accent-red border border-accent-red/40 uppercase">
                      SYARAT MUTLAK (MIN 3.0)
                    </span>
                  </div>
                  <p className="text-[10px] text-primary-muted font-sans mt-0.5">
                    Kerapihan teknik & kepatuhan aturan IFMA (Skala 1.0 - 5.0)
                  </p>
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={c2Technique}
                    onChange={(e) => setC2Technique(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-2.5 bg-surface-elevated border border-border-grid text-right font-mono font-bold text-sm text-primary tabular-nums focus:outline-none focus:border-accent-gold"
                  />
                </div>
              </div>
              {c2Technique < 3.0 && (
                <div className="mt-2 p-2 bg-accent-red/15 border border-accent-red/40 text-[11px] font-mono text-accent-red flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>PERINGATAN: Di bawah 3.0 otomatis dinyatakan BELUM SIAP demi keselamatan atlet</span>
                </div>
              )}
            </div>

            {/* C3: Daya Tahan Aerobik (VO2max) */}
            <div className="p-3 bg-canvas border border-border-grid">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="text-xs font-mono font-bold text-accent-gold mr-1.5">[C3]</span>
                  <span className="text-xs font-bold text-primary">Daya Tahan Kardio (VO2max)</span>
                  <p className="text-[10px] text-primary-muted font-sans mt-0.5">
                    Kapasitas napas untuk bertarung stabil 3 ronde penuh (ml/kg/min)
                  </p>
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="70"
                    value={c3Vo2max}
                    onChange={(e) => setC3Vo2max(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-2.5 bg-surface-elevated border border-border-grid text-right font-mono font-bold text-sm text-primary tabular-nums focus:outline-none focus:border-accent-gold"
                  />
                </div>
              </div>
              <div className="text-[10px] font-mono text-primary-muted mt-1">
                Panduan: &gt;= 52.0 ml/kg/min (Stamina sangat tahan banting)
              </div>
            </div>

            {/* C4: Pengalaman Bertanding */}
            <div className="p-3 bg-canvas border border-border-grid">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="text-xs font-mono font-bold text-accent-gold mr-1.5">[C4]</span>
                  <span className="text-xs font-bold text-primary">Pengalaman Bertanding Resmi</span>
                  <p className="text-[10px] text-primary-muted font-sans mt-0.5">
                    Jumlah partai kejuaraan resmi yang pernah dijalani atlet
                  </p>
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="50"
                    value={c4Matches}
                    onChange={(e) => setC4Matches(parseInt(e.target.value) || 0)}
                    className="w-full h-10 px-2.5 bg-surface-elevated border border-border-grid text-right font-mono font-bold text-sm text-primary tabular-nums focus:outline-none focus:border-accent-gold"
                  />
                </div>
              </div>
              <div className="text-[10px] font-mono text-primary-muted mt-1">
                Panduan: &gt;= 5 partai (Jam terbang tanding sudah matang)
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-border-grid flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleCalculate}
                className="w-full sm:flex-1 h-13 bg-accent-gold hover:bg-accent-gold/90 text-black font-display font-bold text-base uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>HITUNG KESIAPAN (CALCULATE)</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToRoster}
                className={`w-full sm:w-auto h-13 px-5 font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 ${
                  editingAthlete
                    ? "bg-accent-green hover:bg-accent-green/90 text-white"
                    : "bg-surface-elevated hover:bg-border-focus border border-accent-blue/50 text-accent-blue"
                }`}
              >
                {editingAthlete ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                <span>{editingAthlete ? "SIMPAN PEMBARUAN ATLET" : "TAMBAH KE KLASEMEN"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Calculation Result Display */}
      {evaluationResult && (
        <div className="mt-8 border-t-2 border-accent-gold pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-accent-gold" />
              <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-primary">
                HASIL PENILAIAN RESMI KESIAPAN ATLET
              </h3>
            </div>
            <span className="text-xs font-mono text-primary-muted">
              ATLET: <strong className="text-primary">{name.toUpperCase()}</strong> ({weightClass})
            </span>
          </div>

          {/* Verdict Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Verdict Category Badge */}
            <div className="p-4 bg-surface-elevated border border-border-grid md:col-span-1 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-primary-muted tracking-wider">
                STATUS KELAYAKAN TANDING:
              </span>
              <div className="my-2">
                <span
                  className={`inline-block px-3 py-1.5 text-base font-display font-extrabold uppercase tracking-tight border ${getCategoryBadgeClass(
                    evaluationResult.category
                  )}`}
                >
                  {evaluationResult.category.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-[11px] font-sans text-primary-muted leading-tight">
                {evaluationResult.category === "SIAP"
                  ? "Direkomendasikan bertanding di arena resmi."
                  : evaluationResult.category === "SIAP_DENGAN_CATATAN"
                  ? "Memerlukan peninjauan tim pelatih / dokter."
                  : "Belum memenuhi ambang kompetisi resmi."}
              </p>
            </div>

            {/* TOPSIS Closeness Ci */}
            <div className="p-4 bg-surface-elevated border border-border-grid md:col-span-1">
              <div className="flex justify-between items-center text-primary-muted text-xs font-mono">
                <span>SKOR KEDEKATAN FISIK (C_i)</span>
              </div>
              <div className="text-3xl font-mono font-bold text-accent-blue mt-2 tabular-nums">
                {evaluationResult.topsisCloseness.toFixed(4)}
              </div>
              <div className="text-[11px] font-sans text-primary-muted mt-1 leading-snug">
                Kemiripan fisik dengan Juara Ideal:{" "}
                <strong className="text-primary font-mono">{(evaluationResult.topsisCloseness * 100).toFixed(1)}%</strong>
              </div>
            </div>

            {/* Certainty Factor */}
            <div className="p-4 bg-surface-elevated border border-border-grid md:col-span-1">
              <div className="flex justify-between items-center text-primary-muted text-xs font-mono">
                <span>FAKTOR KEYAKINAN (CF)</span>
              </div>
              <div className="text-3xl font-mono font-bold text-accent-gold mt-2 tabular-nums">
                {evaluationResult.certaintyFactor >= 0
                  ? `+${evaluationResult.certaintyFactor.toFixed(4)}`
                  : evaluationResult.certaintyFactor.toFixed(4)}
              </div>
              <div className="text-[11px] font-sans text-primary-muted mt-1 leading-snug">
                Kekuatan fakta lapangan:{" "}
                <strong className="text-accent-gold font-mono">{(evaluationResult.certaintyFactor * 100).toFixed(1)}%</strong>
              </div>
            </div>

            {/* Safety & Gate Alerts */}
            <div className="p-4 bg-surface-elevated border border-border-grid md:col-span-1 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase text-primary-muted tracking-wider">
                AUDIT KESELAMATAN & GATE:
              </span>
              <div className="space-y-1.5 my-1">
                {evaluationResult.medicalAlert ? (
                  <div className="flex items-center space-x-1.5 text-accent-red text-xs font-mono font-bold">
                    <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
                    <span>PERINGATAN CEDERA AKTIF</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 text-accent-green text-xs font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>BEBAS CEDERA AKTIF</span>
                  </div>
                )}

                {evaluationResult.mandatoryCriteriaViolations.length > 0 ? (
                  <div className="flex items-center space-x-1.5 text-accent-red text-xs font-mono font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>GAGAL SYARAT WAJIB</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 text-accent-green text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SYARAT WAJIB TERPENUHI</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-mono text-primary-muted">
                {evaluationResult.isBorderline ? "Status: Kasus Batas (Perlu Tinjauan)" : "Status: Non-Borderline"}
              </span>
            </div>
          </div>

          {/* Contextual Plain-Language Explanation for Non-Technical Users */}
          <div className="mt-4 p-4 bg-surface-elevated border border-accent-gold/40">
            <div className="flex items-center space-x-2 text-accent-gold font-bold text-xs uppercase font-mono mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Arti Hasil Penilaian Ini Bagi Pelatih & Atlet (Bahasa Sederhana)</span>
            </div>
            <div className="text-xs text-primary-muted space-y-2 leading-relaxed">
              <p>
                • <strong>Kebugaran Fisik ({ (evaluationResult.topsisCloseness * 100).toFixed(0) }% dari Standar Juara):</strong>{" "}
                {evaluationResult.topsisCloseness >= 0.7
                  ? "Atlet memiliki kemampuan fisik dan teknik yang sangat mendekati profil atlet juara di kelas berat ini."
                  : evaluationResult.topsisCloseness >= 0.45
                  ? "Kondisi fisik atlet sudah cukup lumayan, namun masih ada beberapa parameter (seperti stamina atau kekuatan pukulan) yang perlu ditingkatkan."
                  : "Kondisi fisik atlet saat ini masih jauh dari standar atlet kejuaraan."}
              </p>
              <p>
                • <strong>Keyakinan Fakta Lapangan ({ (evaluationResult.certaintyFactor * 100).toFixed(0) }%):</strong>{" "}
                {evaluationResult.certaintyFactor >= 0.4
                  ? "Catatan absensi latihan dan performa di sasana sangat meyakinkan dan mendukung atlet untuk siap berlaga."
                  : evaluationResult.certaintyFactor >= 0
                  ? "Bukti kesiapan di sasana berada pada level sedang/pas-pasan."
                  : "Ada faktor negatif nyata (seperti cedera aktif atau malas hadir latihan) yang membahayakan jika atlet dipaksakan bertanding."}
              </p>
              {evaluationResult.medicalAlert && (
                <p className="text-accent-red font-bold">
                  ⚠️ PENTING: Karena atlet memiliki catatan cedera aktif, wajib meminta persetujuan dan pemeriksaan dari dokter tim sebelum boleh bertanding di atas ring!
                </p>
              )}
            </div>
          </div>

          {/* Detailed Narrative Explanation & 9Router AI Trigger */}
          <div className="mt-4 p-4 bg-surface-dim border border-border-grid space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border-grid gap-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-accent-green font-bold uppercase">
                <FileText className="w-4 h-4" />
                <span>
                  {aiSource ? `EVALUASI TERSTRUKTUR [${aiSource}]` : "EVALUASI TERSTRUKTUR (AUDIT-PROOF)"}
                </span>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                {/* View Mode Toggle */}
                <div className="inline-flex border border-border-grid bg-surface-elevated p-0.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setViewMode("card")}
                    className={`px-2.5 py-1 flex items-center space-x-1.5 transition-colors ${
                      viewMode === "card"
                        ? "bg-accent-gold text-bg-page font-bold"
                        : "text-primary-muted hover:text-primary"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>KARTU</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("json")}
                    className={`px-2.5 py-1 flex items-center space-x-1.5 transition-colors ${
                      viewMode === "json"
                        ? "bg-accent-gold text-bg-page font-bold"
                        : "text-primary-muted hover:text-primary"
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>JSON RAW</span>
                  </button>
                </div>

                {/* Copy JSON Button */}
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="h-8 px-2.5 bg-surface-elevated hover:bg-border-focus border border-border-grid text-primary-muted hover:text-primary text-xs font-mono flex items-center space-x-1.5 transition-colors"
                  title="Salin JSON ke Clipboard"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "TERSALIN!" : "SALIN JSON"}</span>
                </button>

                {/* 9Router Button */}
                <button
                  type="button"
                  onClick={handleGenerateAiExplanation}
                  disabled={isLoadingAi}
                  className="h-8 px-3 bg-surface-elevated hover:bg-border-focus border border-accent-gold/50 text-accent-gold text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                  title="Panggil 9Router lokal dengan model MyCodeDec"
                >
                  <Cpu className={`w-3.5 h-3.5 ${isLoadingAi ? "animate-spin" : ""}`} />
                  <span>
                    {isLoadingAi ? "MENGHUBUNGI 9ROUTER..." : "🤖 GENERATE VIA AI"}
                  </span>
                </button>
              </div>
            </div>

            {aiErrorMsg && (
              <div className="p-2.5 bg-accent-gold/15 border border-accent-gold/40 text-[11px] font-mono text-accent-gold flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Status 9Router:</strong> {aiErrorMsg}
                  <div className="text-[10px] text-primary-muted mt-0.5">
                    Sistem otomatis menggunakan narasi deterministik terstruktur sesuai regulasi SRS FR-37.
                  </div>
                </div>
              </div>
            )}

            {/* View Mode: Structured Cards */}
            {viewMode === "card" && aiStructured && (
              <div className="space-y-4">
                {/* 1. Ringkasan Eksekutif */}
                <div className="p-3.5 bg-surface-elevated border-l-4 border-l-accent-gold border border-border-grid">
                  <div className="text-[10px] font-mono text-accent-gold uppercase tracking-wider font-bold mb-1">
                    RINGKASAN EKSEKUTIF RESMI
                  </div>
                  <p className="text-sm font-sans text-primary leading-relaxed">
                    {aiStructured.ringkasanEksekutif}
                  </p>
                </div>

                {/* 2. Grid Analisis 5 Kriteria */}
                <div>
                  <div className="text-[11px] font-mono text-primary-muted uppercase tracking-wider font-bold mb-2">
                    ANALISIS MATEMATIS & PARAMETER FISIK (C1 - C5)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {/* C1 */}
                    <div className="p-3 bg-surface-elevated border border-border-grid flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-primary-muted">
                          <span>C1 DAYA ANAEROBIK</span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold border ${
                              aiStructured.analisisKriteria.c1Anaerobik.status === "BAIK"
                                ? "text-accent-green border-accent-green/40 bg-accent-green/10"
                                : aiStructured.analisisKriteria.c1Anaerobik.status === "CUKUP"
                                ? "text-accent-gold border-accent-gold/40 bg-accent-gold/10"
                                : "text-accent-red border-accent-red/40 bg-accent-red/10"
                            }`}
                          >
                            {aiStructured.analisisKriteria.c1Anaerobik.status}
                          </span>
                        </div>
                        <div className="text-xl font-mono font-bold text-primary mt-1.5 tabular-nums">
                          {aiStructured.analisisKriteria.c1Anaerobik.nilai}{" "}
                          <span className="text-xs text-primary-muted font-normal">
                            {aiStructured.analisisKriteria.c1Anaerobik.satuan}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-primary-muted mt-2 leading-tight">
                        {aiStructured.analisisKriteria.c1Anaerobik.evaluasi}
                      </p>
                    </div>

                    {/* C2 */}
                    <div className="p-3 bg-surface-elevated border border-border-grid flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-primary-muted">
                          <span>C2 TEKNIK DASAR</span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold border ${
                              aiStructured.analisisKriteria.c2Teknik.status === "BAIK"
                                ? "text-accent-green border-accent-green/40 bg-accent-green/10"
                                : aiStructured.analisisKriteria.c2Teknik.status === "CUKUP"
                                ? "text-accent-gold border-accent-gold/40 bg-accent-gold/10"
                                : "text-accent-red border-accent-red/40 bg-accent-red/10"
                            }`}
                          >
                            {aiStructured.analisisKriteria.c2Teknik.status}
                          </span>
                        </div>
                        <div className="text-xl font-mono font-bold text-primary mt-1.5 tabular-nums">
                          {aiStructured.analisisKriteria.c2Teknik.nilai} / 5.0
                        </div>
                      </div>
                      <p className="text-[11px] text-primary-muted mt-2 leading-tight">
                        {aiStructured.analisisKriteria.c2Teknik.evaluasi}
                      </p>
                    </div>

                    {/* C3 */}
                    <div className="p-3 bg-surface-elevated border border-border-grid flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-primary-muted">
                          <span>C3 VO2MAX (AEROBIK)</span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold border ${
                              aiStructured.analisisKriteria.c3Vo2max.status === "BAIK"
                                ? "text-accent-green border-accent-green/40 bg-accent-green/10"
                                : aiStructured.analisisKriteria.c3Vo2max.status === "CUKUP"
                                ? "text-accent-gold border-accent-gold/40 bg-accent-gold/10"
                                : "text-accent-red border-accent-red/40 bg-accent-red/10"
                            }`}
                          >
                            {aiStructured.analisisKriteria.c3Vo2max.status}
                          </span>
                        </div>
                        <div className="text-xl font-mono font-bold text-primary mt-1.5 tabular-nums">
                          {aiStructured.analisisKriteria.c3Vo2max.nilai}{" "}
                          <span className="text-xs text-primary-muted font-normal">
                            {aiStructured.analisisKriteria.c3Vo2max.satuan}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-primary-muted mt-2 leading-tight">
                        {aiStructured.analisisKriteria.c3Vo2max.evaluasi}
                      </p>
                    </div>

                    {/* C4 */}
                    <div className="p-3 bg-surface-elevated border border-border-grid flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-primary-muted">
                          <span>C4 PENGALAMAN</span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold border ${
                              aiStructured.analisisKriteria.c4Pengalaman.status === "MATANG"
                                ? "text-accent-green border-accent-green/40 bg-accent-green/10"
                                : aiStructured.analisisKriteria.c4Pengalaman.status === "MENENGAH"
                                ? "text-accent-gold border-accent-gold/40 bg-accent-gold/10"
                                : "text-primary-muted border-border-grid bg-surface-dim"
                            }`}
                          >
                            {aiStructured.analisisKriteria.c4Pengalaman.status}
                          </span>
                        </div>
                        <div className="text-xl font-mono font-bold text-primary mt-1.5 tabular-nums">
                          {aiStructured.analisisKriteria.c4Pengalaman.nilai}{" "}
                          <span className="text-xs text-primary-muted font-normal">
                            {aiStructured.analisisKriteria.c4Pengalaman.satuan}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-primary-muted mt-2 leading-tight">
                        {aiStructured.analisisKriteria.c4Pengalaman.evaluasi}
                      </p>
                    </div>

                    {/* C5 Kedisiplinan */}
                    <div className="p-3 bg-surface-elevated border border-border-grid flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-primary-muted">
                          <span>C5 KEDISIPLINAN</span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold border ${
                              aiStructured.analisisKriteria.kedisiplinanKehadiran.status === "DISIPLIN_TINGGI"
                                ? "text-accent-green border-accent-green/40 bg-accent-green/10"
                                : aiStructured.analisisKriteria.kedisiplinanKehadiran.status === "CUKUP"
                                ? "text-accent-gold border-accent-gold/40 bg-accent-gold/10"
                                : "text-accent-red border-accent-red/40 bg-accent-red/10"
                            }`}
                          >
                            {aiStructured.analisisKriteria.kedisiplinanKehadiran.status}
                          </span>
                        </div>
                        <div className="text-xl font-mono font-bold text-primary mt-1.5 tabular-nums">
                          {aiStructured.analisisKriteria.kedisiplinanKehadiran.persentase}%
                        </div>
                      </div>
                      <p className="text-[11px] text-primary-muted mt-2 leading-tight">
                        {aiStructured.analisisKriteria.kedisiplinanKehadiran.evaluasi}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Kolom Audit Medis, Berat & Sistem Pakar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Sistem Pakar TOPSIS & CF */}
                  <div className="p-3.5 bg-surface-elevated border border-border-grid space-y-2">
                    <div className="text-[10px] font-mono text-accent-gold uppercase tracking-wider font-bold">
                      AUDIT METODE HIBRIDA (TOPSIS & CERTAINTY FACTOR)
                    </div>
                    <div className="text-xs text-primary-muted space-y-1.5 leading-relaxed">
                      <p>
                        • <strong>Kedekatan TOPSIS ({aiStructured.analisisSistemPakar.skorTopsisCi.toFixed(4)}):</strong>{" "}
                        {aiStructured.analisisSistemPakar.interpretasiTopsis}
                      </p>
                      <p>
                        • <strong>Certainty Factor ({aiStructured.analisisSistemPakar.certaintyFactorCf.toFixed(4)}):</strong>{" "}
                        {aiStructured.analisisSistemPakar.interpretasiCf}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border-grid">
                      <div className="text-[10px] font-mono text-primary-muted uppercase mb-1">
                        Kaidah IFMA Aktif:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {aiStructured.analisisSistemPakar.aturanAktif.map((r, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 bg-surface-dim border border-border-grid text-primary-muted"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Audit Medis & Berat */}
                  <div className="p-3.5 bg-surface-elevated border border-border-grid space-y-2">
                    <div className="text-[10px] font-mono text-accent-gold uppercase tracking-wider font-bold">
                      AUDIT KESEHATAN MEDIS & BERAT BADAN
                    </div>
                    <div className="text-xs text-primary-muted space-y-1.5 leading-relaxed">
                      <p>
                        • <strong>Status Cedera:</strong>{" "}
                        <span
                          className={
                            aiStructured.auditMedisDanBeratBadan.peringatanMedis
                              ? "text-accent-red font-bold"
                              : "text-accent-green"
                          }
                        >
                          {aiStructured.auditMedisDanBeratBadan.statusCedera}
                        </span>
                        {aiStructured.auditMedisDanBeratBadan.catatanCedera && (
                          <span className="text-primary-muted">
                            {" "}
                            — {aiStructured.auditMedisDanBeratBadan.catatanCedera}
                          </span>
                        )}
                      </p>
                      <p>
                        • <strong>Analisis Berat Badan:</strong> {aiStructured.auditMedisDanBeratBadan.analisisBerat}
                      </p>
                    </div>
                    {aiStructured.auditMedisDanBeratBadan.peringatanMedis && (
                      <div className="p-2 bg-accent-red/10 border border-accent-red/30 text-[11px] font-mono text-accent-red">
                        ⚠️ Wajib clearance dokter spesialis olahraga sebelum verifikasi timbang badan resmi.
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Rekomendasi Pelatih & Instruksi Operasional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Rekomendasi Pelatih */}
                  <div className="p-3.5 bg-surface-elevated border border-border-grid">
                    <div className="text-[10px] font-mono text-accent-green uppercase tracking-wider font-bold mb-2">
                      REKOMENDASI PROGRAM PELATIH SASANA
                    </div>
                    <ul className="text-xs text-primary space-y-1.5 list-disc list-inside">
                      {aiStructured.rekomendasiPelatih.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instruksi Operasional */}
                  <div className="p-3.5 bg-surface-elevated border border-border-grid">
                    <div className="text-[10px] font-mono text-accent-gold uppercase tracking-wider font-bold mb-2">
                      INSTRUKSI OPERASIONAL HARI-H KEJUARAAN
                    </div>
                    <ul className="text-xs text-primary space-y-1.5 list-disc list-inside">
                      {aiStructured.instruksiOperasional.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 5. Kesimpulan Akhir & Arahan Manajerial Resmi */}
                <div className="p-4 bg-surface-elevated border-2 border-accent-gold/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-border-grid gap-2">
                    <div className="flex items-center space-x-2 text-xs font-mono text-accent-gold font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-accent-gold" />
                      <span>KESIMPULAN RESMI & ARAHAN MANAJERIAL PENGKOT MUAYTHAI</span>
                    </div>
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-tight border ${
                        aiStructured.keputusanFinal === "SIAP"
                          ? "text-accent-green border-accent-green/40 bg-accent-green/10"
                          : aiStructured.keputusanFinal === "SIAP_DENGAN_CATATAN"
                          ? "text-accent-gold border-accent-gold/40 bg-accent-gold/10"
                          : "text-accent-red border-accent-red/40 bg-accent-red/10"
                      }`}
                    >
                      STATUS KEPUTUSAN: {aiStructured.keputusanFinal.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="text-xs font-sans text-primary leading-relaxed whitespace-pre-line space-y-2">
                    {aiStructured.kesimpulan}
                  </div>

                  <div className="pt-2 border-t border-border-grid flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-primary-muted gap-1">
                    <span>OTORITAS: PENGURUS KOTA MUAYTHAI KOTA PONTIANAK</span>
                    <span>STANDAR REGULASI: IFMA RULES &amp; GUIDELINES</span>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode: Raw JSON */}
            {(viewMode === "json" || !aiStructured) && (
              <div className="relative">
                <pre className="p-4 bg-bg-page border border-border-grid text-xs font-mono text-primary overflow-x-auto max-h-96 leading-relaxed">
                  {aiStructured
                    ? JSON.stringify(aiStructured, null, 2)
                    : (aiExplanation || evaluationResult.narrativeExplanation)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
