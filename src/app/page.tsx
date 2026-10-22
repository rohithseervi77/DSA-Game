"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CyberHUD } from "../components/CyberHUD";
import { WorldCanvas } from "../components/WorldCanvas";
import { MissionTerminal } from "../components/MissionTerminal";
import { ProfessorDemoModal } from "../components/ProfessorDemoModal";
import { MemoryVaultModal } from "../components/MemoryVaultModal";
import { KnowledgeTreeModal } from "../components/KnowledgeTreeModal";
import { FusionLabModal } from "../components/FusionLabModal";
import { AlgorithmicDNAModal } from "../components/AlgorithmicDNAModal";

import { NexusWorldGenerator } from "../world-generation/WorldGenerator";
import { NexusPlayerManager } from "../player/PlayerState";
import { NexusMissionManager } from "../missions/MissionManager";
import { NexusAdaptiveWorld } from "../game-engine/AdaptiveWorld";
import { NexusAlgorithmFusionEngine } from "../game-engine/AlgorithmFusion";
import { NexusHashTable } from "../data-structures/HashTable";
import { NexusAVLTree } from "../data-structures/AVLTree";
import { NexusGraphAlgorithms, PathResult } from "../algorithms/GraphAlgorithms";
import { NexusAlgorithmicDNA } from "../player/AlgorithmicDNA";
import { SectorNode, ConduitEdge } from "../data-structures/Graph";
import { sfx } from "../utils/audio";
import confetti from "canvas-confetti";
import {
  Sparkles,
  AlertCircle,
  Wrench,
  Search,
  Radio,
  Share2,
  Trophy,
  Activity,
  Layers,
} from "lucide-react";

