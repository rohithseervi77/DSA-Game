/**
 * NEXUS Sorting Algorithms Engine
 * Implements: Insertion Sort, Counting Sort, Radix Sort, Merge Sort, Quick Sort, Heap Sort
 * All methods include execution telemetry & step tracing for Professor / Academic Reveal Mode.
 */

export interface SortStep {
  stepIndex: number;
  arraySnapshot: any[];
  highlightIndices: number[];
  description: string;
}

export interface SortResult<T> {
  algorithm: "INSERTION" | "COUNTING" | "RADIX" | "MERGE" | "QUICK" | "HEAP";
  sortedArray: T[];
  comparisons: number;
  swaps: number;
  timeTakenUs: number;
  theoreticalComplexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  steps: SortStep[];
}

export class NexusSortEngine {
  /**
   * 1. Insertion Sort - Dynamic ranking of incoming objectives & nearby threats
   * Complexity: Best O(n), Avg/Worst O(n^2), Space O(1)
   */
  static insertionSort(arr: number[]): SortResult<number> {
    const t0 = performance.now();
    const a = [...arr];
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;

    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;

      while (j >= 0) {
        comparisons++;
        if (a[j] > key) {
          a[j + 1] = a[j];
          swaps++;
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = key;

      if (steps.length < 20) {
        steps.push({
          stepIndex: i,
          arraySnapshot: [...a],
          highlightIndices: [j + 1, i],
          description: `Inserted element ${key} into sorted partition at index ${j + 1}`,
        });
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      algorithm: "INSERTION",
      sortedArray: a,
      comparisons,
      swaps,
      timeTakenUs,
      theoreticalComplexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      },
      steps,
    };
  }

  /**
   * 2. Counting Sort - Resource power tiers / energy core classification
   * Complexity: O(n + k), Space O(k)
   */
  static countingSort(arr: number[], maxVal?: number): SortResult<number> {
    const t0 = performance.now();
    const a = [...arr];
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;

    if (a.length === 0) {
      return {
        algorithm: "COUNTING",
        sortedArray: [],
        comparisons: 0,
        swaps: 0,
        timeTakenUs: 1,
        theoreticalComplexity: { best: "O(n + k)", average: "O(n + k)", worst: "O(n + k)", space: "O(k)" },
        steps: [],
      };
    }

    const max = maxVal !== undefined ? maxVal : Math.max(...a);
    const count = new Array(max + 1).fill(0);
    const output = new Array(a.length).fill(0);

    for (let i = 0; i < a.length; i++) {
      count[a[i]]++;
    }

    steps.push({
      stepIndex: 1,
      arraySnapshot: [...count],
      highlightIndices: [],
      description: `Frequencies counted across range [0..${max}]`,
    });

    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1];
    }

    for (let i = a.length - 1; i >= 0; i--) {
      output[count[a[i]] - 1] = a[i];
      count[a[i]]--;
      swaps++;
    }

