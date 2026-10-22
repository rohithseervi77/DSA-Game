/**
 * NEXUS Adaptive Algorithmic World Engine
 * Novelty: The world learns and mutates dynamically based on player behavior.
 * Tracks playstyle vectors and modifies graph connectivity, difficulty, and resource scarcity.
 */

import { NexusGraph, SectorNode, ConduitEdge } from "../data-structures/Graph";

export interface WorldState {
  globalThreatIndex: number; // 0 - 100
  graphEntropy: number; // 0 - 100
  resourceScarcity: number; // 0 - 100
  mutatedConduitsCount: number;
  severedConduitsCount: number;
  activeAnomalies: string[];
  worldCycle: number;
}

export interface PlayerBehaviorVector {
  totalMoves: number;
  greedyRoutesTaken: number;
  deepExplorations: number;
  cautiousRoutesTaken: number;
  rewindCount: number;
  collisionsEncountered: number;
  searchProbesCount: number;
  binarySearchUsage: number;
  linearSearchUsage: number;
}

export class NexusAdaptiveWorld {
  private graph: NexusGraph;
  private state: WorldState;
  private playerVector: PlayerBehaviorVector;

  constructor(graph: NexusGraph) {
    this.graph = graph;
    this.state = {
      globalThreatIndex: 20,
      graphEntropy: 10,
      resourceScarcity: 15,
      mutatedConduitsCount: 0,
      severedConduitsCount: 0,
      activeAnomalies: [],
      worldCycle: 1,
    };
    this.playerVector = {
      totalMoves: 0,
      greedyRoutesTaken: 0,
      deepExplorations: 0,
      cautiousRoutesTaken: 0,
      rewindCount: 0,
      collisionsEncountered: 0,
      searchProbesCount: 0,
      binarySearchUsage: 0,
      linearSearchUsage: 0,
    };
  }

  recordPlayerMove(routeDanger: number, routeDistance: number, isGreedy: boolean, wasRewound: boolean = false) {
    this.playerVector.totalMoves++;
    if (isGreedy) this.playerVector.greedyRoutesTaken++;
    else this.playerVector.cautiousRoutesTaken++;
    if (wasRewound) this.playerVector.rewindCount++;

    this.adaptWorldState();
  }

  recordSearchChoice(type: "BINARY" | "JUMP" | "LINEAR") {
    this.playerVector.searchProbesCount++;
    if (type === "BINARY") this.playerVector.binarySearchUsage++;
    else if (type === "LINEAR") this.playerVector.linearSearchUsage++;
    this.adaptWorldState();
  }

  recordCollisionEvent() {
    this.playerVector.collisionsEncountered++;
    this.state.graphEntropy = Math.min(100, this.state.graphEntropy + 4);
  }

  /**
   * Adaptive Response Logic:
   * - If player is overly greedy, increase danger on cheap routes (anti-greed adaptation).
   * - If player is highly efficient, increase graph complexity & spawn quantum anomalies.
   * - If player struggles (high rewind count), stabilize entropy and open bypass routes.
   */
  private adaptWorldState() {
    const { totalMoves, greedyRoutesTaken, rewindCount } = this.playerVector;
    if (totalMoves === 0) return;

    const greedRatio = greedyRoutesTaken / totalMoves;
    const struggleRatio = rewindCount / totalMoves;

    // Difficulty scaling
    if (struggleRatio > 0.3) {
      // Player is struggling: soften world
      this.state.globalThreatIndex = Math.max(10, this.state.globalThreatIndex - 2);
      this.state.resourceScarcity = Math.max(5, this.state.resourceScarcity - 3);
    } else if (greedRatio > 0.6) {
      // Player exploits greedy shortcuts: increase danger on short routes
      this.state.globalThreatIndex = Math.min(95, this.state.globalThreatIndex + 3);
      this.state.graphEntropy = Math.min(90, this.state.graphEntropy + 5);
      this.triggerRouteMutation();
    } else {
      // Balanced growth
      this.state.globalThreatIndex = Math.min(85, 20 + Math.floor(totalMoves * 1.5));
    }
  }

  private triggerRouteMutation() {
    const edges = this.graph.getAllEdges();
    if (edges.length === 0) return;

    // Random conduit weight mutation
    const randomEdge = edges[Math.floor(Math.random() * edges.length)];
    const multiplier = 1.2 + Math.random() * 0.4;
    this.graph.mutateEdgeWeights(randomEdge.source, randomEdge.target, multiplier);
    this.state.mutatedConduitsCount++;
  }

  triggerSeverRandomEdge(): { source: string; target: string } | null {
    const edges = this.graph.getAllEdges().filter((e) => !e.isSevered);
    if (edges.length <= 3) return null;

    const targetEdge = edges[Math.floor(Math.random() * edges.length)];
    this.graph.severEdge(targetEdge.source, targetEdge.target);
    this.state.severedConduitsCount++;
    this.state.activeAnomalies.push(`Conduit severed between ${targetEdge.source} and ${targetEdge.target}`);
    return { source: targetEdge.source, target: targetEdge.target };
  }

  restoreNetworkMST(): { restoredEdges: number; cost: number } {
    let restored = 0;
    const edges = this.graph.getAllEdges().filter((e) => e.isSevered);
    for (const e of edges) {
      this.graph.restoreEdge(e.source, e.target);
      restored++;
    }
    this.state.severedConduitsCount = 0;
    this.state.graphEntropy = Math.max(5, this.state.graphEntropy - 20);
    return { restoredEdges: restored, cost: restored * 25 };
  }

  advanceCycle() {
    this.state.worldCycle++;
    // Gradual natural entropy shift
    this.state.graphEntropy = (this.state.graphEntropy + 3) % 100;
  }

  getState(): WorldState {
    return { ...this.state };
  }

  getPlayerVector(): PlayerBehaviorVector {
    return { ...this.playerVector };
  }
}
