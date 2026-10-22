/**
 * NEXUS Recursion & Recurrence Engine
 * Implements: Fractal Sub-Sector Collapse (Recursive Sub-dungeon generator),
 * Recurrence Relations difficulty scaling, Master Theorem Evaluator
 */

export interface FractalRoom {
  id: string;
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  anomalyType: "ENERGY_RIFT" | "DATA_CORE" | "CORRUPTED_CACHE" | "STABLE_ZONE";
  subRooms: FractalRoom[];
}

export interface MasterTheoremAnalysis {
  formula: string; // e.g. T(n) = a*T(n/b) + O(n^d)
  a: number;
  b: number;
  k: number;
  criticalExponent: number; // log_b(a)
  matchedCase: "CASE 1 (Leaves dominate)" | "CASE 2 (Equal work per level)" | "CASE 3 (Root dominates)";
  closedFormComplexity: string;
  explanation: string;
}

export class NexusRecurrenceEngine {
  /**
   * Recursive Fractal Sub-Sector Generator
   * Recurrence: T(n) = 2*T(n/2) + O(1) => O(n)
   */
  static generateFractalSubDungeon(
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
    maxDepth: number = 3
  ): FractalRoom {
    const anomalies: FractalRoom["anomalyType"][] = ["ENERGY_RIFT", "DATA_CORE", "CORRUPTED_CACHE", "STABLE_ZONE"];
    const anomalyType = anomalies[(depth + Math.floor(x + y)) % anomalies.length];

    const currentRoom: FractalRoom = {
      id: `fractal-${depth}-${Math.round(x)}-${Math.round(y)}`,
      depth,
      x,
      y,
      width,
      height,
      anomalyType,
      subRooms: [],
    };

    if (depth < maxDepth && width > 15 && height > 15) {
      const halfW = width / 2;
      const halfH = height / 2;

      // Split horizontally or vertically recursively
      if (depth % 2 === 0) {
        currentRoom.subRooms.push(this.generateFractalSubDungeon(x, y, halfW, height, depth + 1, maxDepth));
        currentRoom.subRooms.push(this.generateFractalSubDungeon(x + halfW, y, halfW, height, depth + 1, maxDepth));
      } else {
        currentRoom.subRooms.push(this.generateFractalSubDungeon(x, y, width, halfH, depth + 1, maxDepth));
        currentRoom.subRooms.push(this.generateFractalSubDungeon(x, y + halfH, width, halfH, depth + 1, maxDepth));
      }
    }

    return currentRoom;
  }

  /**
   * Master Theorem Evaluator for Recurrence Relations:
   * T(n) = a * T(n / b) + n^k
   */
  static evaluateMasterTheorem(a: number, b: number, k: number): MasterTheoremAnalysis {
    const criticalExponent = Math.log(a) / Math.log(b);
    const epsilon = 0.001;

    let matchedCase: MasterTheoremAnalysis["matchedCase"];
    let closedFormComplexity = "";
    let explanation = "";

    if (criticalExponent > k + epsilon) {
      matchedCase = "CASE 1 (Leaves dominate)";
      closedFormComplexity = `Θ(n^${criticalExponent.toFixed(2)})`;
      explanation = `Since log_${b}(${a}) = ${criticalExponent.toFixed(2)} > ${k}, the work is dominated by subproblems at leaf levels.`;
    } else if (Math.abs(criticalExponent - k) <= epsilon) {
      matchedCase = "CASE 2 (Equal work per level)";
      closedFormComplexity = k === 0 ? "Θ(log n)" : `Θ(n^${k} · log n)`;
      explanation = `Since log_${b}(${a}) = ${criticalExponent.toFixed(2)} ≈ ${k}, each level of the recursion tree performs equal asymptotic work.`;
    } else {
      matchedCase = "CASE 3 (Root dominates)";
      closedFormComplexity = `Θ(n^${k})`;
      explanation = `Since log_${b}(${a}) = ${criticalExponent.toFixed(2)} < ${k}, the work is dominated by the initial partition step at the root.`;
    }

    return {
      formula: `T(n) = ${a}T(n/${b}) + O(n^${k})`,
      a,
      b,
      k,
      criticalExponent: Number(criticalExponent.toFixed(3)),
      matchedCase,
      closedFormComplexity,
      explanation,
    };
  }
}
