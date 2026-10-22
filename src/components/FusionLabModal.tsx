"use client";

import React from "react";
import { Sparkles, X, AlertTriangle, Zap, CheckCircle2, Flame, ShieldAlert } from "lucide-react";
import { AlgorithmFusionRecipe, AlgorithmMutationStatus } from "../game-engine/AlgorithmFusion";
import { sfx } from "../utils/audio";

interface FusionLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: AlgorithmFusionRecipe[];
  mutations: AlgorithmMutationStatus["activeMutations"];
  onActivateFusion: (recipeId: string) => void;
  onRemedyMutation: (mutationType: string) => void;
}

export const FusionLabModal: React.FC<FusionLabModalProps> = ({
  isOpen,
  onClose,
  recipes,
  mutations,
  onActivateFusion,
  onRemedyMutation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-2xl flex flex-col overflow-hidden border border-amber-500/40 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/30 bg-amber-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                ALGORITHM FUSION & MUTATION CHAMBER
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-mono">
                  NOVEL GAME MECHANIC
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Synthesize dual algorithmic abilities to counter dynamic world distortions.
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active World Mutations Section */}
          {mutations.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-red-400 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                ACTIVE ALGORITHM MUTATION CRISES ({mutations.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mutations.map((m, i) => (
                  <div key={i} className="glass-panel-danger p-3.5 rounded-xl border border-red-500/50 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-red-300">{m.type}</span>
                      <span className="text-amber-400 font-bold">{m.turnsRemaining} TURNS REMAINING</span>
                    </div>
                    <p className="text-xs text-gray-300">{m.description}</p>
                    <div className="text-[11px] font-mono text-cyan-300 bg-black/40 p-2 rounded">
                      Remedy: {m.remedyInstruction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fusion Recipes Grid */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-amber-300 font-bold flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              AVAILABLE ALGORITHM FUSIONS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    recipe.active
                      ? "bg-amber-950/30 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                      : recipe.unlocked
                      ? "glass-panel border-slate-700 hover:border-amber-500/50"
                      : "bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-white">{recipe.name}</h4>
                        <div className="text-[10px] font-mono text-amber-400 font-bold">
                          FORMULA: {recipe.formula}
                        </div>
                      </div>
                      {recipe.remainingCooldown > 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-gray-400 border border-slate-700">
                          Cooldown: {recipe.remainingCooldown} turns
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300">{recipe.description}</p>
                    <div className="text-[11px] font-mono text-emerald-400 bg-black/30 p-2 rounded border border-emerald-900/40">
                      ⚡ Benefit: {recipe.bonusEffect}
                    </div>
                    <div className="text-[10px] font-mono text-purple-300 italic">
                      DSA Synergy: {recipe.dsaSynergy}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => {
                        sfx.playFusionChord();
                        onActivateFusion(recipe.id);
                      }}
                      disabled={!recipe.unlocked || recipe.remainingCooldown > 0}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        recipe.remainingCooldown > 0
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                      }`}
                    >
                      {recipe.remainingCooldown > 0 ? "Cooling Down" : "Activate Fusion"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
