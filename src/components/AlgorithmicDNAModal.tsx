"use client";

import React from "react";
import { Dna, X, Award, Shield, Compass, Zap, Search, Database } from "lucide-react";
import { AlgorithmicDNAProfile } from "../player/AlgorithmicDNA";

interface AlgorithmicDNAModalProps {
  isOpen: boolean;
  onClose: () => void;
  dna: AlgorithmicDNAProfile;
}

export const AlgorithmicDNAModal: React.FC<AlgorithmicDNAModalProps> = ({
  isOpen,
  onClose,
  dna,
}) => {
  if (!isOpen) return null;

  const metrics = [
    { label: "Exploration Depth (DFS)", score: dna.explorationDepthScore, icon: Compass, color: "text-purple-400", bar: "bg-purple-500" },
    { label: "Breadth Outreach (BFS)", score: dna.breadthOutreachScore, icon: Shield, color: "text-cyan-400", bar: "bg-cyan-500" },
    { label: "Route Optimization (Dijkstra)", score: dna.optimizationScore, icon: Zap, color: "text-amber-400", bar: "bg-amber-400" },
    { label: "Search Efficiency (Log N)", score: dna.searchEfficiencyScore, icon: Search, color: "text-emerald-400", bar: "bg-emerald-400" },
    { label: "Risk Tolerance (Hazard)", score: dna.riskToleranceScore, icon: Award, color: "text-rose-400", bar: "bg-rose-500" },
    { label: "Memory Vault Mastery", score: dna.memoryMasteryScore, icon: Database, color: "text-indigo-400", bar: "bg-indigo-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl flex flex-col overflow-hidden border border-pink-500/40 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-500/30 bg-pink-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-400">
              <Dna className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                YOUR ALGORITHMIC DNA
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-300 font-mono">
                  PLAYER PROFILE ENGINE
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Computed dynamically from your real gameplay decisions, route selections, and DSA strategies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card & Radar Breakdown */}
        <div className="p-6 space-y-6">
          {/* Archetype Banner */}
          <div className="glass-panel p-4 rounded-xl border border-pink-500/40 bg-pink-950/20 flex items-center gap-4">
            <div className="text-4xl">{dna.archetypeBadge}</div>
            <div>
              <div className="text-[10px] font-mono text-pink-400 uppercase tracking-wider">
                COMPUTED ALGORITHMIC ARCHETYPE
              </div>
              <h3 className="text-xl font-black text-white">{dna.archetypeTitle}</h3>
              <p className="text-xs text-gray-300 mt-1">{dna.algorithmicSummary}</p>
            </div>
          </div>

          {/* Metric Progress Bars */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-gray-400">BEHAVIORAL FOOTPRINT BREAKDOWN:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-gray-300">
                        <Icon className={`w-3.5 h-3.5 ${m.color}`} /> {m.label}
                      </span>
                      <span className={`font-bold ${m.color}`}>{m.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${m.bar} transition-all duration-500`} style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* University Viva Justification */}
          <div className="glass-panel p-3.5 rounded-xl border border-slate-700 text-xs font-mono text-gray-300">
            <div className="text-amber-400 font-bold mb-1">🎓 Viva Defense Justification:</div>
            <p className="text-[11px] leading-relaxed text-gray-300">{dna.vivaDefenseNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
