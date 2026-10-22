/**
 * NEXUS Search Algorithms Engine
 * Implements: Linear Search, Binary Search, Jump Search
 * In-Game: Sensor scanning, frequency triangulation, corrupted data block scavenger
 */

export interface SearchStep {
  index: number;
  value: any;
  action: "COMPARE" | "JUMP" | "MATCH" | "DISCARD";
  details: string;
}

export interface SearchResult<T> {
  algorithm: "LINEAR" | "BINARY" | "JUMP";
  target: T;
  foundIndex: number;
  comparisons: number;
  timeTakenUs: number;
  theoreticalComplexity: string;
  steps: SearchStep[];
}

export class NexusSearchEngine {
  /**
   * Linear Search - Used for unsorted raw telemetry & corrupted sectors
   * Complexity: O(n)
   */
  static linearSearch<T>(arr: T[], target: T, keyExtractor?: (item: T) => any): SearchResult<T> {
    const t0 = performance.now();
    const steps: SearchStep[] = [];
    let comparisons = 0;
    let foundIndex = -1;

    for (let i = 0; i < arr.length; i++) {
      comparisons++;
      const val = keyExtractor ? keyExtractor(arr[i]) : arr[i];
      const targetVal = keyExtractor ? keyExtractor(target) : target;

      if (val === targetVal) {
        steps.push({
          index: i,
          value: val,
          action: "MATCH",
          details: `Target match confirmed at index ${i} after ${comparisons} probes.`,
        });
        foundIndex = i;
        break;
      } else {
        steps.push({
          index: i,
          value: val,
          action: "COMPARE",
          details: `Probed index ${i} (${val}) !== target (${targetVal}).`,
        });
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      algorithm: "LINEAR",
      target,
      foundIndex,
      comparisons,
      timeTakenUs,
      theoreticalComplexity: "O(n)",
      steps,
    };
  }

  /**
   * Binary Search - Used for sorted frequency bands and encrypted quantum coordinates
   * Complexity: O(log n)
   */
  static binarySearch<T>(arr: T[], target: T, keyExtractor?: (item: T) => number): SearchResult<T> {
    const t0 = performance.now();
    const steps: SearchStep[] = [];
    let comparisons = 0;
    let foundIndex = -1;

    let left = 0;
    let right = arr.length - 1;
    const targetVal = keyExtractor ? keyExtractor(target) : (target as unknown as number);

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midVal = keyExtractor ? keyExtractor(arr[mid]) : (arr[mid] as unknown as number);
      comparisons++;

      if (midVal === targetVal) {
        steps.push({
          index: mid,
          value: midVal,
          action: "MATCH",
          details: `Target lock found at midpoint index ${mid} [${left}..${right}].`,
        });
        foundIndex = mid;
        break;
      }

      if (midVal < targetVal) {
        steps.push({
          index: mid,
          value: midVal,
          action: "DISCARD",
          details: `Midpoint index ${mid} (${midVal}) < target (${targetVal}). Discarding lower half [${left}..${mid}].`,
        });
        left = mid + 1;
      } else {
        steps.push({
          index: mid,
          value: midVal,
          action: "DISCARD",
          details: `Midpoint index ${mid} (${midVal}) > target (${targetVal}). Discarding upper half [${mid}..${right}].`,
        });
        right = mid - 1;
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      algorithm: "BINARY",
      target,
      foundIndex,
      comparisons,
      timeTakenUs,
      theoreticalComplexity: "O(log n)",
      steps,
    };
  }

  /**
   * Jump Search - Used for block-based sensor scans across large sensor arrays
   * Complexity: O(sqrt(n))
   */
  static jumpSearch<T>(arr: T[], target: T, keyExtractor?: (item: T) => number): SearchResult<T> {
    const t0 = performance.now();
    const steps: SearchStep[] = [];
    let comparisons = 0;
    let foundIndex = -1;

    const n = arr.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    const targetVal = keyExtractor ? keyExtractor(target) : (target as unknown as number);

    // Finding block where element is present
    while (arr[Math.min(step, n) - 1] !== undefined) {
      const currentEndVal = keyExtractor ? keyExtractor(arr[Math.min(step, n) - 1]) : (arr[Math.min(step, n) - 1] as unknown as number);
      comparisons++;

      steps.push({
        index: Math.min(step, n) - 1,
        value: currentEndVal,
        action: "JUMP",
        details: `Jump block scan to index ${Math.min(step, n) - 1} (${currentEndVal}).`,
      });

      if (currentEndVal >= targetVal) {
        break;
      }
      prev = step;
      step += Math.floor(Math.sqrt(n));
      if (prev >= n) break;
    }

    // Doing linear search in the identified block
    while (prev < Math.min(step, n)) {
      const val = keyExtractor ? keyExtractor(arr[prev]) : (arr[prev] as unknown as number);
      comparisons++;

      if (val === targetVal) {
        steps.push({
          index: prev,
          value: val,
          action: "MATCH",
          details: `Target lock found at index ${prev} inside jumped block.`,
        });
        foundIndex = prev;
        break;
      } else {
        steps.push({
          index: prev,
          value: val,
          action: "COMPARE",
          details: `Block linear probe at ${prev} (${val}).`,
        });
      }
      prev++;
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      algorithm: "JUMP",
      target,
      foundIndex,
      comparisons,
      timeTakenUs,
      theoreticalComplexity: "O(√n)",
      steps,
    };
  }
}
