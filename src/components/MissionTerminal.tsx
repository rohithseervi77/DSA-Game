"use client";

import React from "react";
import { Compass, ShieldAlert, Zap, Radio, CheckCircle, AlertTriangle, ArrowRight, Layers } from "lucide-react";
import { Mission } from "../missions/MissionManager";
import { SectorNode, ConduitEdge } from "../data-structures/Graph";
import { DistressPacket } from "../player/PlayerState";

interface MissionTerminalProps {
  currentMission: Mission | null;
  currentSector: SectorNode;
  availableConduits: ConduitEdge[];
  sectorsMap: Map<string, SectorNode>;
  distressPackets: DistressPacket[];
  academicMode: boolean;
  onNavigate: (conduit: ConduitEdge) => void;
  onProcessDistress: () => void;
  onTriggerEmergencyMission: () => void;
  onRunShortestPath: (targetSectorId: string) => void;
}

export const MissionTerminal: React.FC<MissionTerminalProps> = ({
  currentMission,
  currentSector,
  availableConduits,
  sectorsMap,
  distressPackets,
  academicMode,
  onNavigate,
  onProcessDistress,
  onTriggerEmergencyMission,
  onRunShortestPath,
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Col 1: Active Mission Objective (Singly Linked List) */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> CURRENT OBJECTIVE
            </span>
            {currentMission?.isEmergency && (
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/30 border border-red-400 text-red-300 animate-pulse">
                EMERGENCY OVERRIDE
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            {currentMission?.title || "All Sector Objectives Completed"}
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed mb-3">
            {currentMission?.description || "The living algorithm is fully synchronized. Stand by for quantum extraction."}
          </p>

          <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-500/20 font-mono text-[10px] space-y-1">
            <div className="text-gray-400">TARGET DESTINATION:</div>
            <div className="text-cyan-300 font-bold">{currentMission?.sectorTargetId || "NEXUS GATE"}</div>
            {academicMode && (
              <div className="text-purple-400 pt-1 border-t border-slate-800">
                DSA Chain: {currentMission?.dsaConcept || "Dynamic Singly Linked List"}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
          <span className="text-[11px] font-mono text-amber-400">
            Yield: +{currentMission?.rewardEnergy || 50} Energy
          </span>
          <button
            onClick={onTriggerEmergencyMission}
            title="Singly Linked List: Dynamically insert emergency node mid-chain"
            className="text-[10px] font-mono text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded bg-red-950/20 hover:bg-red-950/40"
          >
            + Simulate Emergency
          </button>
        </div>
      </div>

      {/* Col 2: Sector Conduits & Navigation (Dijkstra's Router) */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> AVAILABLE CONDUITS
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              LOCATION: {currentSector.name}
            </span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {availableConduits.length > 0 ? (
              availableConduits.map((conduit) => {
                const target = sectorsMap.get(conduit.target);
                return (
                  <div
                    key={conduit.id}
                    className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-cyan-400 transition-all flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-white">{target?.name || conduit.target}</div>
                      <div className="text-[10px] text-gray-400 flex gap-2">
                        <span className="text-amber-400">{conduit.energyCost} Energy</span>
                        <span className={conduit.danger > 40 ? "text-red-400" : "text-emerald-400"}>
                          {conduit.danger}% Danger
                        </span>
                        <span>Dist: {conduit.distance}</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onRunShortestPath(conduit.target)}
                        title="Dijkstra Shortest Path Preview"
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] border border-slate-600"
                      >
                        Plot
                      </button>
                      <button
                        onClick={() => onNavigate(conduit)}
                        className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] flex items-center gap-1"
                      >
                        Jump <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-500 text-xs font-mono">
                No active outgoing conduits. Network rebuild required!
              </div>
            )}
          </div>
        </div>

        {academicMode && (
          <div className="mt-2 text-[10px] font-mono text-purple-400 border-t border-slate-800 pt-1.5">
            Dijkstra Routing: O((V+E) log V) with Min-Heap relaxation.
          </div>
        )}
      </div>

      {/* Col 3: Sector Distress Queue (FIFO Queue) */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> INCOMING DISTRESS RELAY
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
              FIFO QUEUE ({distressPackets.length})
            </span>
          </div>

          {distressPackets.length > 0 ? (
            <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="font-bold text-indigo-300">{distressPackets[0].sender}</span>
                <span className="text-amber-400 font-bold">{distressPackets[0].urgency}</span>
              </div>
              <p className="text-xs text-gray-300 leading-snug">{distressPackets[0].message}</p>
              <div className="text-[10px] font-mono text-emerald-400">
                Reward: +{distressPackets[0].reward} Energy Units
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-xs font-mono">
              Distress buffer clear. No pending transmissions.
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={onProcessDistress}
            disabled={distressPackets.length === 0}
            className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              distressPackets.length > 0
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                : "bg-slate-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            Process Head Packet (Dequeue O(1))
          </button>
        </div>
      </div>
    </div>
  );
};
