/**
 * NEXUS Core Data Structure: Binary Heap / Priority Queue
 * Powers: Apex Threat Interceptor, Distress Signal Priority, Dijkstra Shortest Path Solver
 * Theoretical Complexity: Insert O(log n), Extract O(log n), Peek O(1)
 */

export interface HeapNode<T> {
  item: T;
  priority: number; // lower number = higher priority for min-heap; higher number = higher for max-heap
}

export interface PriorityQueueTelemetry {
  operation: "INSERT" | "EXTRACT" | "PEEK";
  priority: number;
  heapSizeAfter: number;
  timeTakenUs: number;
}

export class NexusPriorityQueue<T> {
  private heap: HeapNode<T>[] = [];
  private isMinHeap: boolean;
  private telemetryLog: PriorityQueueTelemetry[] = [];

  constructor(isMinHeap: boolean = true) {
    this.isMinHeap = isMinHeap;
  }

  private compare(a: number, b: number): boolean {
    return this.isMinHeap ? a < b : a > b;
  }

  insert(item: T, priority: number): void {
    const t0 = performance.now();
    const node: HeapNode<T> = { item, priority };
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry({
      operation: "INSERT",
      priority,
      heapSizeAfter: this.heap.length,
      timeTakenUs,
    });
  }

  extract(): T | null {
    const t0 = performance.now();
    if (this.isEmpty()) return null;

    const root = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry({
      operation: "EXTRACT",
      priority: root.priority,
      heapSizeAfter: this.heap.length,
      timeTakenUs,
    });
    return root.item;
  }

  peek(): T | null {
    if (this.isEmpty()) return null;
    return this.heap[0].item;
  }

  peekPriority(): number | null {
    if (this.isEmpty()) return null;
    return this.heap[0].priority;
  }

  private bubbleUp(index: number): void {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (this.compare(element.priority, parent.priority)) {
        this.heap[index] = parent;
        this.heap[parentIndex] = element;
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let targetIndex = -1;

      if (leftChildIndex < length) {
        if (this.compare(this.heap[leftChildIndex].priority, element.priority)) {
          targetIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const compareWith = targetIndex === -1 ? element.priority : this.heap[leftChildIndex].priority;
        if (this.compare(this.heap[rightChildIndex].priority, compareWith)) {
          targetIndex = rightChildIndex;
        }
      }

      if (targetIndex !== -1) {
        this.heap[index] = this.heap[targetIndex];
        this.heap[targetIndex] = element;
        index = targetIndex;
      } else {
        break;
      }
    }
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  size(): number {
    return this.heap.length;
  }

  toArray(): { item: T; priority: number }[] {
    return [...this.heap];
  }

  getTelemetry(): PriorityQueueTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(record: PriorityQueueTelemetry): void {
    this.telemetryLog.push(record);
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
