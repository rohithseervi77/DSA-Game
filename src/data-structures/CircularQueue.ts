/**
 * NEXUS Core Data Structure: Circular Queue (Ring Buffer)
 * Powers: Cyclic Defense Matrix, Rotating Station Grid, Orbital Shield Harmonics
 * Theoretical Complexity: Enqueue O(1), Dequeue O(1), Front/Rear Access O(1)
 */

export interface CircularQueueTelemetry {
  operation: "ENQUEUE" | "DEQUEUE" | "ROTATE";
  front: number;
  rear: number;
  count: number;
  capacity: number;
  timeTakenUs: number;
}

export class NexusCircularQueue<T> {
  private buffer: (T | null)[];
  private capacity: number;
  private front: number = 0;
  private rear: number = -1;
  private count: number = 0;
  private telemetryLog: CircularQueueTelemetry[] = [];

  constructor(capacity: number = 6) {
    this.capacity = capacity;
    this.buffer = new Array(capacity).fill(null);
  }

  enqueue(item: T): boolean {
    const t0 = performance.now();
    if (this.isFull()) return false;

    this.rear = (this.rear + 1) % this.capacity;
    this.buffer[this.rear] = item;
    this.count++;

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("ENQUEUE", timeTakenUs);
    return true;
  }

  dequeue(): T | null {
    const t0 = performance.now();
    if (this.isEmpty()) return null;

    const item = this.buffer[this.front];
    this.buffer[this.front] = null;
    this.front = (this.front + 1) % this.capacity;
    this.count--;

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("DEQUEUE", timeTakenUs);
    return item;
  }

  rotate(): T | null {
    const t0 = performance.now();
    if (this.isEmpty()) return null;

    // Cycle the front element to the rear
    const item = this.dequeue();
    if (item !== null) {
      this.enqueue(item);
    }
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("ROTATE", timeTakenUs);
    return item;
  }

  peekFront(): T | null {
    if (this.isEmpty()) return null;
    return this.buffer[this.front];
  }

  isFull(): boolean {
    return this.count === this.capacity;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  size(): number {
    return this.count;
  }

  getCapacity(): number {
    return this.capacity;
  }

  getSlots(): { index: number; value: T | null; isFront: boolean; isRear: boolean }[] {
    return this.buffer.map((val, idx) => ({
      index: idx,
      value: val,
      isFront: idx === this.front && !this.isEmpty(),
      isRear: idx === this.rear && !this.isEmpty(),
    }));
  }

  getTelemetry(): CircularQueueTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(operation: "ENQUEUE" | "DEQUEUE" | "ROTATE", timeTakenUs: number): void {
    this.telemetryLog.push({
      operation,
      front: this.front,
      rear: this.rear,
      count: this.count,
      capacity: this.capacity,
      timeTakenUs,
    });
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
