/**
 * NEXUS Graph Algorithms Engine
 * Implements: BFS, DFS, Dijkstra's Shortest Path, Prim's MST, Kruskal's MST (with DSU)
 * Provides detailed step-by-step telemetry for Academic & Professor Mode.
 */

import { NexusGraph, ConduitEdge, SectorNode } from "../data-structures/Graph";
import { NexusQueue } from "../data-structures/Queue";
import { NexusStack } from "../data-structures/Stack";
import { NexusPriorityQueue } from "../data-structures/PriorityQueue";

export interface GraphStep {
  currentSectorId: string;
  visitedSectors: string[];
  frontierSectors?: string[];
  edgeInspected?: ConduitEdge;
  costSoFar?: number;
  description: string;
}

export interface PathResult {
  path: string[];
  totalDistance: number;
  totalDanger: number;
  totalEnergy: number;
  timeTakenUs: number;
  visitedOrder: string[];
  steps: GraphStep[];
  theoreticalComplexity: string;
}

export interface MSTResult {
  edges: ConduitEdge[];
  totalCost: number;
  algorithm: "PRIM" | "KRUSKAL";
  timeTakenUs: number;
  steps: GraphStep[];
  theoreticalComplexity: string;
}

// Disjoint Set Union (Union-Find) for Kruskal's
export class DisjointSet {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();

  makeSet(vertex: string) {
    this.parent.set(vertex, vertex);
    this.rank.set(vertex, 0);
  }

  find(vertex: string): string {
    if (this.parent.get(vertex) !== vertex) {
      this.parent.set(vertex, this.find(this.parent.get(vertex)!));
    }
    return this.parent.get(vertex)!;
  }

  union(root1: string, root2: string): boolean {
    const parent1 = this.find(root1);
    const parent2 = this.find(root2);

    if (parent1 === parent2) return false;

    const rank1 = this.rank.get(parent1) || 0;
    const rank2 = this.rank.get(parent2) || 0;

    if (rank1 < rank2) {
      this.parent.set(parent1, parent2);
    } else if (rank1 > rank2) {
      this.parent.set(parent2, parent1);
    } else {
      this.parent.set(parent2, parent1);
      this.rank.set(parent1, rank1 + 1);
    }
    return true;
  }
}

