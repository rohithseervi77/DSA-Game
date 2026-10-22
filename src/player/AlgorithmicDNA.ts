/**
 * NEXUS Player Algorithmic DNA Engine
 * Computes the player's natural algorithmic personality based on real gameplay decisions:
 * BFS Explorer, DFS Deep Diver, Greedy Optimizer, Tree Harmonizer, Asymptotic Strategist.
 */

import { PlayerBehaviorVector } from "../game-engine/AdaptiveWorld";

export interface AlgorithmicDNAProfile {
  explorationDepthScore: number; // 0 - 100 (DFS affinity)
  breadthOutreachScore: number; // 0 - 100 (BFS affinity)
  optimizationScore: number; // 0 - 100 (Dijkstra greedy/efficiency)
  searchEfficiencyScore: number; // 0 - 100 (Binary vs Linear search ratio)
  riskToleranceScore: number; // 0 - 100 (Danger route willingness)
  memoryMasteryScore: number; // 0 - 100 (Hash vault utilization)
  archetypeTitle: string;
  archetypeBadge: string;
  algorithmicSummary: string;
  vivaDefenseNote: string;
}

export class NexusAlgorithmicDNA {
  static computeDNA(stats: PlayerBehaviorVector, collisionsResolved: number = 0): AlgorithmicDNAProfile {
    const totalMoves = Math.max(1, stats.totalMoves);
    const totalSearches = Math.max(1, stats.searchProbesCount);

    // 1. Search Efficiency: Binary Search vs Linear Search
    const searchEfficiencyScore = Math.min(
      100,
      Math.round(((stats.binarySearchUsage * 2 + stats.searchProbesCount) / (totalSearches * 2 + 1)) * 100)
    );

    // 2. Exploration vs Breadth
    const explorationDepthScore = Math.min(
      100,
      Math.round(20 + (stats.deepExplorations / totalMoves) * 80)
    );

    const breadthOutreachScore = Math.min(
      100,
      Math.round(30 + ((totalMoves - stats.greedyRoutesTaken) / totalMoves) * 70)
    );

    // 3. Optimization Score (Dijkstra route efficiency)
    const optimizationScore = Math.min(
      100,
      Math.round(40 + (stats.greedyRoutesTaken / totalMoves) * 55)
    );

    // 4. Risk Tolerance (willingness to brave high danger routes vs rewinding)
    const riskToleranceScore = Math.min(
      100,
      Math.max(10, Math.round(70 - (stats.rewindCount / totalMoves) * 60))
    );

    // 5. Memory Mastery (Resolving collisions, using vaults)
    const memoryMasteryScore = Math.min(
      100,
      Math.round(35 + collisionsResolved * 15)
    );

    // Determine Archetype
    let archetypeTitle = "Asymptotic Generalist";
    let archetypeBadge = "⚡";
    let algorithmicSummary = "";
    let vivaDefenseNote = "";

    if (optimizationScore > 75 && searchEfficiencyScore > 70) {
      archetypeTitle = "Quantum Architect (Dijkstra-AVL Dominant)";
      archetypeBadge = "💠";
      algorithmicSummary =
        "Your playstyle favors minimum asymptotic complexity. You consistently choose log(N) logarithmic lookups and minimize conduit energy cost via priority-queue relaxations.";
      vivaDefenseNote =
        "Demonstrates mastery of O((V+E) log V) shortest path convergence and self-balancing O(log N) data structures.";
    } else if (explorationDepthScore > 70) {
      archetypeTitle = "Deep Infiltrator (DFS-Stack Dominant)";
      archetypeBadge = "🌌";
      algorithmicSummary =
        "You prefer probing deep anomalous sectors, relying on chronological stack snapshots to unwind and backtrack from hazardous sectors.";
      vivaDefenseNote =
        "Demonstrates deep recursive traversal techniques and LIFO state preservation mechanics.";
    } else if (breadthOutreachScore > 70) {
      archetypeTitle = "Nexus Pioneer (BFS-Queue Dominant)";
      archetypeBadge = "📡";
      algorithmicSummary =
        "You systematically establish perimeter dominance, broadcasting level-order pulses to guarantee finding the minimum hops to mission objectives.";
      vivaDefenseNote =
        "Exemplifies level-order BFS queue mechanics ensuring unweighted shortest path guarantees.";
    } else {
      archetypeTitle = "Entropy Stabilizer (Balanced Hybrid)";
      archetypeBadge = "⚖️";
      algorithmicSummary =
        "You maintain harmonic balance across route optimization, search frequency, and memory vault stability.";
      vivaDefenseNote =
        "Represents dynamic adaptation across both greedy and divide-and-conquer algorithmic paradigms.";
    }

    return {
      explorationDepthScore,
      breadthOutreachScore,
      optimizationScore,
      searchEfficiencyScore,
      riskToleranceScore,
      memoryMasteryScore,
      archetypeTitle,
      archetypeBadge,
      algorithmicSummary,
      vivaDefenseNote,
    };
  }
}
