/**
 * NEXUS Mission System
 * Powered by: Singly Linked List (Dynamic Mid-Chain Emergency Insertion)
 * Allows missions to chain dynamically: M1 -> Emergency Anomaly -> M2 -> M3
 */

import { NexusSinglyLinkedList } from "../data-structures/SinglyLinkedList";

export interface Mission {
  id: string;
  title: string;
  sectorTargetId: string;
  description: string;
  rewardEnergy: number;
  rewardBandwidth: number;
  isEmergency: boolean;
  isCompleted: boolean;
  requiredAlgorithmHint: string;
  dsaConcept: string;
}

export class NexusMissionManager {
  private missionChain: NexusSinglyLinkedList<Mission> = new NexusSinglyLinkedList();

  constructor() {
    this.seedInitialCampaign();
  }

  private seedInitialCampaign() {
    const initialMissions: Mission[] = [
      {
        id: "MISSION_ALPHA",
        title: "Phase 1: Bootstrapping Neural Uplink",
        sectorTargetId: "SECTOR_ALPHA_CORE",
        description: "Initialize the Core Hub relay and synchronize sector frequency bands using Binary Search triangulation.",
        rewardEnergy: 50,
        rewardBandwidth: 25,
        isEmergency: false,
        isCompleted: false,
        requiredAlgorithmHint: "Binary Search / Sensor Triangulation",
        dsaConcept: "Binary Search (O(log n)) & Singly Linked List Chains",
      },
      {
        id: "MISSION_BETA",
        title: "Phase 2: Purge Vault Contamination",
        sectorTargetId: "SECTOR_VAULT_GAMMA",
        description: "Infiltrate Vault Gamma. Encountered hash collisions have locked encrypted memory partitions.",
        rewardEnergy: 75,
        rewardBandwidth: 40,
        isEmergency: false,
        isCompleted: false,
        requiredAlgorithmHint: "Hash Table Separate Chaining & Collision Resolution",
        dsaConcept: "Hash Tables (O(1) average lookup) with Chained Buckets",
      },
      {
        id: "MISSION_DELTA",
        title: "Phase 3: Stabilize Fractured Knowledge",
        sectorTargetId: "SECTOR_RESEARCH_NODE",
        description: "Skewed insertion rates have imbalanced the planetary knowledge tree. Execute AVL tree rebalancing rotations.",
        rewardEnergy: 100,
        rewardBandwidth: 60,
        isEmergency: false,
        isCompleted: false,
        requiredAlgorithmHint: "AVL Self-Balancing Tree (LL/RR/LR/RL Rotations)",
        dsaConcept: "AVL Tree Rotations maintaining strict O(log n) height",
      },
      {
        id: "MISSION_OMEGA",
        title: "Final Phase: The Grand Algorithmic Convergence",
        sectorTargetId: "SECTOR_OMEGA_GATE",
        description: "Sever all anomalous loops, reconstruct broken power grids with Prim's MST, and execute Dijkstra escape traversal.",
        rewardEnergy: 250,
        rewardBandwidth: 150,
        isEmergency: false,
        isCompleted: false,
        requiredAlgorithmHint: "Prim's MST + Dijkstra Shortest Path",
        dsaConcept: "Greedy Graph Algorithms: Dijkstra O((V+E) log V) & Prim O(E log V)",
      },
    ];

    for (const m of initialMissions) {
      this.missionChain.append(m);
    }
  }

  getCurrentMission(): Mission | null {
    const active = this.missionChain.toArray().find((m) => !m.isCompleted);
    return active || null;
  }

  getAllMissions(): Mission[] {
    return this.missionChain.toArray();
  }

  completeMission(missionId: string): { completed: boolean; mission?: Mission } {
    let completedMission: Mission | undefined;
    const missions = this.missionChain.toArray();
    for (const m of missions) {
      if (m.id === missionId && !m.isCompleted) {
        m.isCompleted = true;
        completedMission = m;
        break;
      }
    }
    return { completed: !!completedMission, mission: completedMission };
  }

  /**
   * Novelty: Dynamic mid-chain emergency objective insertion
   * Inserts an emergency mission directly between current objective and next objective!
   */
  injectEmergencyMission(afterMissionId: string, emergency: Mission): boolean {
    return this.missionChain.insertAfter((m) => m.id === afterMissionId, emergency);
  }

  generateRandomEmergency(currentMissionId: string, targetSectorId: string): Mission {
    const emergency: Mission = {
      id: `EMERGENCY_${Date.now().toString().slice(-4)}`,
      title: "🚨 PRIORITY OVERRIDE: Conduit Cascade",
      sectorTargetId: targetSectorId,
      description: "Critical conduit rupture detected! Reconnect sector grid using Minimum Spanning Tree before quantum collapse.",
      rewardEnergy: 80,
      rewardBandwidth: 50,
      isEmergency: true,
      isCompleted: false,
      requiredAlgorithmHint: "Prim / Kruskal Minimum Spanning Tree",
      dsaConcept: "Mid-Chain Singly Linked List Insertion O(1) & MST Graph Theory",
    };

    this.injectEmergencyMission(currentMissionId, emergency);
    return emergency;
  }
}