export default function NexusGamePage() {
  // 1. Core Engines
  const worldGraph = useMemo(() => NexusWorldGenerator.createInitialWorld(), []);
  const [player] = useState(() => new NexusPlayerManager());
  const [missionManager] = useState(() => new NexusMissionManager());
  const [adaptiveWorld] = useState(() => new NexusAdaptiveWorld(worldGraph));
  const [fusionEngine] = useState(() => new NexusAlgorithmFusionEngine());
  const [hashTable] = useState(() => {
    const ht = new NexusHashTable<string>(17);
    ht.set("CIPHER_ALPHA", "Quantum Core Encryption Key");
    ht.set("TELEMETRY_BETA", "Atmospheric Sensor Stream");
    ht.set("NULL_CACHE", "Corrupted Memory Block #09", true);
    return ht;
  });
  const [avlTree] = useState(() => {
    const avl = new NexusAVLTree<number, string>();
    avl.insert(40, "Nexus Fundamental Laws");
    avl.insert(20, "Graph Topology Schema");
    avl.insert(60, "Algorithmic Energy Invariant");
    return avl;
  });

  // 2. React UI States
  const [gameTick, setGameTick] = useState(0);
  const [academicMode, setAcademicMode] = useState(false);
  const [selectedSector, setSelectedSector] = useState<SectorNode | null>(null);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [activeMstEdges, setActiveMstEdges] = useState<ConduitEdge[]>([]);
  const [notification, setNotification] = useState<string | null>(
    "NEXUS ONLINE: All 29 DSA syllabus systems active."
  );

  // 3. Modal Toggles
  const [isProfessorOpen, setIsProfessorOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isKnowledgeTreeOpen, setIsKnowledgeTreeOpen] = useState(false);
  const [isFusionOpen, setIsFusionOpen] = useState(false);
  const [isDNAOpen, setIsDNAOpen] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  const currentSector = worldGraph.getVertex(player.currentSectorId) || worldGraph.getAllVertices()[0];
  const sectors = worldGraph.getAllVertices();
  const edges = worldGraph.getAllEdges();
  const sectorsMap = useMemo(() => {
    const m = new Map<string, SectorNode>();
    sectors.forEach((s) => m.set(s.id, s));
    return m;
  }, [sectors]);

  const availableConduits = worldGraph.getNeighbors(player.currentSectorId);
  const currentMission = missionManager.getCurrentMission();
  const worldState = adaptiveWorld.getState();
  const distressPackets = player.distressQueue.toArray();
  const activeShieldStation = player.defenseMatrix.peekFront();

  // Notification helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // 4. Game Action Handlers
  const handleNavigate = (conduit: ConduitEdge) => {
    const moveRes = player.moveToSector(conduit.target, conduit.energyCost, conduit.danger);

    if (!moveRes.success) {
      sfx.playGlitchAlert();
      showToast("⚠️ INSUFFICIENT ENERGY: Cannot execute conduit jump!");
      return;
    }

    sfx.playNavJump();
    adaptiveWorld.recordPlayerMove(conduit.danger, conduit.distance, conduit.energyCost < 20);
    fusionEngine.tickCooldowns();
    adaptiveWorld.advanceCycle();

    // Check if target completed current mission
    if (currentMission && conduit.target === currentMission.sectorTargetId) {
      missionManager.completeMission(currentMission.id);
      player.energy = Math.min(player.maxEnergy, player.energy + currentMission.rewardEnergy);
      player.bandwidth += currentMission.rewardBandwidth;
      sfx.playFusionChord();
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      showToast(`🏆 OBJECTIVE COMPLETE: ${currentMission.title}!`);

      // Check if final Omega Gate reached
      if (conduit.target === "SECTOR_OMEGA_GATE") {
        setIsVictory(true);
      }
    } else {
      showToast(
        `WARP JUMP: Arrived at ${conduit.target} | Energy: -${conduit.energyCost}${
          moveRes.damageTaken > 0 ? ` | Damage: -${moveRes.damageTaken}` : ""
        }`
      );
    }

    // Small chance of random conduit severing or algorithm mutation as world reacts
    if (Math.random() < 0.25) {
      const severed = adaptiveWorld.triggerSeverRandomEdge();
      if (severed) {
        sfx.playGlitchAlert();
        showToast(`⚡ ANOMALIC INSTABILITY: Conduit severed between ${severed.source} and ${severed.target}!`);
      }
    }

    setActivePath([]);
    setGameTick((t) => t + 1);
  };

  // Temporal Rewind (Stack Pop)
  const handleRewind = () => {
    const res = player.rewind();
    if (res.success) {
      sfx.playRewind();
      showToast(res.message);
      adaptiveWorld.recordPlayerMove(0, 0, false, true);
      setGameTick((t) => t + 1);
    } else {
      sfx.playGlitchAlert();
      showToast(res.message);
    }
  };

  // Rotate Defense Matrix (Circular Queue)
  const handleRotateDefense = () => {
    sfx.playScanPing();
    const rotated = player.defenseMatrix.rotate();
    showToast(`DEFENSE MATRIX ROTATED: Active shield is now ${player.defenseMatrix.peekFront()?.name} (O(1))`);
    setGameTick((t) => t + 1);
  };

  // Rebuild Power Grid (Prim MST)
  const handleRebuildGridMST = () => {
    sfx.playFusionChord();
    const mst = NexusGraphAlgorithms.primMST(worldGraph, player.currentSectorId);
    setActiveMstEdges(mst.edges);
    const restoreRes = adaptiveWorld.restoreNetworkMST();
    showToast(
      `🌐 NETWORK REBUILT VIA PRIM'S MST: Restored ${restoreRes.restoredEdges} conduits at cost ${mst.totalCost} (O(E log V))`
    );
    setGameTick((t) => t + 1);
  };

  // Process Head Distress Packet (Queue Dequeue)
  const handleProcessDistress = () => {
    sfx.playScanPing();
    const packet = player.processNextDistress();
    if (packet) {
      showToast(`PACKET PROCESSED: ${packet.sender} | Yield: +${packet.reward} Energy (FIFO O(1))`);
      setGameTick((t) => t + 1);
    }
  };

  // Mid-chain Emergency Mission Injection (Linked List)
  const handleTriggerEmergency = () => {
    if (!currentMission) return;
    sfx.playGlitchAlert();
    const emergency = missionManager.generateRandomEmergency(currentMission.id, "SECTOR_CORRUPTED_CACHE");
    showToast(`🚨 MID-CHAIN EMERGENCY INJECTED: ${emergency.title} (Singly Linked List mid-insertion O(1))`);
    setGameTick((t) => t + 1);
  };

  // Dijkstra Shortest Path Preview
  const handlePlotDijkstra = (targetSectorId: string) => {
    sfx.playScanPing();
    const pathRes = NexusGraphAlgorithms.dijkstra(
      worldGraph,
      player.currentSectorId,
      targetSectorId,
      "BALANCED"
    );
    setActivePath(pathRes.path);
    showToast(
      `DIJKSTRA ROUTE PLOTTED: ${pathRes.path.length - 1} hops | Cost: ${pathRes.totalDistance} | Time: ${pathRes.timeTakenUs} µs`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative">
      {/* HUD Bar */}
      <CyberHUD
        energy={player.energy}
        maxEnergy={player.maxEnergy}
        shield={player.shield}
        maxShield={player.maxShield}
        bandwidth={player.bandwidth}
        rewindCharges={player.rewindCharges}
        turnCount={player.turnCount}
        worldThreat={worldState.globalThreatIndex}
        worldEntropy={worldState.graphEntropy}
        activeShieldStation={activeShieldStation}
        academicMode={academicMode}
        onToggleAcademicMode={() => {
          sfx.playScanPing();
          setAcademicMode(!academicMode);
        }}
        onRewind={handleRewind}
        onRotateDefense={handleRotateDefense}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenKnowledgeTree={() => setIsKnowledgeTreeOpen(true)}
        onOpenFusionLab={() => setIsFusionOpen(true)}
        onOpenProfessorDemo={() => setIsProfessorOpen(true)}
        onOpenDNA={() => setIsDNAOpen(true)}
      />

      {/* Main Game Interface */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-4">
        {/* Toast / Notification Banner */}
        {notification && (
          <div className="glass-panel px-4 py-2.5 rounded-xl border border-cyan-500/50 flex items-center justify-between text-xs font-mono text-cyan-300 animate-fadeIn shadow-lg">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              {notification}
            </span>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Central Living World Canvas */}
        <section className="relative">
          <WorldCanvas
            sectors={sectors}
            edges={edges}
            currentSectorId={player.currentSectorId}
            activePath={activePath}
            mstEdges={activeMstEdges}
            onSelectSector={(s) => {
              setSelectedSector(s);
              if (s.id !== player.currentSectorId) {
                handlePlotDijkstra(s.id);
              }
            }}
            onNavigateSector={(id) => {
              const conduit = availableConduits.find((c) => c.target === id);
              if (conduit) handleNavigate(conduit);
            }}
          />

          {/* Quick World Actions Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleRebuildGridMST}
              title="Prim's Algorithm: Reconstructs severed conduits at minimum cost"
              className="glass-panel px-3 py-1.5 rounded-lg border border-emerald-500/50 hover:bg-emerald-950/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              <span>REBUILD GRID (PRIM MST)</span>
            </button>
          </div>
        </section>

        {/* Mission & Navigation Terminal (Singly Linked List + Dijkstra + FIFO Queue) */}
        <section>
          <MissionTerminal
            currentMission={currentMission}
            currentSector={currentSector}
            availableConduits={availableConduits}
            sectorsMap={sectorsMap}
            distressPackets={distressPackets}
            academicMode={academicMode}
            onNavigate={handleNavigate}
            onProcessDistress={handleProcessDistress}
            onTriggerEmergencyMission={handleTriggerEmergency}
            onRunShortestPath={handlePlotDijkstra}
          />
        </section>
      </main>

      {/* Footer Strip */}
      <footer className="w-full glass-panel border-t border-slate-800 px-4 py-2.5 text-center text-[11px] font-mono text-gray-500 flex items-center justify-between max-w-7xl mx-auto">
        <span>NEXUS: THE LIVING ALGORITHM • UNIVERSITY FINAL DSA SYSTEM</span>
        <span className="text-cyan-400">STATUS: ALL 29 MODULES SYNCHRONIZED</span>
      </footer>

      {/* MODALS */}
      {/* 1. Professor Demo Split-Screen Presentation Suite */}
      <ProfessorDemoModal
        isOpen={isProfessorOpen}
        onClose={() => setIsProfessorOpen(false)}
      />

      {/* 2. Memory Vault (Hash Table Separate Chaining) */}
      <MemoryVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        hashTable={hashTable}
        onResolveCollision={(k) => {
          hashTable.resolveCorruptedKey(k);
          showToast(`RESOLVED COLLISION: Key ${k} stabilized in memory vault (O(1))`);
          setGameTick((t) => t + 1);
        }}
        onRehash={() => {
          hashTable.rehash(hashTable.getCapacity() * 2 + 1);
          showToast(`VAULT REHASHED: Expanded capacity to ${hashTable.getCapacity()} buckets`);
          setGameTick((t) => t + 1);
        }}
      />

      {/* 3. Knowledge Stabilization Tree (AVL & BST) */}
      <KnowledgeTreeModal
        isOpen={isKnowledgeTreeOpen}
        onClose={() => setIsKnowledgeTreeOpen(false)}
        avlTree={avlTree}
        onInsertNode={(k, v) => {
          avlTree.insert(k, v);
          showToast(`KNOWLEDGE INSERTED: Key [${k}] auto-balanced via AVL rotations`);
          setGameTick((t) => t + 1);
        }}
      />

      {/* 4. Algorithm Fusion Lab */}
      <FusionLabModal
        isOpen={isFusionOpen}
        onClose={() => setIsFusionOpen(false)}
        recipes={fusionEngine.getRecipes()}
        mutations={fusionEngine.getMutations()}
        onActivateFusion={(recipeId) => {
          const res = fusionEngine.activateFusion(recipeId);
          showToast(res.message);
          setGameTick((t) => t + 1);
        }}
        onRemedyMutation={(mType) => {
          showToast(`REMEDY APPLIED: Stabilized mutation ${mType}`);
          setGameTick((t) => t + 1);
        }}
      />

      {/* 5. Player Algorithmic DNA Profile */}
      <AlgorithmicDNAModal
        isOpen={isDNAOpen}
        onClose={() => setIsDNAOpen(false)}
        dna={NexusAlgorithmicDNA.computeDNA(adaptiveWorld.getPlayerVector(), 2)}
      />

      {/* 6. Victory Overlay Modal */}
      {isVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <div className="relative w-full max-w-lg glass-panel-academic p-8 rounded-2xl text-center space-y-4 border border-cyan-400 shadow-2xl">
            <Trophy className="w-16 h-16 text-amber-300 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-white tracking-wider">
              NEXUS CONVERGENCE ACHIEVED!
            </h2>
            <p className="text-sm text-gray-300">
              You navigated the adaptive world, stabilized the living graph, resolved quantum memory collisions, and escaped through the Omega Gateway!
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  setIsVictory(false);
                  setIsDNAOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-bold shadow-lg"
              >
                Inspect Algorithmic DNA
              </button>
              <button
                onClick={() => {
                  setIsVictory(false);
                  setIsProfessorOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold shadow-lg"
              >
                Professor Viva Suite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