    steps.push({
      stepIndex: 2,
      arraySnapshot: [...output],
      highlightIndices: [],
      description: "Array reconstructed stably using cumulative count indices",
    });

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      algorithm: "COUNTING",
      sortedArray: output,
      comparisons,
      swaps,
      timeTakenUs,
      theoreticalComplexity: {
        best: "O(n + k)",
        average: "O(n + k)",
        worst: "O(n + k)",
        space: "O(k)",
      },
      steps,
    };
  }

  /**
   * 3. Radix Sort - Encrypted cipher keys and quantum sector IDs
   * Complexity: O(d * (n + b)), Space O(n + b)
   */
  static radixSort(arr: number[]): SortResult<number> {
    const t0 = performance.now();
    let a = [...arr];
    const steps: SortStep[] = [];
    let comparisons = 0;
    let swaps = 0;

    if (a.length === 0) {
      return {
        algorithm: "RADIX",
        sortedArray: [],
        comparisons: 0,
        swaps: 0,
        timeTakenUs: 1,
        theoreticalComplexity: { best: "O(d·n)", average: "O(d·n)", worst: "O(d·n)", space: "O(n + b)" },
        steps: [],
      };
    }

    const max = Math.max(...a);

    const countingSortForRadix = (exp: number) => {
      const output = new Array(a.length).fill(0);
      const count = new Array(10).fill(0);

      for (let i = 0; i < a.length; i++) {
        const digit = Math.floor(a[i] / exp) % 10;
        count[digit]++;
      }

      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }

      for (let i = a.length - 1; i >= 0; i--) {
        const digit = Math.floor(a[i] / exp) % 10;
        output[count[digit] - 1] = a[i];
        count[digit]--;
        swaps++;
      }

      for (let i = 0; i < a.length; i++) {
        a[i] = output[i];
      }

      steps.push({
        stepIndex: exp,
        arraySnapshot: [...a],
        highlightIndices: [],
        description: `Sorted by base-10 digit place ${exp}`,
      });
    };

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      countingSortForRadix(exp);
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      algorithm: "RADIX",
      sortedArray: a,
      comparisons,
      swaps,
      timeTakenUs,
      theoreticalComplexity: {
        best: "O(d · (n + b))",
        average: "O(d · (n + b))",
        worst: "O(d · (n + b))",
        space: "O(n + b)",
      },
      steps,
    };
  }

  /**
   * 4. Merge Sort - Synchronizing multi-region sensor telemetry streams
   * Complexity: O(n log n) guaranteed, Space O(n)
   */
  static mergeSort(arr: number[]): SortResult<number> {
    const t0 = performance.now();
    let comparisons = 0;
    let swaps = 0;
    const steps: SortStep[] = [];

    const merge = (left: number[], right: number[]): number[] => {
      const result: number[] = [];
      let i = 0;
      let j = 0;

      while (i < left.length && j < right.length) {
        comparisons++;
        if (left[i] <= right[j]) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          j++;
          swaps++;
        }
      }

      while (i < left.length) {
        result.push(left[i]);
        i++;
      }
      while (j < right.length) {
        result.push(right[j]);
        j++;
      }

      return result;
    };

    const sort = (subArr: number[]): number[] => {
      if (subArr.length <= 1) return subArr;
      const mid = Math.floor(subArr.length / 2);
      const left = sort(subArr.slice(0, mid));
      const right = sort(subArr.slice(mid));
      const merged = merge(left, right);

      if (steps.length < 20) {
        steps.push({
          stepIndex: steps.length + 1,
          arraySnapshot: [...merged],
          highlightIndices: [mid],
          description: `Merged sub-arrays [${left.length} items] and [${right.length} items]`,
        });
      }
      return merged;
    };

    const sortedArray = sort([...arr]);
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);

    return {
      algorithm: "MERGE",
      sortedArray,
      comparisons,
      swaps,
      timeTakenUs,
      theoreticalComplexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)",
      },
      steps,
    };
  }

  /**
   * 5. Quick Sort - Rapid threat ranking and distress mission partitioning
   * Complexity: Avg O(n log n), Worst O(n^2), Space O(log n)
   */
  static quickSort(arr: number[]): SortResult<number> {
    const t0 = performance.now();
    const a = [...arr];
    let comparisons = 0;
    let swaps = 0;
    const steps: SortStep[] = [];

    const partition = (low: number, high: number): number => {
      const pivot = a[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        if (a[j] < pivot) {
          i++;
          const tmp = a[i];
          a[i] = a[j];
          a[j] = tmp;
          swaps++;
        }
      }

      const tmp = a[i + 1];
      a[i + 1] = a[high];
      a[high] = tmp;
      swaps++;

      if (steps.length < 20) {
        steps.push({
          stepIndex: steps.length + 1,
          arraySnapshot: [...a],
          highlightIndices: [i + 1],
          description: `Pivot element ${pivot} locked at index ${i + 1}`,
        });
      }

      return i + 1;
    };

    const sort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      }
    };

    sort(0, a.length - 1);
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);

    return {
      algorithm: "QUICK",
      sortedArray: a,
      comparisons,
      swaps,
      timeTakenUs,
      theoreticalComplexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
        space: "O(log n)",
      },
      steps,
    };
  }

  /**
   * 6. Heap Sort - Apex Priority scheduling and max threat sort
   * Complexity: O(n log n), Space O(1) in-place
   */
  static heapSort(arr: number[]): SortResult<number> {
    const t0 = performance.now();
    const a = [...arr];
    let comparisons = 0;
    let swaps = 0;
    const steps: SortStep[] = [];
    const n = a.length;

    const heapify = (size: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < size) {
        comparisons++;
        if (a[left] > a[largest]) largest = left;
      }
      if (right < size) {
        comparisons++;
        if (a[right] > a[largest]) largest = right;
      }

      if (largest !== i) {
        const swap = a[i];
        a[i] = a[largest];
        a[largest] = swap;
        swaps++;
        heapify(size, largest);
      }
    };

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      const temp = a[0];
      a[0] = a[i];
      a[i] = temp;
      swaps++;

      heapify(i, 0);

      if (steps.length < 20) {
        steps.push({
          stepIndex: steps.length + 1,
          arraySnapshot: [...a],
          highlightIndices: [0, i],
          description: `Extracted max root to sorted suffix at index ${i}`,
        });
      }
    }

    const timeTakenUs = Math.round((performance.now() - t0) * 1000);
    return {
      algorithm: "HEAP",
      sortedArray: a,
      comparisons,
      swaps,
      timeTakenUs,
      theoreticalComplexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(1)",
      },
      steps,
    };
  }
}