export class NexusGraphAlgorithms {
  /**
   * BFS - Signal Pulse Broadcast (Minimum Hops)
   * Complexity: O(V + E)
   */
  static bfs(graph: NexusGraph, startId: string, targetId?: string): PathResult {
    const t0 = performance.now();
    const visited = new Set<string>();
    const queue = new NexusQueue<string>();
    const parent = new Map<string, string | null>();
    const visitedOrder: string[] = [];
    const steps: GraphStep[] = [];

    queue.enqueue(startId);
    visited.add(startId);
    parent.set(startId, null);

    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;
      visitedOrder.push(current);

      steps.push({
        currentSectorId: current,
        visitedSectors: Array.from(visited),
        description: `Signal pulse expanded to sector [${current}]`,
      });

      if (targetId && current === targetId) {
        break;
      }

      const neighbors = graph.getNeighbors(current);
      for (const edge of neighbors) {
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          parent.set(edge.target, current);
          queue.enqueue(edge.target);
        }
      }
    }

    const path: string[] = [];
    if (targetId && visited.has(targetId)) {
      let curr: string | null = targetId;
      while (curr !== null) {
        path.unshift(curr);
        curr = parent.get(curr) || null;
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      path,
      totalDistance: path.length > 0 ? path.length - 1 : 0,
      totalDanger: 0,
      totalEnergy: path.length * 10,
      timeTakenUs,
      visitedOrder,
      steps,
      theoreticalComplexity: "O(V + E)",
    };
  }

  /**
   * DFS - Deep Sub-core Probe (Deep recursion discovery)
   * Complexity: O(V + E)
   */
  static dfs(graph: NexusGraph, startId: string, targetId?: string): PathResult {
    const t0 = performance.now();
    const visited = new Set<string>();
    const stack = new NexusStack<string>();
    const parent = new Map<string, string | null>();
    const visitedOrder: string[] = [];
    const steps: GraphStep[] = [];

    stack.push(startId);
    parent.set(startId, null);

    while (!stack.isEmpty()) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;

      visited.add(current);
      visitedOrder.push(current);

      steps.push({
        currentSectorId: current,
        visitedSectors: Array.from(visited),
        description: `Deep probe advanced into sub-core [${current}]`,
      });

      if (targetId && current === targetId) {
        break;
      }

      const neighbors = graph.getNeighbors(current);
      for (const edge of neighbors) {
        if (!visited.has(edge.target)) {
          if (!parent.has(edge.target)) {
            parent.set(edge.target, current);
          }
          stack.push(edge.target);
        }
      }
    }

    const path: string[] = [];
    if (targetId && visited.has(targetId)) {
      let curr: string | null = targetId;
      while (curr !== null) {
        path.unshift(curr);
        curr = parent.get(curr) || null;
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      path,
      totalDistance: path.length > 0 ? path.length - 1 : 0,
      totalDanger: 0,
      totalEnergy: path.length * 12,
      timeTakenUs,
      visitedOrder,
      steps,
      theoreticalComplexity: "O(V + E)",
    };
  }

  /**
   * Dijkstra's Algorithm - Strategic Route Planning
   * Evaluates custom weight strategy:
   * - "DISTANCE_PRIORITY" (shortest physical distance)
   * - "SAFETY_PRIORITY" (minimize danger score)
   * - "BALANCED" (composite objective function: distance + 0.5 * danger + energy)
   * Complexity: O((V + E) log V) with Priority Queue
   */
  static dijkstra(
    graph: NexusGraph,
    startId: string,
    targetId: string,
    mode: "DISTANCE" | "SAFETY" | "BALANCED" = "BALANCED"
  ): PathResult {
    const t0 = performance.now();
    const distances = new Map<string, number>();
    const parents = new Map<string, { sector: string; edge: ConduitEdge } | null>();
    const visited = new Set<string>();
    const pq = new NexusPriorityQueue<string>(true); // Min-Heap
    const visitedOrder: string[] = [];
    const steps: GraphStep[] = [];

    const getEdgeCost = (edge: ConduitEdge): number => {
      if (mode === "DISTANCE") return edge.distance;
      if (mode === "SAFETY") return edge.danger * 2 + edge.distance * 0.2;
      // Balanced:
      return edge.distance + edge.danger * 0.8 + edge.energyCost * 0.5;
    };

    for (const v of graph.getAllVertices()) {
      distances.set(v.id, Infinity);
    }
    distances.set(startId, 0);
    pq.insert(startId, 0);
    parents.set(startId, null);

    while (!pq.isEmpty()) {
      const current = pq.extract()!;
      if (visited.has(current)) continue;
      visited.add(current);
      visitedOrder.push(current);

      const currentDist = distances.get(current)!;

      steps.push({
        currentSectorId: current,
        visitedSectors: Array.from(visited),
        costSoFar: Number(currentDist.toFixed(1)),
        description: `Dijkstra extracted min-cost node [${current}] (Accumulated Cost: ${currentDist.toFixed(1)})`,
      });

      if (current === targetId) break;

      const neighbors = graph.getNeighbors(current);
      for (const edge of neighbors) {
        if (visited.has(edge.target)) continue;

        const weight = getEdgeCost(edge);
        const newDist = currentDist + weight;

        if (newDist < distances.get(edge.target)!) {
          distances.set(edge.target, newDist);
          parents.set(edge.target, { sector: current, edge });
          pq.insert(edge.target, newDist);

          steps.push({
            currentSectorId: current,
            visitedSectors: Array.from(visited),
            edgeInspected: edge,
            description: `Relaxed edge ${current} -> ${edge.target} with new lower cost ${newDist.toFixed(1)}`,
          });
        }
      }
    }

    const path: string[] = [];
    let totalDistance = 0;
    let totalDanger = 0;
    let totalEnergy = 0;

    if (distances.get(targetId) !== Infinity) {
      let curr = targetId;
      path.unshift(curr);
      while (parents.get(curr)) {
        const p = parents.get(curr)!;
        totalDistance += p.edge.distance;
        totalDanger += p.edge.danger;
        totalEnergy += p.edge.energyCost;
        curr = p.sector;
        path.unshift(curr);
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      path,
      totalDistance,
      totalDanger,
      totalEnergy,
      timeTakenUs,
      visitedOrder,
      steps,
      theoreticalComplexity: "O((V + E) log V)",
    };
  }

  /**
   * Kruskal's Algorithm - Network Rebuild with Disjoint Set Union
   * Complexity: O(E log E)
   */
  static kruskalMST(graph: NexusGraph): MSTResult {
    const t0 = performance.now();
    const edges = graph.getAllEdges();
    // Sort edges by construction cost (distance + energyCost)
    edges.sort((a, b) => a.distance + a.energyCost - (b.distance + b.energyCost));

    const dsu = new DisjointSet();
    for (const v of graph.getAllVertices()) {
      dsu.makeSet(v.id);
    }

    const mstEdges: ConduitEdge[] = [];
    const steps: GraphStep[] = [];
    let totalCost = 0;

    for (const edge of edges) {
      const rootSource = dsu.find(edge.source);
      const rootTarget = dsu.find(edge.target);

      if (rootSource !== rootTarget) {
        dsu.union(rootSource, rootTarget);
        mstEdges.push(edge);
        const cost = edge.distance + edge.energyCost;
        totalCost += cost;

        steps.push({
          currentSectorId: edge.source,
          visitedSectors: mstEdges.map((e) => e.target),
          edgeInspected: edge,
          costSoFar: totalCost,
          description: `Kruskal added conduit ${edge.source} <-> ${edge.target} (Edge Cost: ${cost})`,
        });
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      edges: mstEdges,
      totalCost,
      algorithm: "KRUSKAL",
      timeTakenUs,
      steps,
      theoreticalComplexity: "O(E log E)",
    };
  }

  /**
   * Prim's Algorithm - Network Rebuild with Min-Heap
   * Complexity: O(E log V)
   */
  static primMST(graph: NexusGraph, startId?: string): MSTResult {
    const t0 = performance.now();
    const vertices = graph.getAllVertices();
    if (vertices.length === 0) {
      return { edges: [], totalCost: 0, algorithm: "PRIM", timeTakenUs: 1, steps: [], theoreticalComplexity: "O(E log V)" };
    }

    const start = startId || vertices[0].id;
    const visited = new Set<string>();
    const pq = new NexusPriorityQueue<ConduitEdge>(true);
    const mstEdges: ConduitEdge[] = [];
    const steps: GraphStep[] = [];
    let totalCost = 0;

    visited.add(start);
    for (const edge of graph.getNeighbors(start)) {
      pq.insert(edge, edge.distance + edge.energyCost);
    }

    while (!pq.isEmpty() && visited.size < vertices.length) {
      const edge = pq.extract()!;
      if (visited.has(edge.source) && visited.has(edge.target)) {
        continue;
      }

      const nextSector = visited.has(edge.source) ? edge.target : edge.source;
      visited.add(nextSector);
      mstEdges.push(edge);
      const edgeCost = edge.distance + edge.energyCost;
      totalCost += edgeCost;

      steps.push({
        currentSectorId: nextSector,
        visitedSectors: Array.from(visited),
        edgeInspected: edge,
        costSoFar: totalCost,
        description: `Prim anchored sector [${nextSector}] via conduit with cost ${edgeCost}`,
      });

      for (const nextEdge of graph.getNeighbors(nextSector)) {
        const dest = nextEdge.target;
        if (!visited.has(dest)) {
          pq.insert(nextEdge, nextEdge.distance + nextEdge.energyCost);
        }
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      edges: mstEdges,
      totalCost,
      algorithm: "PRIM",
      timeTakenUs,
      steps,
      theoreticalComplexity: "O(E log V)",
    };
  }
}
