/**
 * NEXUS Core Data Structure: Circular Linked List
 * Powers: Faction Orbit Cycles, Patrol Drone Loops, Planetary Day/Night Harmonic Waves
 * Theoretical Complexity: Advance Pointer O(1), Insert O(1), Delete O(n)
 */

export class CircularNode<T> {
  value: T;
  next: CircularNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export interface CircularLinkedListTelemetry {
  operation: "INSERT" | "ADVANCE" | "REMOVE";
  currentLabel: string;
  totalRingNodes: number;
  timeTakenUs: number;
}

export class NexusCircularLinkedList<T> {
  private head: CircularNode<T> | null = null;
  private current: CircularNode<T> | null = null;
  private length: number = 0;
  private telemetryLog: CircularLinkedListTelemetry[] = [];

  insert(value: T): CircularNode<T> {
    const t0 = performance.now();
    const newNode = new CircularNode(value);

    if (!this.head) {
      this.head = newNode;
      newNode.next = this.head;
      this.current = this.head;
    } else {
      let tail = this.head;
      while (tail.next !== this.head) {
        tail = tail.next!;
      }
      tail.next = newNode;
      newNode.next = this.head;
    }
    this.length++;

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("INSERT", String(value).slice(0, 20), timeTakenUs);
    return newNode;
  }

  advance(): T | null {
    const t0 = performance.now();
    if (!this.current) return null;

    this.current = this.current.next;
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("ADVANCE", String(this.current?.value).slice(0, 20), timeTakenUs);
    return this.current ? this.current.value : null;
  }

  getCurrent(): T | null {
    return this.current ? this.current.value : null;
  }

  size(): number {
    return this.length;
  }

  toArray(): T[] {
    if (!this.head) return [];
    const arr: T[] = [];
    let cur = this.head;
    do {
      arr.push(cur.value);
      cur = cur.next!;
    } while (cur !== this.head);
    return arr;
  }

  getTelemetry(): CircularLinkedListTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(operation: "INSERT" | "ADVANCE" | "REMOVE", currentLabel: string, timeTakenUs: number): void {
    this.telemetryLog.push({
      operation,
      currentLabel,
      totalRingNodes: this.length,
      timeTakenUs,
    });
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
