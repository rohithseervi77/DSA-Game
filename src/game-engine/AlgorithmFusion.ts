/**
 * NEXUS Novelty Engine: Algorithm Fusion & Algorithm Mutation
 * Allows player to discover and synthesize algorithmic hybrid abilities,
 * and deal with world algorithm mutations.
 */

export interface AlgorithmFusionRecipe {
  id: string;
  name: string;
  formula: string; // e.g., "BFS + HASHING"
  unlocked: boolean;
  active: boolean;
  cooldownTurns: number;
  remainingCooldown: number;
  description: string;
  bonusEffect: string;
  dsaSynergy: string;
}

export interface AlgorithmMutationStatus {
  activeMutations: {
    type: "HASH_COLLISION_STORM" | "CONDUIT_COLLAPSE" | "AVL_ROTATION_LOCK" | "HEAP_INVERSION";
    severity: number;
    turnsRemaining: number;
    description: string;
    remedyInstruction: string;
  }[];
}

export class NexusAlgorithmFusionEngine {
  private recipes: Map<string, AlgorithmFusionRecipe> = new Map();
  private mutationStatus: AlgorithmMutationStatus = { activeMutations: [] };

  constructor() {
    this.initRecipes();
  }

  private initRecipes() {
    const list: AlgorithmFusionRecipe[] = [
      {
        id: "FUSION_BFS_HASH",
        name: "Omni-Pulse Indexer",
        formula: "BFS + HASHING",
        unlocked: true,
        active: false,
        cooldownTurns: 3,
        remainingCooldown: 0,
        description: "Emits a level-order wave pulse while simultaneously indexing every discovered sector cache in O(1).",
        bonusEffect: "Reveals 3 adjacent sectors and auto-resolves any corrupted memory caches in range.",
        dsaSynergy: "Breadth-First Search frontier queue populates Hash Table buckets without additional traversal.",
      },
      {
        id: "FUSION_DFS_STACK",
        name: "Chrono-Infiltrator",
        formula: "DFS + STACK",
        unlocked: true,
        active: false,
        cooldownTurns: 4,
        remainingCooldown: 0,
        description: "Drives a deep sub-core probe through high-danger sectors with full backtrack rewind snapshots.",
        bonusEffect: "Grants 2 free Temporal Rewind charges and bypasses sector danger penalties.",
        dsaSynergy: "Exploration call stack preserves exact chronological snapshots of state for instant LIFO pop rewind.",
      },
      {
        id: "FUSION_DIJKSTRA_PQ",
        name: "Quantum Path-Weaver",
        formula: "DIJKSTRA + PRIORITY QUEUE",
        unlocked: false,
        active: false,
        cooldownTurns: 3,
        remainingCooldown: 0,
        description: "Dynamically recalculates all optimal routes whenever world conduits mutate or collapse.",
        bonusEffect: "Reduces energy cost by 40% on all traversal routes for 3 turns.",
        dsaSynergy: "Min-Heap priority queue continuously extracts minimum tentative distance in O(log V) time.",
      },
      {
        id: "FUSION_MST_HUFFMAN",
        name: "Hyper-Grid Transceiver",
        formula: "MST + HUFFMAN",
        unlocked: false,
        active: false,
        cooldownTurns: 5,
        remainingCooldown: 0,
        description: "Rebuilds severed power conduits using Prim's MST while compressing telemetry with Huffman coding.",
        bonusEffect: "Restores severed conduits at 50% discount and maximizes comm bandwidth yield.",
        dsaSynergy: "Minimum Spanning Tree gives optimal network topology; Huffman coding guarantees minimum average bit length.",
      },
      {
        id: "FUSION_AVL_COUNTING",
        name: "Harmonic Knowledge Core",
        formula: "AVL TREE + COUNTING SORT",
        unlocked: false,
        active: false,
        cooldownTurns: 4,
        remainingCooldown: 0,
        description: "Sorts energy cores in O(n + k) and stabilizes knowledge nodes via automatic AVL rotations.",
        bonusEffect: "Stabilizes World Entropy by 25% and grants instant maximum storage capacity.",
        dsaSynergy: "Counting sort orders bounded discrete frequencies; AVL self-balancing tree preserves strict O(log n) access.",
      },
    ];

    for (const r of list) {
      this.recipes.set(r.id, r);
    }
  }

  unlockFusion(recipeId: string): boolean {
    const recipe = this.recipes.get(recipeId);
    if (recipe && !recipe.unlocked) {
      recipe.unlocked = true;
      return true;
    }
    return false;
  }

  activateFusion(recipeId: string): { success: boolean; message: string; recipe?: AlgorithmFusionRecipe } {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) return { success: false, message: "Unknown algorithm fusion formula." };
    if (!recipe.unlocked) return { success: false, message: "Fusion formula is still locked in the knowledge vault." };
    if (recipe.remainingCooldown > 0) return { success: false, message: `Formula is cooling down (${recipe.remainingCooldown} turns left).` };

    recipe.active = true;
    recipe.remainingCooldown = recipe.cooldownTurns;

    return {
      success: true,
      message: `ACTIVATED FUSION: [${recipe.name}]! ${recipe.bonusEffect}`,
      recipe,
    };
  }

  tickCooldowns() {
    for (const r of this.recipes.values()) {
      if (r.remainingCooldown > 0) {
        r.remainingCooldown--;
      }
      r.active = false;
    }

    // Tick mutations
    this.mutationStatus.activeMutations = this.mutationStatus.activeMutations
      .map((m) => ({ ...m, turnsRemaining: m.turnsRemaining - 1 }))
      .filter((m) => m.turnsRemaining > 0);
  }

  triggerRandomMutation() {
    const mutations = [
      {
        type: "HASH_COLLISION_STORM" as const,
        severity: 75,
        turnsRemaining: 3,
        description: "Quantum hash collision storm detected! Sector memory lookup costs increased.",
        remedyInstruction: "Execute Memory Vault Rehash or resolve colliding keys manually.",
      },
      {
        type: "CONDUIT_COLLAPSE" as const,
        severity: 60,
        turnsRemaining: 4,
        description: "Primary conduits severed due to seismic algorithmic fluctuation.",
        remedyInstruction: "Execute Network Rebuild (Prim/Kruskal MST) to restore topology.",
      },
      {
        type: "AVL_ROTATION_LOCK" as const,
        severity: 50,
        turnsRemaining: 2,
        description: "Knowledge tree balance factor skewed beyond threshold |B| > 1.",
        remedyInstruction: "Perform Knowledge Stabilization (AVL Rotation Pulse).",
      },
    ];

    const chosen = mutations[Math.floor(Math.random() * mutations.length)];
    this.mutationStatus.activeMutations.push(chosen);
    return chosen;
  }

  getRecipes(): AlgorithmFusionRecipe[] {
    return Array.from(this.recipes.values());
  }

  getMutations(): AlgorithmMutationStatus["activeMutations"] {
    return this.mutationStatus.activeMutations;
  }
}
