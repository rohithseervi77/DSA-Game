/**
 * NEXUS Core Data Structure: FIFO Queue
 * Powers: Sector Transmission Relay, Distress Packets, Wave Processing Buffer
 * Theoretical Complexity: Enqueue O(1), Dequeue O(1), Peek O(1)
 */

export interface QueueTelemetry {
  operation: "ENQUEUE" | "DEQUEUE" | "PEEK" | "CLEAR";
  itemSummary?: string;
  sizeAfter: number;
  timeTakenUs: number;
}

export class NexusQueue<T> {
  private items: T[] = [];
  private capacity: number;
  private telemetryLog: QueueTelemetry[] = [];

  constructor(capacity: number = 200) {
    this.capacity = capacity;
  }

  enqueue(item: T, summary?: string): boolean {
    const t0 = performance.now();
    if (this.items.length >= this.capacity) {
      return false; // Queue saturated
    }
    this.items.push(item);
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);

    this.recordTelemetry({
      operation: "ENQUEUE",
      itemSummary: summary || JSON.stringify(item).slice(0, 30),
      sizeAfter: this.items.length,
      timeTakenUs,
    });
    return true;
  }

  dequeue(): T | undefined {
    const t0 = performance.now();
    if (this.isEmpty()) return undefined;
    const item = this.items.shift();
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);

    this.recordTelemetry({
      operation: "DEQUEUE",
      itemSummary: item ? JSON.stringify(item).slice(0, 30) : undefined,
      sizeAfter: this.items.length,
      timeTakenUs,
    });
    return item;
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[0];
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
      sizeAfter: 0,
      timeTakenUs: 1,
    });
  }

  toArray(): T[] {
    return [...this.items];
  }

  getTelemetry(): QueueTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(record: QueueTelemetry): void {
    this.telemetryLog.push(record);
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
