/**
 * NEXUS Core Data Structure: Doubly Linked List
 * Powers: Neural Memory Walk (Bidirectional Scrubbing: Prev <-> Current <-> Next)
 * Theoretical Complexity: Insert O(1), Delete O(1), Step Prev/Next O(1)
 */

export class DoublyLinkedListNode<T> {
  value: T;
  prev: DoublyLinkedListNode<T> | null = null;
  next: DoublyLinkedListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export interface DoublyLinkedListTelemetry {
  operation: "PUSH" | "STEP_BACK" | "STEP_FORWARD" | "CLEAR";
  currentIndex: number;
  totalNodes: number;
  timeTakenUs: number;
}

export class NexusDoublyLinkedList<T> {
  private head: DoublyLinkedListNode<T> | null = null;
  private tail: DoublyLinkedListNode<T> | null = null;
  private current: DoublyLinkedListNode<T> | null = null;
  private length: number = 0;
  private currentIndex: number = -1;
  private telemetryLog: DoublyLinkedListTelemetry[] = [];

  append(value: T): DoublyLinkedListNode<T> {
    const t0 = performance.now();
    const newNode = new DoublyLinkedListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
      this.currentIndex = 0;
    } else if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
      this.current = newNode;
      this.currentIndex = this.length;
    }
    this.length++;

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("PUSH", timeTakenUs);
    return newNode;
  }

  stepBack(): T | null {
    const t0 = performance.now();
    if (!this.current || !this.current.prev) return null;

    this.current = this.current.prev;
    this.currentIndex--;

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("STEP_BACK", timeTakenUs);
    return this.current.value;
  }

  stepForward(): T | null {
    const t0 = performance.now();
    if (!this.current || !this.current.next) return null;

    this.current = this.current.next;
    this.currentIndex++;

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry("STEP_FORWARD", timeTakenUs);
    return this.current.value;
  }

  getCurrent(): T | null {
    return this.current ? this.current.value : null;
  }

  hasPrev(): boolean {
    return this.current?.prev !== null && this.current?.prev !== undefined;
  }

  hasNext(): boolean {
    return this.current?.next !== null && this.current?.next !== undefined;
  }

  toArray(): T[] {
    const list: T[] = [];
    let cur = this.head;
    while (cur) {
      list.push(cur.value);
      cur = cur.next;
    }
    return list;
  }

  size(): number {
    return this.length;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.length = 0;
    this.currentIndex = -1;
    this.recordTelemetry("CLEAR", 1);
  }

  getTelemetry(): DoublyLinkedListTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(operation: "PUSH" | "STEP_BACK" | "STEP_FORWARD" | "CLEAR", timeTakenUs: number): void {
    this.telemetryLog.push({
      operation,
      currentIndex: this.currentIndex,
      totalNodes: this.length,
      timeTakenUs,
    });
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
