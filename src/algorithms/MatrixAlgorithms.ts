/**
 * NEXUS Advanced Matrix Engine
 * Implements: Strassen Matrix Multiplication, Matrix Chain Multiplication (MCM)
 * Powers: Quantum Core Overdrive Simulation & Pipeline Optimization
 */

export interface StrassenResult {
  matrixA: number[][];
  matrixB: number[][];
  resultMatrix: number[][];
  standardMultiplications: number; // naive O(n^3)
  strassenMultiplications: number; // O(n^2.807)
  savingsPercent: number;
  timeTakenUs: number;
}

export interface MCMResult {
  dimensions: number[];
  minScalarMultiplications: number;
  optimalParenthesization: string;
  mTable: number[][];
  sTable: number[][];
  timeTakenUs: number;
  theoreticalComplexity: string;
}

export class NexusMatrixEngine {
  /**
   * Helper matrix additions & subtractions for Strassen
   */
  private static addMatrix(A: number[][], B: number[][]): number[][] {
    const n = A.length;
    const C: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        C[i][j] = A[i][j] + B[i][j];
      }
    }
    return C;
  }

  private static subMatrix(A: number[][], B: number[][]): number[][] {
    const n = A.length;
    const C: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        C[i][j] = A[i][j] - B[i][j];
      }
    }
    return C;
  }

  /**
   * Strassen Matrix Multiplication (fast divide-and-conquer)
   * Theoretical Complexity: O(n^log2(7)) ≈ O(n^2.807)
   */
  static multiplyStrassen(A: number[][], B: number[][]): StrassenResult {
    const t0 = performance.now();
    const n = A.length;

    const strassenRecursive = (M1: number[][], M2: number[][]): number[][] => {
      const size = M1.length;
      if (size === 1) {
        return [[M1[0][0] * M2[0][0]]];
      }

      const half = Math.floor(size / 2);
      const A11: number[][] = Array.from({ length: half }, () => new Array(half).fill(0));
      const A12: number[][] = Array.from({ length: half }, () => new Array(half).fill(0));
      const A21: number[][] = Array.from({ length: half }, () => new Array(half).fill(0));
      const A22: number[][] = Array.from({ length: half }, () => new Array(half).fill(0));

      const B11: number[][] = Array.from({ length: half }, () => new Array(half).fill(0));
      const B12: number[][] = Array.from({ length: half }, () => new Array(half).fill(0));
      const B21: number[][] = Array.from({ length: half }, () => new Array(half).fill(0));
      const B22: number[][] = Array.from({ length: half }, () => new Array(half).fill(0));

      for (let i = 0; i < half; i++) {
        for (let j = 0; j < half; j++) {
          A11[i][j] = M1[i][j];
          A12[i][j] = M1[i][j + half];
          A21[i][j] = M1[i + half][j];
          A22[i][j] = M1[i + half][j + half];

          B11[i][j] = M2[i][j];
          B12[i][j] = M2[i][j + half];
          B21[i][j] = M2[i + half][j];
          B22[i][j] = M2[i + half][j + half];
        }
      }

      // 7 Strassen products:
      const P1 = strassenRecursive(A11, this.subMatrix(B12, B22));
      const P2 = strassenRecursive(this.addMatrix(A11, A12), B22);
      const P3 = strassenRecursive(this.addMatrix(A21, A22), B11);
      const P4 = strassenRecursive(A22, this.subMatrix(B21, B11));
      const P5 = strassenRecursive(this.addMatrix(A11, A22), this.addMatrix(B11, B22));
      const P6 = strassenRecursive(this.subMatrix(A12, A22), this.addMatrix(B21, B22));
      const P7 = strassenRecursive(this.subMatrix(A11, A21), this.addMatrix(B11, B12));

      // Recombine quadrants
      const C11 = this.addMatrix(this.subMatrix(this.addMatrix(P5, P4), P2), P6);
      const C12 = this.addMatrix(P1, P2);
      const C21 = this.addMatrix(P3, P4);
      const C22 = this.subMatrix(this.subMatrix(this.addMatrix(P5, P1), P3), P7);

      const C: number[][] = Array.from({ length: size }, () => new Array(size).fill(0));
      for (let i = 0; i < half; i++) {
        for (let j = 0; j < half; j++) {
          C[i][j] = C11[i][j];
          C[i][j + half] = C12[i][j];
          C[i + half][j] = C21[i][j];
          C[i + half][j + half] = C22[i][j];
        }
      }
      return C;
    };

    const resultMatrix = strassenRecursive(A, B);
    const standardMultiplications = Math.pow(n, 3);
    const strassenMultiplications = Math.round(Math.pow(7, Math.log2(n)));
    const savingsPercent = Number((((standardMultiplications - strassenMultiplications) / standardMultiplications) * 100).toFixed(1));
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);

    return {
      matrixA: A,
      matrixB: B,
      resultMatrix,
      standardMultiplications,
      strassenMultiplications,
      savingsPercent: Math.max(0, savingsPercent),
      timeTakenUs,
    };
  }

  /**
   * Matrix Chain Multiplication (Dynamic Programming)
   * Finds the optimal parenthesization order to minimize scalar operations
   * Complexity: O(n^3) time, O(n^2) space
   */
  static matrixChainOrder(p: number[]): MCMResult {
    const t0 = performance.now();
    const n = p.length - 1; // Number of matrices
    const m: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const s: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    // l is chain length
    for (let l = 2; l <= n; l++) {
      for (let i = 0; i < n - l + 1; i++) {
        const j = i + l - 1;
        m[i][j] = Infinity;
        for (let k = i; k < j; k++) {
          const q = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
          if (q < m[i][j]) {
            m[i][j] = q;
            s[i][j] = k;
          }
        }
      }
    }

    const printOptimal = (i: number, j: number): string => {
      if (i === j) {
        return `Matrix[${i + 1}]`;
      }
      return `(${printOptimal(i, s[i][j])} × ${printOptimal(s[i][j] + 1, j)})`;
    };

    const optimalParenthesization = printOptimal(0, n - 1);
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);

    return {
      dimensions: p,
      minScalarMultiplications: m[0][n - 1],
      optimalParenthesization,
      mTable: m,
      sTable: s,
      timeTakenUs,
      theoreticalComplexity: "O(n³)",
    };
  }
}
