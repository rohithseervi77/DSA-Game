"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  X,
  Play,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Cpu,
  Layers,
  Code2,
  BookOpen,
} from "lucide-react";
import { NEXUS_DSA_SYLLABUS, DSASyllabusItem } from "../academic/SyllabusRegistry";
import { NexusWorldGenerator } from "../world-generation/WorldGenerator";
import { NexusGraphAlgorithms, PathResult, MSTResult } from "../algorithms/GraphAlgorithms";
import { NexusSearchEngine, SearchResult } from "../algorithms/Searching";
import { NexusSortEngine, SortResult } from "../algorithms/Sorting";
import { NexusHuffmanEngine } from "../algorithms/HuffmanCoding";
import { NexusMatrixEngine } from "../algorithms/MatrixAlgorithms";
import { NexusRecurrenceEngine } from "../algorithms/RecurrenceEngine";
import { sfx } from "../utils/audio";

interface ProfessorDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfessorDemoModal: React.FC<ProfessorDemoModalProps> = ({ isOpen, onClose }) => {
  const [selectedConceptId, setSelectedConceptId] = useState<number>(25); // Default to Dijkstra
  const [activeTab, setActiveTab] = useState<"LIVE_EXECUTION" | "VIVA_DEFENSE" | "ASYMPTOTIC_ANALYSIS">("LIVE_EXECUTION");

  // Live execution states
  const [searchQuery, setSearchQuery] = useState<number>(75);
  const [searchOutput, setSearchOutput] = useState<SearchResult<number> | null>(null);
  const [sortOutput, setSortOutput] = useState<SortResult<number> | null>(null);
  const [graphPathOutput, setGraphPathOutput] = useState<PathResult | null>(null);
  const [mstOutput, setMstOutput] = useState<MSTResult | null>(null);
  const [huffmanText, setHuffmanText] = useState<string>("NEXUS_CORE_MATRIX");
  const [huffmanOutput, setHuffmanOutput] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const concept = NEXUS_DSA_SYLLABUS.find((s) => s.id === selectedConceptId) || NEXUS_DSA_SYLLABUS[0];

  useEffect(() => {
    runLiveAlgorithm(selectedConceptId);
  }, [selectedConceptId]);

