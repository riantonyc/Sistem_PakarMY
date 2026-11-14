"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Sun, Moon, Cpu } from "lucide-react";

interface LlmStatus {
  connected: boolean;
  status: "CHECKING" | "CONNECTED" | "OFFLINE" | "TIMEOUT" | "ERROR";
  model: string;
  modelFound?: boolean;
  totalModels?: number;
  durationMs?: number;
  message?: string;
  endpoint?: string;
}

export function Header() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [llmStatus, setLlmStatus] = useState<LlmStatus>({
    connected: false,
    status: "CHECKING",
    model: "MyCodeDec",
  });
  const [isCheckingLlm, setIsCheckingLlm] = useState(false);

  // Initialize theme from localStorage or document class
  useEffect(() => {
    try {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("spk-theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {}
  };

  // Check LLM Gateway Connection
  const checkLlmConnection = async () => {
    setIsCheckingLlm(true);
    try {
      const res = await fetch("/api/ai-status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLlmStatus(data);
      } else {
        setLlmStatus({
          connected: false,
          status: "ERROR",
          model: "MyCodeDec",
          message: `HTTP ${res.status}`,
        });
      }
    } catch (err: any) {
      setLlmStatus({
        connected: false,
        status: "OFFLINE",
        model: "MyCodeDec",
        message: err.message || "Gagal menghubungi server",
      });
    } finally {
      setIsCheckingLlm(false);
    }
  };

  // Initial check on mount + periodic check every 30s
  useEffect(() => {
    checkLlmConnection();
    const interval = setInterval(checkLlmConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-border-grid bg-surface/90 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Organization Title with Bordered IFMA Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative w-11 h-11 rounded-full border-2 border-accent-gold/80 p-0.5 bg-surface-elevated shadow-gold-glow flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/images/ifma-logo.jpg"
              alt="Logo Resmi IFMA"
              className="w-full h-full object-cover rounded-full"
            />
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

        {/* Tactical Controls & Telemetry Badges */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Engine Deterministic Status */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-none bg-accent-green animate-pulse"></span>
            <span className="text-primary-muted">ENGINE:</span>
            <span className="text-accent-green font-bold">DETERMINISTIC VERIFIED</span>
          </div>

          <div className="hidden lg:block h-4 w-px bg-border-grid"></div>

          {/* Live LLM Connection Status */}
          <div
            className={`flex items-center space-x-2 px-2.5 py-1 border text-xs font-mono transition-colors ${
              llmStatus.connected
                ? "bg-accent-green/10 border-accent-green/40 text-accent-green"
                : llmStatus.status === "CHECKING"
                ? "bg-accent-gold/10 border-accent-gold/40 text-accent-gold"
                : "bg-accent-red/10 border-accent-red/40 text-accent-red"
            }`}
            title={
              llmStatus.connected
                ? `9Router Terhubung (${llmStatus.endpoint || "Port 20128"}). Model: ${llmStatus.model} (${llmStatus.durationMs || 0}ms)`
                : `9Router Tidak Terjangkau: ${llmStatus.message || "Offline"}. Sistem otomatis menggunakan fallback deterministik (FR-37).`
            }
          >
            <div className="flex items-center space-x-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  llmStatus.connected
                    ? "bg-accent-green animate-pulse"
                    : llmStatus.status === "CHECKING"
                    ? "bg-accent-gold animate-ping"
                    : "bg-accent-red"
                }`}
              ></span>
              <Cpu className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {llmStatus.connected ? (
                  <>
                    LLM: <span className="font-bold">{llmStatus.model}</span>
                    <span className="hidden xl:inline ml-1 text-primary-muted font-normal">
                      (TERHUBUNG {llmStatus.durationMs ? `${llmStatus.durationMs}ms` : ""})
                    </span>
                  </>
                ) : llmStatus.status === "CHECKING" ? (
                  "MEMERIKSA LLM..."
                ) : (
                  <>
                    LLM: <span className="font-bold">OFFLINE</span>
                    <span className="hidden xl:inline ml-1 text-primary-muted font-normal">
                      (FALLBACK SIAP)
                    </span>
                  </>
                )}
              </span>
            </div>

            {/* Manual Recheck Button */}
            <button
              onClick={checkLlmConnection}
              disabled={isCheckingLlm}
              title="Cek ulang status koneksi 9Router"
              className="ml-1 p-0.5 hover:bg-surface border border-transparent hover:border-border-grid transition-colors"
            >
              <RefreshCw
                className={`w-3 h-3 text-primary-muted hover:text-primary ${
                  isCheckingLlm ? "animate-spin text-accent-gold" : ""
                }`}
              />
            </button>
          </div>

          <div className="h-4 w-px bg-border-grid"></div>

          {/* Theme Toggle Button (Gelap / Terang) */}
          <button
            onClick={toggleTheme}
            className="h-8 px-2.5 sm:px-3 bg-surface-elevated hover:bg-border-focus border border-border-grid text-primary text-xs font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-sm"
            title={`Beralih ke Tema ${theme === "dark" ? "Terang" : "Gelap"}`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-accent-gold" />
                <span className="hidden sm:inline text-[11px]">TERANG</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-accent-blue" />
                <span className="hidden sm:inline text-[11px]">GELAP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
