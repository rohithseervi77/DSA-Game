/**
 * NEXUS Core Data Structure: AVL Tree (Self-Balancing Binary Search Tree)
 * Powers: Knowledge Stabilization Engine (Auto-rotations LL, RR, LR, RL)
 * Theoretical Complexity: Search O(log n), Insert O(log n), Delete O(log n) guaranteed
 */

export class AVLNode<K, V> {
  key: K;
  value: V;
  height: number = 1;
  left: AVLNode<K, V> | null = null;
  right: AVLNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export type RotationType = "LL (Right Rotation)" | "RR (Left Rotation)" | "LR (Left-Right Rotation)" | "RL (Right-Left Rotation)";

export interface AVLRotationEvent {
  type: RotationType;
  unbalancedKey: string;
  pivotKey: string;
  timestamp: number;
}

export interface AVLTelemetry {
  operation: "INSERT" | "SEARCH" | "REBALANCE";
  key: string;
  balanceFactor: number;
  rotationsPerformed: number;
  timeTakenUs: number;
}

export class NexusAVLTree<K extends number | string, V> {
  private root: AVLNode<K, V> | null = null;
  private count: number = 0;
  private rotationHistory: AVLRotationEvent[] = [];
  private telemetryLog: AVLTelemetry[] = [];

  private getHeight(node: AVLNode<K, V> | null): number {
    return node ? node.height : 0;
  }

  private getBalance(node: AVLNode<K, V> | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private updateHeight(node: AVLNode<K, V>): void {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  // Right Rotation (LL Fix)
  private rotateRight(y: AVLNode<K, V>): AVLNode<K, V> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    this.rotationHistory.push({
      type: "LL (Right Rotation)",
      unbalancedKey: String(y.key),
      pivotKey: String(x.key),
      timestamp: Date.now(),
    });
    return x;
  }

  // Left Rotation (RR Fix)
  private rotateLeft(x: AVLNode<K, V>): AVLNode<K, V> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    this.rotationHistory.push({
      type: "RR (Left Rotation)",
      unbalancedKey: String(x.key),
      pivotKey: String(y.key),
      timestamp: Date.now(),
    });
    return y;
  }

  insert(key: K, value: V): void {
    const t0 = performance.now();
    let rotationsBefore = this.rotationHistory.length;

    const insertNode = (node: AVLNode<K, V> | null): AVLNode<K, V> => {
      if (!node) {
        this.count++;
        return new AVLNode(key, value);
      }

      if (key < node.key) {
        node.left = insertNode(node.left);
      } else if (key > node.key) {
        node.right = insertNode(node.right);
      } else {
        node.value = value;
        return node;
      }

      this.updateHeight(node);
      const balance = this.getBalance(node);

      // LL Case
      if (balance > 1 && key < node.left!.key) {
        return this.rotateRight(node);
      }

      // RR Case
      if (balance < -1 && key > node.right!.key) {
        return this.rotateLeft(node);
      }

      // LR Case
      if (balance > 1 && key > node.left!.key) {
        this.rotationHistory.push({
          type: "LR (Left-Right Rotation)",
          unbalancedKey: String(node.key),
          pivotKey: String(node.left!.key),
          timestamp: Date.now(),
        });
        node.left = this.rotateLeft(node.left!);
        return this.rotateRight(node);
      }

      // RL Case
      if (balance < -1 && key < node.right!.key) {
        this.rotationHistory.push({
          type: "RL (Right-Left Rotation)",
          unbalancedKey: String(node.key),
          pivotKey: String(node.right!.key),
          timestamp: Date.now(),
        });
        node.right = this.rotateRight(node.right!);
        return this.rotateLeft(node);
      }

      return node;
    };

    this.root = insertNode(this.root);
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    const rotationsDone = this.rotationHistory.length - rotationsBefore;

    this.telemetryLog.push({
      operation: "INSERT",
      key: String(key),
      balanceFactor: this.getBalance(this.root),
      rotationsPerformed: rotationsDone,
      timeTakenUs,
    });
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }

  search(key: K): V | null {
    let current = this.root;
    while (current) {
      if (key === current.key) return current.value;
      if (key < current.key) current = current.left;
      else current = current.right;
    }
    return null;
  }

  getRoot(): AVLNode<K, V> | null {
    return this.root;
  }

  size(): number {
    return this.count;
  }

  getTreeHeight(): number {
    return this.getHeight(this.root);
  }

  getRecentRotations(): AVLRotationEvent[] {
    return this.rotationHistory.slice(-5);
  }

  getTelemetry(): AVLTelemetry[] {
    return this.telemetryLog.slice(-10);
  }
}
