"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { AthleteTable } from "@/components/dashboard/AthleteTable";
import { FuzzyAhpPanel } from "@/components/dashboard/FuzzyAhpPanel";
import { MathBreakdownModal } from "@/components/dashboard/MathBreakdownModal";
import { IndividualAthleteEvaluator } from "@/components/dashboard/IndividualAthleteEvaluator";
import { BeginnerFriendlyGuide } from "@/components/dashboard/BeginnerFriendlyGuide";
import {
  SAMPLE_CRITERIA,
  SAMPLE_FAHP_MATRIX,
  SAMPLE_ATHLETES,
} from "@/lib/engine/test-simulation";
import { computeFuzzyAhp } from "@/lib/engine/fuzzy-ahp";
import { computeTopsis } from "@/lib/engine/topsis";
import { computeCertaintyFactor } from "@/lib/engine/certainty-factor";
import { evaluateReadiness } from "@/lib/engine/decision-engine";
import { AthleteInput, FinalReadinessAssessment } from "@/lib/engine/types";
import { RefreshCw, Trophy, UserCheck, Plus, BookOpen } from "lucide-react";

export default function DashboardPage() {
  const [athletes, setAthletes] = useState<AthleteInput[]>(SAMPLE_ATHLETES);
  const [editingAthlete, setEditingAthlete] = useState<AthleteInput | null>(null);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute live engine state dynamically based on active athletes pool
  const engineState = useMemo(() => {
    // 1. Fuzzy AHP (Chang 1996)
    const fahpResult = computeFuzzyAhp(SAMPLE_FAHP_MATRIX);

    // 2. TOPSIS (Hwang & Yoon 1981)
    const topsisResult = computeTopsis(
      athletes,
      SAMPLE_CRITERIA,
      fahpResult.weights
    );

    // 3. CF and Decision Engine
    const assessments: Record<string, FinalReadinessAssessment> = {};
    const ranks: Record<string, number> = {};

    topsisResult.athleteScores.forEach((athScore) => {
      const ath = athletes.find((a) => a.id === athScore.athleteId)!;
      const cfResult = computeCertaintyFactor(ath);
      const decision = evaluateReadiness(
        ath,
        SAMPLE_CRITERIA,
        athScore.closenessScore,
        cfResult.combinedCf
      );

      assessments[ath.id] = decision;
      ranks[ath.id] = athScore.rank;
    });

    return {
      fahpResult,
      topsisResult,
      assessments,
      ranks,
    };
  }, [athletes]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 350);
  };

  // CRUD: Add Athlete
  const handleAddAthlete = (newAthlete: AthleteInput) => {
    setAthletes((prev) => {
      const filtered = prev.filter((a) => a.id !== newAthlete.id);
      return [newAthlete, ...filtered];
    });
  };

  // CRUD: Edit Athlete
  const handleEditAthlete = (athlete: AthleteInput) => {
    setEditingAthlete(athlete);
    const formElement = document.getElementById("evaluator-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // CRUD: Update Athlete
  const handleUpdateAthlete = (updatedAthlete: AthleteInput) => {
    setAthletes((prev) =>
      prev.map((a) => (a.id === updatedAthlete.id ? updatedAthlete : a))
    );
    setEditingAthlete(null);
  };

  // CRUD: Delete Athlete
  const handleDeleteAthlete = (athleteId: string) => {
    setAthletes((prev) => prev.filter((a) => a.id !== athleteId));
    if (editingAthlete?.id === athleteId) {
      setEditingAthlete(null);
    }
    if (selectedAthleteId === athleteId) {
      setSelectedAthleteId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingAthlete(null);
  };

  const selectedAthlete = useMemo(() => {
    return athletes.find((a) => a.id === selectedAthleteId) || null;
  }, [selectedAthleteId, athletes]);

  const selectedAssessment = useMemo(() => {
    return selectedAthleteId ? engineState.assessments[selectedAthleteId] || null : null;
  }, [selectedAthleteId, engineState.assessments]);

  const selectedTopsisScore = useMemo(() => {
    return (
      engineState.topsisResult.athleteScores.find(
        (s) => s.athleteId === selectedAthleteId
      ) || null
    );
  }, [selectedAthleteId, engineState.topsisResult.athleteScores]);

  return (
    <div className="min-h-screen bg-canvas text-primary pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Telemetry Action Header Strip */}
        <div className="p-4 bg-surface border border-border-grid flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-accent-gold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>PENGURUS KOTA MUAYTHAI KOTA PONTIANAK</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-primary mt-1">
              SISTEM PAKAR PENILAIAN KESIAPAN ATLET MUAYTHAI
            </h1>
            <p className="text-xs text-primary-muted font-sans mt-0.5">
              Standar Regulasi IFMA • Evaluasi Berbasis Fuzzy AHP – TOPSIS – Certainty Factor
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-11 px-4 bg-surface-elevated hover:bg-border-focus border border-border-grid text-primary text-xs font-mono uppercase tracking-wider transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>RE-RUN ENGINE</span>
            </button>
            <div className="h-11 px-4 bg-surface-elevated border border-accent-gold/40 text-accent-gold text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{athletes.length} ATLET TERDAFTAR</span>
            </div>
          </div>
        </div>

        {/* Section 1: Form Input & Evaluasi Individu Atlet (CRUD Create & Update) */}
        <div id="evaluator-form" className="mt-4">
          <IndividualAthleteEvaluator
            criteria={SAMPLE_CRITERIA}
            fahpResult={engineState.fahpResult}
            existingAthletes={athletes}
            editingAthlete={editingAthlete}
            onAddAthleteToRoster={handleAddAthlete}
            onUpdateAthlete={handleUpdateAthlete}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* Section 2: Panduan Membaca Hasil Perhitungan (Ramah Orang Awam) */}
        <BeginnerFriendlyGuide />

        {/* Section 3: Full Division Telemetry Table (CRUD Read & Delete & Edit trigger) */}
        <div className="mt-8">
          <AthleteTable
            athletes={athletes}
            assessments={engineState.assessments}
            ranks={engineState.ranks}
            onSelectAthlete={(id) => setSelectedAthleteId(id)}
            onEditAthlete={handleEditAthlete}
            onDeleteAthlete={handleDeleteAthlete}
          />
        </div>

        {/* Section 4: Fuzzy AHP Criteria Weight Inspection Panel */}
        <div className="mt-8">
          <FuzzyAhpPanel
            fahpResult={engineState.fahpResult}
            criteria={SAMPLE_CRITERIA}
          />
        </div>
      </main>

      {/* Math & Rule Breakdown Modal */}
      {selectedAthleteId && (
        <MathBreakdownModal
          athlete={selectedAthlete}
          assessment={selectedAssessment}
          topsisScore={selectedTopsisScore}
          criteria={SAMPLE_CRITERIA}
          onClose={() => setSelectedAthleteId(null)}
        />
      )}
    </div>
  );
}
