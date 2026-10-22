/**
 * NEXUS World Generator
 * Procedurally generates the cybernetic Living Graph with sectors, conduits, and quantum anomalies.
 */

import { NexusGraph, SectorNode, ConduitEdge } from "../data-structures/Graph";

export class NexusWorldGenerator {
  static createInitialWorld(): NexusGraph {
    const graph = new NexusGraph();

    const sectors: SectorNode[] = [
      {
        id: "SECTOR_ALPHA_CORE",
        name: "Alpha Core Relay",
        type: "HUB",
        x: 18,
        y: 48,
        threatLevel: 5,
        stability: 95,
        energyYield: 25,
        isUnlocked: true,
        isVisited: true,
        isCorrupted: false,
        description: "Central command nexus of the living algorithm. Stable power conduits emanate from this hub.",
      },
      {
        id: "SECTOR_VAULT_GAMMA",
        name: "Memory Vault Gamma",
        type: "RESOURCE_WELL",
        x: 35,
        y: 22,
        threatLevel: 25,
        stability: 70,
        energyYield: 45,
        isUnlocked: true,
        isVisited: false,
        isCorrupted: true,
        description: "Massive cryptographic data depository. Encounters high hash collisions due to magnetic flux.",
      },
      {
        id: "SECTOR_RADAR_NORTH",
        name: "Sub-Band Array North",
        type: "RESEARCH_LAB",
        x: 52,
        y: 18,
        threatLevel: 15,
        stability: 88,
        energyYield: 30,
        isUnlocked: true,
        isVisited: false,
        isCorrupted: false,
        description: "High-frequency radio sensor array. Enables Binary & Jump Search scanning across sector telemetry.",
      },
      {
        id: "SECTOR_RESEARCH_NODE",
        name: "Harmonic Lab Epsilon",
        type: "RESEARCH_LAB",
        x: 48,
        y: 52,
        threatLevel: 35,
        stability: 62,
        energyYield: 35,
        isUnlocked: true,
        isVisited: false,
        isCorrupted: false,
        description: "Quantum algorithmic laboratory. Contains the self-balancing AVL Knowledge Tree.",
      },
      {
        id: "SECTOR_DEFENSE_GRID",
        name: "Aegis Citadel",
        type: "DEFENSE_TOWER",
        x: 32,
        y: 78,
        threatLevel: 45,
        stability: 80,
        energyYield: 20,
        isUnlocked: true,
        isVisited: false,
        isCorrupted: false,
        description: "Heavy planetary shield bastion powering the cyclic defense matrix.",
      },
      {
        id: "SECTOR_CORRUPTED_CACHE",
        name: "Null Rift Cache",
        type: "CORRUPTED_CACHE",
        x: 65,
        y: 42,
        threatLevel: 75,
        stability: 25,
        energyYield: 80,
        isUnlocked: true,
        isVisited: false,
        isCorrupted: true,
        description: "Dangerous shattered reality block. Contains high-tier energy cores but requires linear scavenging.",
      },
      {
        id: "SECTOR_QUANTUM_GATEWAY",
        name: "Strassen Core Well",
        type: "QUANTUM_GATEWAY",
        x: 75,
        y: 72,
        threatLevel: 60,
        stability: 50,
        energyYield: 65,
        isUnlocked: true,
        isVisited: false,
        isCorrupted: false,
        description: "Sub-atomic computation manifold powered by Strassen & Matrix Chain Multiplication.",
      },
      {
        id: "SECTOR_OMEGA_GATE",
        name: "Omega Escape Gateway",
        type: "QUANTUM_GATEWAY",
        x: 88,
        y: 46,
        threatLevel: 85,
        stability: 40,
        energyYield: 100,
        isUnlocked: false,
        isVisited: false,
        isCorrupted: false,
        description: "The perimeter escape conduit leading out of the NEXUS simulation. Heavily shielded.",
      },
    ];

    for (const s of sectors) {
      graph.addVertex(s);
    }

    const conduits: ConduitEdge[] = [
      { id: "C1", source: "SECTOR_ALPHA_CORE", target: "SECTOR_VAULT_GAMMA", distance: 12, danger: 15, energyCost: 15, bandwidth: 80, isActive: true },
      { id: "C2", source: "SECTOR_ALPHA_CORE", target: "SECTOR_RESEARCH_NODE", distance: 14, danger: 25, energyCost: 18, bandwidth: 95, isActive: true },
      { id: "C3", source: "SECTOR_ALPHA_CORE", target: "SECTOR_DEFENSE_GRID", distance: 16, danger: 30, energyCost: 20, bandwidth: 60, isActive: true },
      { id: "C4", source: "SECTOR_VAULT_GAMMA", target: "SECTOR_RADAR_NORTH", distance: 10, danger: 20, energyCost: 12, bandwidth: 100, isActive: true },
      { id: "C5", source: "SECTOR_RADAR_NORTH", target: "SECTOR_RESEARCH_NODE", distance: 18, danger: 35, energyCost: 22, bandwidth: 75, isActive: true },
      { id: "C6", source: "SECTOR_RESEARCH_NODE", target: "SECTOR_CORRUPTED_CACHE", distance: 15, danger: 65, energyCost: 28, bandwidth: 40, isActive: true },
      { id: "C7", source: "SECTOR_DEFENSE_GRID", target: "SECTOR_QUANTUM_GATEWAY", distance: 22, danger: 50, energyCost: 32, bandwidth: 50, isActive: true },
      { id: "C8", source: "SECTOR_CORRUPTED_CACHE", target: "SECTOR_QUANTUM_GATEWAY", distance: 16, danger: 70, energyCost: 26, bandwidth: 45, isActive: true },
      { id: "C9", source: "SECTOR_CORRUPTED_CACHE", target: "SECTOR_OMEGA_GATE", distance: 20, danger: 80, energyCost: 35, bandwidth: 30, isActive: true },
      { id: "C10", source: "SECTOR_QUANTUM_GATEWAY", target: "SECTOR_OMEGA_GATE", distance: 18, danger: 60, energyCost: 30, bandwidth: 85, isActive: true },
    ];

    for (const c of conduits) {
      graph.addEdge(c, true);
    }

    return graph;
  }
}
