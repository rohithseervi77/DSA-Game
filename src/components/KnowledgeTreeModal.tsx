"use client";

import React, { useState } from "react";
import { GitFork, X, Shield, RefreshCw, Zap, ArrowRight, Check } from "lucide-react";
import { NexusAVLTree, AVLNode, AVLRotationEvent } from "../data-structures/AVLTree";
import { sfx } from "../utils/audio";

interface KnowledgeTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  avlTree: NexusAVLTree<number, string>;
  onInsertNode: (key: number, value: string) => void;
}

export const KnowledgeTreeModal: React.FC<KnowledgeTreeModalProps> = ({
  isOpen,
  onClose,
  avlTree,
  onInsertNode,
}) => {
  const [insertKey, setInsertKey] = useState<number>(55);
  const [insertValue, setInsertValue] = useState<string>("Planetary Blueprint");

  if (!isOpen) return null;

  const root = avlTree.getRoot();
  const height = avlTree.getTreeHeight();
  const totalNodes = avlTree.size();
  const rotations = avlTree.getRecentRotations();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insertKey) return;
    sfx.playScanPing();
    onInsertNode(Number(insertKey), insertValue || "Sector Codex");
    setInsertKey((prev) => prev + 15);
  };

  // Recursive tree render helper
  const renderNode = (node: AVLNode<number, string> | null, depth: number = 0): React.ReactNode => {
    if (!node) return null;

    const leftH = node.left ? node.left.height : 0;
    const rightH = node.right ? node.right.height : 0;
    const balanceFactor = leftH - rightH;

    return (
      <div className="flex flex-col items-center">
        {/* Node Badge */}
        <div
          className={`px-3 py-2 rounded-xl border text-center font-mono text-xs shadow-lg transition-all ${
            Math.abs(balanceFactor) > 1
              ? "bg-red-950/60 border-red-500 text-red-300"
              : "bg-purple-950/50 border-purple-500/50 text-purple-200"
          }`}
        >
          <div className="font-bold text-sm text-cyan-300">[{node.key}]</div>
          <div className="text-[10px] text-gray-300 truncate max-w-[120px]">{node.value}</div>
          <div className="text-[9px] text-gray-400 mt-1 flex justify-between gap-2 border-t border-purple-500/20 pt-1">
            <span>h: {node.height}</span>
            <span className={Math.abs(balanceFactor) <= 1 ? "text-emerald-400" : "text-red-400"}>
              BF: {balanceFactor}
            </span>
          </div>
        </div>

        {/* Children connectors */}
        {(node.left || node.right) && (
          <div className="flex gap-8 mt-3 relative pt-3 border-t border-purple-500/30">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-gray-400 mb-1">L</span>
              {renderNode(node.left, depth + 1)}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-gray-400 mb-1">R</span>
              {renderNode(node.right, depth + 1)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[90vh] glass-panel rounded-2xl flex flex-col overflow-hidden border border-purple-500/40 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30 bg-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400">
              <GitFork className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                KNOWLEDGE STABILIZATION TREE
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 font-mono">
                  AVL SELF-BALANCING BST (O(log n))
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Total Nodes: {totalNodes} | Strict Height: {height} | Invariant: |Balance Factor| ≤ 1
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

        {/* Action Input */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-300 font-bold">INSERT KEY:</span>
            <input
              type="number"
              value={insertKey}
              onChange={(e) => setInsertKey(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300"
            />
            <input
              type="text"
              placeholder="KNOWLEDGE LABEL..."
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              className="w-48 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold"
            >
              Insert & Auto-Balance
            </button>
          </form>

          {/* Quick Preset Buttons to trigger LL / RR rotations */}
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-gray-400">Trigger Rotations:</span>
            <button
              onClick={() => {
                sfx.playScanPing();
                onInsertNode(insertKey - 10, "Left Trigger");
                onInsertNode(insertKey - 20, "LL Fix");
              }}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
            >
              Test LL Rotation
            </button>
            <button
              onClick={() => {
                sfx.playScanPing();
                onInsertNode(insertKey + 10, "Right Trigger");
                onInsertNode(insertKey + 20, "RR Fix");
              }}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
            >
              Test RR Rotation
            </button>
          </div>
        </div>

        {/* Tree Visualizer & Rotation Log */}
        <div className="flex-1 overflow-auto p-6 flex flex-col items-center">
          {root ? (
            <div className="w-full flex justify-center py-4">{renderNode(root)}</div>
          ) : (
            <div className="text-center text-gray-500 font-mono text-xs py-12">
              No knowledge nodes in tree yet.
            </div>
          )}

          {/* Recent Rotations Box */}
          {rotations.length > 0 && (
            <div className="w-full mt-6 glass-panel p-3.5 rounded-xl border border-purple-500/30">
              <div className="text-xs font-mono text-purple-300 font-bold mb-2 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                AUTOMATIC REBALANCING ROTATION LOG (LL / RR / LR / RL)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                {rotations.map((r, i) => (
                  <div key={i} className="p-2 rounded bg-black/40 border border-purple-900/50 text-gray-300 flex items-center justify-between">
                    <span className="text-amber-400 font-bold">{r.type}</span>
                    <span className="text-gray-400">Unbalanced Node [{r.unbalancedKey}] → Pivot [{r.pivotKey}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