  const runLiveAlgorithm = (conceptId: number) => {
    sfx.playScanPing();
    setCurrentStepIndex(0);
    const graph = NexusWorldGenerator.createInitialWorld();

    // 25: Dijkstra
    if (conceptId === 25) {
      const res = NexusGraphAlgorithms.dijkstra(graph, "SECTOR_ALPHA_CORE", "SECTOR_OMEGA_GATE", "BALANCED");
      setGraphPathOutput(res);
    }
    // 23: BFS
    else if (conceptId === 23) {
      const res = NexusGraphAlgorithms.bfs(graph, "SECTOR_ALPHA_CORE", "SECTOR_OMEGA_GATE");
      setGraphPathOutput(res);
    }
    // 24: DFS
    else if (conceptId === 24) {
      const res = NexusGraphAlgorithms.dfs(graph, "SECTOR_ALPHA_CORE", "SECTOR_OMEGA_GATE");
      setGraphPathOutput(res);
    }
    // 26: MST
    else if (conceptId === 26) {
      const res = NexusGraphAlgorithms.kruskalMST(graph);
      setMstOutput(res);
    }
    // 10: Binary Search
    else if (conceptId === 10) {
      const sorted = [12, 25, 38, 49, 62, 75, 89, 104, 120, 145, 170, 200];
      const res = NexusSearchEngine.binarySearch(sorted, searchQuery);
      setSearchOutput(res);
    }
    // 11: Jump Search
    else if (conceptId === 11) {
      const sorted = [12, 25, 38, 49, 62, 75, 89, 104, 120, 145, 170, 200];
      const res = NexusSearchEngine.jumpSearch(sorted, searchQuery);
      setSearchOutput(res);
    }
    // 12: Linear Search
    else if (conceptId === 12) {
      const unsorted = [89, 12, 104, 49, 75, 25, 200, 38, 145, 62, 170];
      const res = NexusSearchEngine.linearSearch(unsorted, searchQuery);
      setSearchOutput(res);
    }
    // 16: Merge Sort
    else if (conceptId === 16) {
      const res = NexusSortEngine.mergeSort([85, 24, 63, 45, 17, 31, 96, 50]);
      setSortOutput(res);
    }
    // 17: Quick Sort
    else if (conceptId === 17) {
      const res = NexusSortEngine.quickSort([85, 24, 63, 45, 17, 31, 96, 50]);
      setSortOutput(res);
    }
    // 18: Heap Sort
    else if (conceptId === 18) {
      const res = NexusSortEngine.heapSort([85, 24, 63, 45, 17, 31, 96, 50]);
      setSortOutput(res);
    }
    // 27: Huffman
    else if (conceptId === 27) {
      const res = NexusHuffmanEngine.encode(huffmanText);
      setHuffmanOutput(res);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[92vh] glass-panel-academic rounded-2xl flex flex-col overflow-hidden border border-purple-500/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30 bg-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                PROFESSOR DEMO & ACADEMIC VIVA SUITE
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400 font-mono">
                  ALL 29 SYLLABUS TOPICS
                </span>
              </h2>
              <p className="text-xs text-purple-300 font-mono">
                Real-Time Data Structure & Algorithmic Execution Visualizer
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

        {/* Concept Selector Strip */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-purple-900/40 overflow-x-auto flex items-center gap-2">
          {NEXUS_DSA_SYLLABUS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedConceptId(item.id)}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-mono transition-all border ${
                selectedConceptId === item.id
                  ? "bg-purple-600 text-white border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.5)] font-bold"
                  : "bg-slate-900 text-gray-400 border-slate-800 hover:text-gray-200 hover:border-slate-700"
              }`}
            >
              #{item.id} {item.conceptName}
            </button>
          ))}
        </div>

        {/* Content Split Pane */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Panel: Syllabus Context & Viva Defense Notes (5 cols) */}
          <div className="lg:col-span-5 p-6 border-r border-purple-500/20 bg-slate-950/50 flex flex-col gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                SYLLABUS CONCEPT #{concept.id}
              </span>
              <h3 className="text-xl font-bold text-white">{concept.conceptName}</h3>
              <div className="inline-block px-2 py-1 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                🎮 GAME MECHANIC: {concept.gameplayMechanic}
              </div>
            </div>

            {/* Implementation Details */}
            <div className="glass-panel p-3.5 rounded-xl border border-slate-700 text-xs text-gray-300">
              <div className="font-mono text-purple-300 font-bold mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-purple-400" /> Concrete Code Implementation
              </div>
              <p className="font-mono text-[11px] text-gray-300 leading-relaxed bg-black/40 p-2 rounded">
                {concept.internalImplementation}
              </p>
            </div>

            {/* Complexity Matrix Table */}
            <div className="glass-panel p-3.5 rounded-xl border border-slate-700">
              <div className="font-mono text-amber-300 font-bold text-xs mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" /> Asymptotic Complexity Matrix
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-gray-400 block text-[9px]">BEST CASE</span>
                  <span className="text-emerald-400 font-bold">{concept.bestComplexity}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-gray-400 block text-[9px]">AVERAGE CASE</span>
                  <span className="text-cyan-400 font-bold">{concept.avgComplexity}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-gray-400 block text-[9px]">WORST CASE</span>
                  <span className="text-red-400 font-bold">{concept.worstComplexity}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-gray-400 block text-[9px]">SPACE COMPLEXITY</span>
                  <span className="text-purple-400 font-bold">{concept.spaceComplexity}</span>
                </div>
              </div>
            </div>

            {/* Viva Defense Talking Points */}
            <div className="glass-panel p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/20">
              <div className="font-mono text-purple-300 font-bold text-xs mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Viva Defense Talking Points
              </div>
              <ul className="space-y-1.5 text-xs text-gray-300">
                {concept.vivaDefenseTalkingPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Panel: Interactive Algorithm Trace & Live Telemetry (7 cols) */}
          <div className="lg:col-span-7 p-6 flex flex-col gap-4 bg-slate-950/80">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-mono text-purple-300 font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" /> LIVE ALGORITHM TRACE & TELEMETRY
              </h4>
              <button
                onClick={() => runLiveAlgorithm(selectedConceptId)}
                className="flex items-center gap-1 px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all"
              >
                <Play className="w-3 h-3" /> Re-Execute
              </button>
            </div>

            {/* Dynamic Interactive Demonstrator based on category */}
            {/* 1. Dijkstra / BFS / DFS Graph Visualization */}
            {(selectedConceptId === 25 || selectedConceptId === 23 || selectedConceptId === 24) && graphPathOutput && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-gray-400">TARGET: SECTOR_ALPHA_CORE → SECTOR_OMEGA_GATE</span>
                    <span className="text-cyan-400 font-bold">Time: {graphPathOutput.timeTakenUs} µs</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                    {graphPathOutput.path.map((node, i) => (
                      <React.Fragment key={node}>
                        <span className="px-2 py-1 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                          {node}
                        </span>
                        {i < graphPathOutput.path.length - 1 && <span className="text-amber-400">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-4 text-xs font-mono text-gray-400">
                    <span>Hops: {graphPathOutput.totalDistance}</span>
                    <span className="text-amber-400">Danger Encountered: {graphPathOutput.totalDanger}</span>
                    <span className="text-emerald-400">Energy Cost: {graphPathOutput.totalEnergy}</span>
                  </div>
                </div>

                {/* Step Trace */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 max-h-48 overflow-y-auto font-mono text-[11px] space-y-1.5">
                  <div className="text-gray-400 text-[10px] uppercase">Step-by-Step Priority Queue & Relaxation Trace:</div>
                  {graphPathOutput.steps.map((st, i) => (
                    <div key={i} className="text-gray-300 border-l-2 border-cyan-500/50 pl-2">
                      <span className="text-cyan-400 font-bold">[{i + 1}]</span> {st.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Kruskal / Prim MST */}
            {selectedConceptId === 26 && mstOutput && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-gray-400">ALGORITHM: {mstOutput.algorithm} MINIMUM SPANNING TREE</span>
                    <span className="text-cyan-400 font-bold">{mstOutput.timeTakenUs} µs</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold mb-2">
                    Total Optimal Construction Weight: {mstOutput.totalCost} Energy Units
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {mstOutput.edges.map((e) => (
                      <div key={e.id} className="p-1.5 bg-black/40 rounded border border-slate-800 text-gray-300">
                        {e.source.slice(7, 18)} ⟷ {e.target.slice(7, 18)} (Cost: {e.distance + e.energyCost})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Search Visualizer */}
            {(selectedConceptId === 10 || selectedConceptId === 11 || selectedConceptId === 12) && searchOutput && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">Search Target Key:</span>
                  <input
                    type="number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(Number(e.target.value))}
                    className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-cyan-300"
                  />
                  <button
                    onClick={() => runLiveAlgorithm(selectedConceptId)}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-mono"
                  >
                    Scan
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">FOUND INDEX:</span>
                    <span className="text-cyan-400 font-bold">{searchOutput.foundIndex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">COMPARISONS COUNT:</span>
                    <span className="text-amber-400 font-bold">{searchOutput.comparisons} Probes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">EXECUTION TIME:</span>
                    <span className="text-emerald-400 font-bold">{searchOutput.timeTakenUs} µs</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 max-h-48 overflow-y-auto font-mono text-[11px] space-y-1">
                  <div className="text-gray-400 text-[10px]">PROBE ITERATIONS:</div>
                  {searchOutput.steps.map((st, i) => (
                    <div key={i} className="text-gray-300 border-l-2 border-amber-500/50 pl-2">
                      <span className="text-amber-400 font-bold">Probe #{i + 1}:</span> {st.details}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Sorting Visualizer */}
            {(selectedConceptId === 16 || selectedConceptId === 17 || selectedConceptId === 18) && sortOutput && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">SORTED OUTPUT:</span>
                    <span className="text-emerald-400 font-bold">[{sortOutput.sortedArray.join(", ")}]</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Comparisons: {sortOutput.comparisons}</span>
                    <span>Swaps/Partitions: {sortOutput.swaps}</span>
                    <span className="text-cyan-400 font-bold">{sortOutput.timeTakenUs} µs</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 max-h-48 overflow-y-auto font-mono text-[11px] space-y-1">
                  <div className="text-gray-400 text-[10px]">PARTITION SNAPSHOTS:</div>
                  {sortOutput.steps.map((st) => (
                    <div key={st.stepIndex} className="text-gray-300 border-l-2 border-purple-500/50 pl-2">
                      <span className="text-purple-400">Step {st.stepIndex}:</span> {st.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Huffman Coding Transceiver */}
            {selectedConceptId === 27 && huffmanOutput && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                  <div>
                    <span className="text-gray-400">ORIGINAL STRING ({huffmanOutput.originalBits} bits):</span>
                    <div className="text-white font-bold">{huffmanOutput.originalText}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">ENCODED BITSTREAM ({huffmanOutput.compressedBits} bits):</span>
                    <div className="text-cyan-400 break-all bg-black/40 p-2 rounded text-[10px]">
                      {huffmanOutput.encodedBitString}
                    </div>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>COMPRESSION RATIO: {huffmanOutput.compressionRatioPercent}%</span>
                    <span>ROUNDTRIP MATCH: {huffmanOutput.decodedText === huffmanOutput.originalText ? "✓ 100% LOSSLESS" : "MISMATCH"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback for other concepts: Data Structure Summary Snapshot */}
            {![25, 23, 24, 26, 10, 11, 12, 16, 17, 18, 27].includes(selectedConceptId) && (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono space-y-3">
                <div className="text-amber-300 font-bold">MECHANISM ACTIVE IN RUNNING GAME</div>
                <p className="text-gray-300">
                  This data structure is actively ticking inside the living world state. Trigger its corresponding game action (e.g. Rewind for Stack, Defense Rotate for Circular Queue, Vault for Hash Table, or Tree for AVL) to observe real-time state mutations.
                </p>
                <div className="p-2.5 bg-black/50 rounded border border-purple-500/30 text-purple-300 text-[11px]">
                  💡 Viva Tip: Point to the HUD top-bar where this exact data structure updates dynamically during every move.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
