/**
 * NEXUS Core Data Structure: Binary Search Tree (BST)
 * Powers: Knowledge Vault Archive, Sector Chronology Index
 * Theoretical Complexity: Search O(log n) avg, O(n) worst; Insert O(log n) avg, O(n) worst
 */

export class BSTNode<K, V> {
  key: K;
  value: V;
  left: BSTNode<K, V> | null = null;
  right: BSTNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export interface BSTTelemetry {
  operation: "INSERT" | "SEARCH" | "TRAVERSE";
  keyAccessed: string;
  depthReached: number;
  timeTakenUs: number;
}

export class NexusBST<K extends number | string, V> {
  private root: BSTNode<K, V> | null = null;
  private count: number = 0;
  private telemetryLog: BSTTelemetry[] = [];

  insert(key: K, value: V): void {
    const t0 = performance.now();
    let depth = 0;

    const insertNode = (node: BSTNode<K, V> | null): BSTNode<K, V> => {
      depth++;
      if (!node) {
        this.count++;
        return new BSTNode(key, value);
      }
      if (key < node.key) {
        node.left = insertNode(node.left);
      } else if (key > node.key) {
        node.right = insertNode(node.right);
      } else {
        node.value = value; // update
      }
      return node;
    };

    this.root = insertNode(this.root);
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("INSERT", String(key), depth, timeTakenUs);
  }

  search(key: K): V | null {
    const t0 = performance.now();
    let current = this.root;
    let depth = 0;

    while (current) {
      depth++;
      if (key === current.key) {
        const timeTakenUs = Math.round((performance.now() - t0) * 1000);
        this.recordTelemetry("SEARCH", String(key), depth, timeTakenUs);
        return current.value;
      }
      if (key < current.key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("SEARCH", String(key), depth, timeTakenUs);
    return null;
  }

  inOrderTraversal(): { key: K; value: V }[] {
    const result: { key: K; value: V }[] = [];
    const traverse = (node: BSTNode<K, V> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push({ key: node.key, value: node.value });
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  getHeight(): number {
    const calcHeight = (node: BSTNode<K, V> | null): number => {
      if (!node) return 0;
      return 1 + Math.max(calcHeight(node.left), calcHeight(node.right));
    };
    return calcHeight(this.root);
  }

  size(): number {
    return this.count;
  }

  getRoot(): BSTNode<K, V> | null {
    return this.root;
  }

  clear(): void {
    this.root = null;
    this.count = 0;
  }

  getTelemetry(): BSTTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(operation: "INSERT" | "SEARCH" | "TRAVERSE", keyAccessed: string, depthReached: number, timeTakenUs: number): void {
    this.telemetryLog.push({
      operation,
      keyAccessed,
      depthReached,
      timeTakenUs,
    });
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
