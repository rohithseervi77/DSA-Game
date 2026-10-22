/**
 * NEXUS Core Data Structure: Stack (LIFO)
 * Powers: Temporal Flux (Rewind Drive), Action History, DFS Backtracking
 * Theoretical Complexity: Push O(1), Pop O(1), Peek O(1)
 */

export interface StackTelemetry {
  operation: "PUSH" | "POP" | "PEEK" | "CLEAR";
  itemSummary?: string;
  depthAfter: number;
  timeTakenUs: number; // microseconds
}

export class NexusStack<T> {
  private items: T[] = [];
  private capacity: number;
  private telemetryLog: StackTelemetry[] = [];

  constructor(capacity: number = 100) {
    this.capacity = capacity;
  }

  push(item: T, summary?: string): boolean {
    const t0 = performance.now();
    if (this.items.length >= this.capacity) {
      // Evict oldest if bounded rewind buffer
      this.items.shift();
    }
    this.items.push(item);
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);

    this.recordTelemetry({
      operation: "PUSH",
      itemSummary: summary || JSON.stringify(item).slice(0, 30),
      depthAfter: this.items.length,
      timeTakenUs,
    });
    return true;
  }

  pop(): T | undefined {
    const t0 = performance.now();
    if (this.isEmpty()) return undefined;
    const item = this.items.pop();
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);

    this.recordTelemetry({
      operation: "POP",
      itemSummary: item ? JSON.stringify(item).slice(0, 30) : undefined,
      depthAfter: this.items.length,
      timeTakenUs,
    });
    return item;
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
    this.recordTelemetry({
      operation: "CLEAR",
      depthAfter: 0,
      timeTakenUs: 1,
    });
  }

  toArray(): T[] {
    return [...this.items];
  }

  getTelemetry(): StackTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(record: StackTelemetry): void {
    this.telemetryLog.push(record);
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
