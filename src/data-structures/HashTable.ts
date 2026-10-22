/**
 * NEXUS Core Data Structure: Hash Table with Separate Chaining
 * Powers: Neural Memory Vault, Fast Encrypted Telemetry Retrieval, Collision Resolution Mechanic
 * Theoretical Complexity: Average O(1), Worst O(n) under heavy collision
 */

export interface HashEntry<V> {
  key: string;
  value: V;
  isCorrupted?: boolean;
}

export interface HashTableTelemetry {
  operation: "SET" | "GET" | "RESOLVE_COLLISION" | "REHASH";
  key: string;
  bucketIndex: number;
  chainLength: number;
  totalCollisions: number;
  loadFactor: number;
  timeTakenUs: number;
}

export class NexusHashTable<V> {
  private buckets: HashEntry<V>[][];
  private capacity: number;
  private count: number = 0;
  private collisionCount: number = 0;
  private telemetryLog: HashTableTelemetry[] = [];

  constructor(capacity: number = 31) {
    this.capacity = capacity;
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  // Polynomial rolling hash
  private hash(key: string): number {
    let hashVal = 0;
    const prime = 31;
    for (let i = 0; i < key.length; i++) {
      hashVal = (hashVal * prime + key.charCodeAt(i)) % this.capacity;
    }
    return Math.abs(hashVal);
  }

  set(key: string, value: V, isCorrupted: boolean = false): number {
    const t0 = performance.now();
    const index = this.hash(key);
    const bucket = this.buckets[index];

    let found = false;
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket[i].value = value;
        bucket[i].isCorrupted = isCorrupted;
        found = true;
        break;
      }
    }

    if (!found) {
      if (bucket.length > 0) {
        this.collisionCount++;
      }
      bucket.push({ key, value, isCorrupted });
      this.count++;
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry({
      operation: "SET",
      key,
      bucketIndex: index,
      chainLength: bucket.length,
      totalCollisions: this.collisionCount,
      loadFactor: this.getLoadFactor(),
      timeTakenUs,
    });

    // Auto-rehash if load factor exceeds 0.75
    if (this.getLoadFactor() > 0.75) {
      this.rehash(this.capacity * 2 + 1);
    }

    return index;
  }

  get(key: string): { value: V | null; isCorrupted: boolean; bucketIndex: number } {
    const t0 = performance.now();
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (const entry of bucket) {
      if (entry.key === key) {
        const timeTakenUs = Math.round((performance.now() - t0) * 1000);
        this.recordTelemetry({
          operation: "GET",
          key,
          bucketIndex: index,
          chainLength: bucket.length,
          totalCollisions: this.collisionCount,
          loadFactor: this.getLoadFactor(),
          timeTakenUs,
        });
        return { value: entry.value, isCorrupted: !!entry.isCorrupted, bucketIndex: index };
      }
    }

    return { value: null, isCorrupted: false, bucketIndex: index };
  }

  resolveCorruptedKey(key: string): boolean {
    const t0 = performance.now();
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (const entry of bucket) {
      if (entry.key === key && entry.isCorrupted) {
        entry.isCorrupted = false;
        const timeTakenUs = Math.round((performance.now() - t0) * 1000);
        this.recordTelemetry({
          operation: "RESOLVE_COLLISION",
          key,
          bucketIndex: index,
          chainLength: bucket.length,
          totalCollisions: this.collisionCount,
          loadFactor: this.getLoadFactor(),
          timeTakenUs,
        });
        return true;
      }
    }
    return false;
  }

  rehash(newCapacity: number): void {
    const t0 = performance.now();
    const oldBuckets = this.buckets;
    this.capacity = newCapacity;
    this.buckets = Array.from({ length: newCapacity }, () => []);
    this.count = 0;
    this.collisionCount = 0;

    for (const bucket of oldBuckets) {
      for (const entry of bucket) {
        this.set(entry.key, entry.value, entry.isCorrupted);
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    this.recordTelemetry({
      operation: "REHASH",
      key: "ALL",
      bucketIndex: -1,
      chainLength: 0,
      totalCollisions: this.collisionCount,
      loadFactor: this.getLoadFactor(),
      timeTakenUs,
    });
  }

  getLoadFactor(): number {
    return Number((this.count / this.capacity).toFixed(3));
  }

  getCollisions(): number {
    return this.collisionCount;
  }

  size(): number {
    return this.count;
  }

  getCapacity(): number {
    return this.capacity;
  }

  getBucketData(): { index: number; entries: HashEntry<V>[] }[] {
    return this.buckets.map((entries, index) => ({ index, entries }));
  }

  getTelemetry(): HashTableTelemetry[] {
    return this.telemetryLog.slice(-10);
  }

  private recordTelemetry(record: HashTableTelemetry): void {
    this.telemetryLog.push(record);
    if (this.telemetryLog.length > 50) this.telemetryLog.shift();
  }
}
