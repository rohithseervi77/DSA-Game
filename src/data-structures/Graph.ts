/**
 * NEXUS Core Data Structure: Living Graph (Adjacency List)
 * Powers: Living World Map, Dynamic Sector Interconnections, Adaptive Conduit Mutations
 * Theoretical Complexity: Add Vertex O(1), Add Edge O(1), Remove Vertex O(V + E), Neighbors O(degree)
 */

export interface SectorNode {
  id: string;
  name: string;
  type: "HUB" | "RESOURCE_WELL" | "RESEARCH_LAB" | "DEFENSE_TOWER" | "QUANTUM_GATEWAY" | "CORRUPTED_CACHE";
  x: number; // Normalized 0-100 canvas position
  y: number;
  threatLevel: number; // 0-100
  stability: number; // 0-100
  energyYield: number;
  isUnlocked: boolean;
  isVisited: boolean;
  isCorrupted: boolean;
  description: string;
}

export interface ConduitEdge {
  id: string;
  source: string;
  target: string;
  distance: number;
  danger: number;
  energyCost: number;
  bandwidth: number;
  isActive: boolean;
  isSevered?: boolean;
}

export interface GraphTelemetry {
  operation: "ADD_VERTEX" | "ADD_EDGE" | "SEVER_EDGE" | "MUTATE_WEIGHTS" | "QUERY_NEIGHBORS";
  vertexCount: number;
  edgeCount: number;
  density: number;
  timeTakenUs: number;
}

export class NexusGraph {
  private vertices: Map<string, SectorNode> = new Map();
  private adjacencyList: Map<string, ConduitEdge[]> = new Map();
  private telemetryLog: GraphTelemetry[] = [];

  addVertex(sector: SectorNode): void {
    const t0 = performance.now();
    this.vertices.set(sector.id, sector);
    if (!this.adjacencyList.has(sector.id)) {
      this.adjacencyList.set(sector.id, []);
    }
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("ADD_VERTEX", timeTakenUs);
  }

  addEdge(edge: ConduitEdge, bidirectional: boolean = true): void {
    const t0 = performance.now();
    if (!this.vertices.has(edge.source) || !this.vertices.has(edge.target)) {
      return;
    }

    const sourceEdges = this.adjacencyList.get(edge.source) || [];
    sourceEdges.push(edge);
    this.adjacencyList.set(edge.source, sourceEdges);

    if (bidirectional) {
      const returnEdge: ConduitEdge = {
        id: `${edge.id}-rev`,
        source: edge.target,
        target: edge.source,
        distance: edge.distance,
        danger: edge.danger,
        energyCost: edge.energyCost,
        bandwidth: edge.bandwidth,
        isActive: edge.isActive,
        isSevered: edge.isSevered,
      };
      const targetEdges = this.adjacencyList.get(edge.target) || [];
      targetEdges.push(returnEdge);
      this.adjacencyList.set(edge.target, targetEdges);
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("ADD_EDGE", timeTakenUs);
  }

  getNeighbors(sectorId: string): ConduitEdge[] {
    const t0 = performance.now();
    const edges = this.adjacencyList.get(sectorId) || [];
    const activeEdges = edges.filter((e) => e.isActive && !e.isSevered);
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("QUERY_NEIGHBORS", timeTakenUs);
    return activeEdges;
  }

  getVertex(sectorId: string): SectorNode | undefined {
    return this.vertices.get(sectorId);
  }

  getAllVertices(): SectorNode[] {
    return Array.from(this.vertices.values());
  }

  getAllEdges(): ConduitEdge[] {
    const edgeMap = new Map<string, ConduitEdge>();
    for (const edges of this.adjacencyList.values()) {
      for (const e of edges) {
        // Keep unique undirected edges by sorted key
        const key = [e.source, e.target].sort().join("<->");
        if (!edgeMap.has(key)) {
          edgeMap.set(key, e);
        }
      }
    }
    return Array.from(edgeMap.values());
  }

  severEdge(source: string, target: string): boolean {
    const t0 = performance.now();
    let severed = false;

    const sourceEdges = this.adjacencyList.get(source) || [];
    for (const edge of sourceEdges) {
      if (edge.target === target) {
        edge.isSevered = true;
        edge.isActive = false;
        severed = true;
      }
    }

    const targetEdges = this.adjacencyList.get(target) || [];
    for (const edge of targetEdges) {
      if (edge.target === source) {
        edge.isSevered = true;
        edge.isActive = false;
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("SEVER_EDGE", timeTakenUs);
    return severed;
  }

  restoreEdge(source: string, target: string): boolean {
    let restored = false;
    const sourceEdges = this.adjacencyList.get(source) || [];
    for (const edge of sourceEdges) {
      if (edge.target === target) {
        edge.isSevered = false;
        edge.isActive = true;
        restored = true;
      }
    }
    const targetEdges = this.adjacencyList.get(target) || [];
    for (const edge of targetEdges) {
      if (edge.target === source) {
        edge.isSevered = false;
        edge.isActive = true;
      }
    }
    return restored;
  }

  mutateEdgeWeights(source: string, target: string, multiplier: number): void {
    const t0 = performance.now();
    const sourceEdges = this.adjacencyList.get(source) || [];
    for (const edge of sourceEdges) {
      if (edge.target === target) {
        edge.danger = Math.min(100, Math.round(edge.danger * multiplier));
        edge.energyCost = Math.round(edge.energyCost * multiplier);
      }
    }
    const targetEdges = this.adjacencyList.get(target) || [];
    for (const edge of targetEdges) {
      if (edge.target === source) {
        edge.danger = Math.min(100, Math.round(edge.danger * multiplier));
        edge.energyCost = Math.round(edge.energyCost * multiplier);
      }
    }
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("MUTATE_WEIGHTS", timeTakenUs);
  }

  getDensity(): number {
    const V = this.vertices.size;
    if (V <= 1) return 0;
    const E = this.getAllEdges().length;
    return Number(((2 * E) / (V * (V - 1))).toFixed(3));
  }

  getTelemetry(): GraphTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(operation: GraphTelemetry["operation"], timeTakenUs: number): void {
    const V = this.vertices.size;
    const E = this.getAllEdges().length;
    this.telemetryLog.push({
      operation,
      vertexCount: V,
      edgeCount: E,
      density: this.getDensity(),
      timeTakenUs,
    });
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
