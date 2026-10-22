/**
 * NEXUS Core Data Structure: Singly Linked List
 * Powers: Dynamic Mission Chains, Mid-chain Emergency Event Insertion
 * Theoretical Complexity: Insert at Head O(1), Insert after Node O(1), Search O(n), Delete O(n)
 */

export class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export interface SinglyLinkedListTelemetry {
  operation: "APPEND" | "PREPEND" | "INSERT_AFTER" | "REMOVE" | "TRAVERSE";
  nodesCount: number;
  timeTakenUs: number;
}

export class NexusSinglyLinkedList<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private length: number = 0;
  private telemetryLog: SinglyLinkedListTelemetry[] = [];

  append(value: T): LinkedListNode<T> {
    const t0 = performance.now();
    const newNode = new LinkedListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("APPEND", timeTakenUs);
    return newNode;
  }

  prepend(value: T): LinkedListNode<T> {
    const t0 = performance.now();
    const newNode = new LinkedListNode(value);
    newNode.next = this.head;
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }
    this.length++;

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("PREPEND", timeTakenUs);
    return newNode;
  }

  insertAfter(predicate: (val: T) => boolean, value: T): boolean {
    const t0 = performance.now();
    let current = this.head;
    while (current) {
      if (predicate(current.value)) {
        const newNode = new LinkedListNode(value);
        newNode.next = current.next;
        current.next = newNode;
        if (current === this.tail) {
          this.tail = newNode;
        }
        this.length++;

        const timeTakenUs = Math.round((performance.now() - t0) * 1000);
        this.recordTelemetry("INSERT_AFTER", timeTakenUs);
        return true;
      }
      current = current.next;
    }
    return false;
  }

  remove(predicate: (val: T) => boolean): T | null {
    const t0 = performance.now();
    if (!this.head) return null;

    if (predicate(this.head.value)) {
      const removed = this.head.value;
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this.length--;
      this.recordTelemetry("REMOVE", Math.round((performance.now() - t0) * 1000));
      return removed;
    }

    let current = this.head;
    while (current.next && !predicate(current.next.value)) {
      current = current.next;
    }

    if (current.next) {
      const removed = current.next.value;
      if (current.next === this.tail) {
        this.tail = current;
      }
      current.next = current.next.next;
      this.length--;
      this.recordTelemetry("REMOVE", Math.round((performance.now() - t0) * 1000));
      return removed;
    }

    return null;
  }

  toArray(): T[] {
    const arr: T[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  getTelemetry(): SinglyLinkedListTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(operation: "APPEND" | "PREPEND" | "INSERT_AFTER" | "REMOVE" | "TRAVERSE", timeTakenUs: number): void {
    this.telemetryLog.push({
      operation,
      nodesCount: this.length,
      timeTakenUs,
    });
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
