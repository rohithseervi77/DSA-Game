"use client";

import React from "react";
import {
  RotateCcw,
  Shield,
  Zap,
  Radio,
  Cpu,
  GraduationCap,
  Sparkles,
  GitFork,
  Dna,
  Database,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { ShieldStation } from "../player/PlayerState";

interface CyberHUDProps {
  energy: number;
  maxEnergy: number;
  shield: number;
  maxShield: number;
  bandwidth: number;
  rewindCharges: number;
  turnCount: number;
  worldThreat: number;
  worldEntropy: number;
  activeShieldStation: ShieldStation | null;
  academicMode: boolean;
  onToggleAcademicMode: () => void;
  onRewind: () => void;
  onRotateDefense: () => void;
  onOpenVault: () => void;
  onOpenKnowledgeTree: () => void;
  onOpenFusionLab: () => void;
  onOpenProfessorDemo: () => void;
  onOpenDNA: () => void;
}

export const CyberHUD: React.FC<CyberHUDProps> = ({
  energy,
  maxEnergy,
  shield,
  maxShield,
  bandwidth,
  rewindCharges,
  turnCount,
  worldThreat,
  worldEntropy,
  activeShieldStation,
  academicMode,
  onToggleAcademicMode,
  onRewind,
  onRotateDefense,
  onOpenVault,
  onOpenKnowledgeTree,
  onOpenFusionLab,
  onOpenProfessorDemo,
  onOpenDNA,
}) => {
  const energyPercent = Math.min(100, Math.max(0, (energy / maxEnergy) * 100));
  const shieldPercent = Math.min(100, Math.max(0, (shield / maxShield) * 100));

  return (
    <header className="w-full glass-panel border-b border-cyan-500/30 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Brand & Cycle Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              NEXUS
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
              <span className="text-cyan-400">THE LIVING ALGORITHM</span>
              <span>•</span>
              <span className="text-amber-400">CYCLE {turnCount}</span>
            </div>
          </div>
        </div>

        {/* Vital Resource Meters */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Energy Bar */}
          <div className="w-36 bg-slate-900/80 p-1.5 rounded-lg border border-slate-700">
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-amber-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Energy
              </span>
              <span className="text-gray-300">{energy}/{maxEnergy}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${energyPercent < 25 ? "bg-red-500" : "bg-amber-400 shadow-[0_0_8px_#f59e0b]"}`}
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>

          {/* Shield Bar (Protected by Circular Queue) */}
          <div className="w-36 bg-slate-900/80 p-1.5 rounded-lg border border-slate-700">
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-cyan-400 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Shield
              </span>
              <span className="text-gray-300">{shield}/{maxShield}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] transition-all duration-300"
                style={{ width: `${shieldPercent}%` }}
              />
            </div>
          </div>

          {/* Circular Queue Shield Station Pill */}
          <button
            onClick={onRotateDefense}
            title="Click to cycle next defense shield frequency (Circular Queue O(1))"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-[11px] hover:border-indigo-400 hover:bg-indigo-900/50 transition-all font-mono"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <div className="text-left">
              <div className="text-[9px] text-gray-400">DEFENSE MATRIX (O(1))</div>
              <div className="text-indigo-300 font-bold">{activeShieldStation?.name || "Aegis Alpha"}</div>
            </div>
          </button>

          {/* Temporal Rewind (LIFO Stack) */}
          <button
            onClick={onRewind}
            disabled={rewindCharges <= 0}
            title="LIFO Stack Pop: Rewinds action history snapshot"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              rewindCharges > 0
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                : "bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REWIND ({rewindCharges})</span>
          </button>
        </div>

        {/* Global DSA Navigation Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Memory Vault Modal */}
          <button
            onClick={onOpenVault}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs text-gray-200 transition-all"
            title="Memory Vault (Hash Table Separate Chaining)"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vault</span>
          </button>

          {/* Knowledge Tree (BST / AVL) */}
          <button
            onClick={onOpenKnowledgeTree}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs text-gray-200 transition-all"
            title="Knowledge Tree (BST & AVL Self-Balancing)"
          >
            <GitFork className="w-3.5 h-3.5 text-purple-400" />
            <span>Tree</span>
          </button>

          {/* Algorithm Fusion Lab */}
          <button
            onClick={onOpenFusionLab}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs text-gray-200 transition-all"
            title="Algorithm Fusion & Mutation Chamber"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fusion</span>
          </button>

          {/* Player Algorithmic DNA Profile */}
          <button
            onClick={onOpenDNA}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs text-gray-200 transition-all"
            title="View your natural Algorithmic DNA Radar Profile"
          >
            <Dna className="w-3.5 h-3.5 text-pink-400" />
            <span>DNA</span>
          </button>

          {/* PROFESSOR DEMO VIVA BUTTON (Standout feature) */}
          <button
            onClick={onOpenProfessorDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-purple-400 transition-all"
            title="Split-Screen Professor Viva Presentation Suite"
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>PROFESSOR DEMO</span>
          </button>

          {/* Academic Mode Reveal Toggle */}
          <button
            onClick={onToggleAcademicMode}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              academicMode
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                : "bg-slate-800/50 border-slate-700 text-gray-400 hover:text-gray-200"
            }`}
          >
            {academicMode ? "ENGINE: REVEALED" : "ACADEMIC MODE"}
          </button>
        </div>
      </div>

      {/* World Telemetry Strip (Entropy & Dynamic Threat) */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-gray-400 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <span>Adaptive World Threat:</span>
            <span className={worldThreat > 50 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {worldThreat}%
            </span>
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span>Graph Entropy:</span>
            <span className="text-purple-400 font-bold">{worldEntropy}%</span>
          </span>
        </div>

        {academicMode && (
          <div className="text-cyan-400 font-mono flex items-center gap-1.5 animate-pulse text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            ACADEMIC ENGINE ACTIVE: All DSA complexities & telemetry exposed in real-time.
          </div>
        )}
      </div>
    </header>
  );
};
