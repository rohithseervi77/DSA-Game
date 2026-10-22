/**
 * NEXUS Comprehensive Verification Test Suite
 * Validates all 29 DSA data structures and algorithms with concrete test assertions.
 */

import { NexusStack } from "../src/data-structures/Stack";
import { NexusQueue } from "../src/data-structures/Queue";
import { NexusCircularQueue } from "../src/data-structures/CircularQueue";
import { NexusSinglyLinkedList } from "../src/data-structures/SinglyLinkedList";
import { NexusDoublyLinkedList } from "../src/data-structures/DoublyLinkedList";
import { NexusCircularLinkedList } from "../src/data-structures/CircularLinkedList";
import { NexusBST } from "../src/data-structures/BinarySearchTree";
import { NexusAVLTree } from "../src/data-structures/AVLTree";
import { NexusHashTable } from "../src/data-structures/HashTable";
import { NexusPriorityQueue } from "../src/data-structures/PriorityQueue";
import { NexusGraph } from "../src/data-structures/Graph";
import { NexusSearchEngine } from "../src/algorithms/Searching";
import { NexusSortEngine } from "../src/algorithms/Sorting";
import { NexusGraphAlgorithms } from "../src/algorithms/GraphAlgorithms";
import { NexusHuffmanEngine } from "../src/algorithms/HuffmanCoding";
import { NexusMatrixEngine } from "../src/algorithms/MatrixAlgorithms";
import { NexusRecurrenceEngine } from "../src/algorithms/RecurrenceEngine";
import { NexusWorldGenerator } from "../src/world-generation/WorldGenerator";
import { NexusAdaptiveWorld } from "../src/game-engine/AdaptiveWorld";
import { NexusAlgorithmFusionEngine } from "../src/game-engine/AlgorithmFusion";
import { NexusAlgorithmicDNA } from "../src/player/AlgorithmicDNA";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`  ✓ ${msg}`);
}

async function runTestSuite() {
  console.log("============================================================");
  console.log("🔬 RUNNING NEXUS DSA VERIFICATION TEST SUITE (29 CONCEPTS)");
  console.log("============================================================\n");

  // 1. Stack
  console.log("[1/21] Testing NexusStack (Temporal Flux)...");
  const stack = new NexusStack<string>();
  stack.push("T1");
  stack.push("T2");
  assert(stack.peek() === "T2", "Stack peek returns top element");
  assert(stack.pop() === "T2", "Stack pop returns LIFO element");
  assert(stack.pop() === "T1", "Stack pop empties down to T1");

  // 2. Queue
  console.log("[2/21] Testing NexusQueue (Sector Transmission Relay)...");
  const queue = new NexusQueue<string>();
  queue.enqueue("MSG_1");
  queue.enqueue("MSG_2");
  assert(queue.peek() === "MSG_1", "Queue peek returns head element");
  assert(queue.dequeue() === "MSG_1", "Queue dequeue returns FIFO element");

  // 3. Circular Queue
  console.log("[3/21] Testing NexusCircularQueue (Cyclic Defense Matrix)...");
  const cQueue = new NexusCircularQueue<number>(3);
  cQueue.enqueue(10);
  cQueue.enqueue(20);
  cQueue.enqueue(30);
  assert(cQueue.isFull(), "Circular queue reports full at capacity");
  assert(cQueue.dequeue() === 10, "Dequeued front element");
  cQueue.enqueue(40);
  assert(cQueue.peekFront() === 20, "Circular buffer wrap-around head is correct");
  cQueue.rotate();
  assert(cQueue.peekFront() === 30, "Rotate cycled front element to rear");

  // 4. Singly Linked List
  console.log("[4/21] Testing NexusSinglyLinkedList (Dynamic Mission Chain)...");
  const sList = new NexusSinglyLinkedList<string>();
  sList.append("M1");
  sList.append("M2");
  sList.insertAfter((v) => v === "M1", "EMERGENCY_X");
  const arr = sList.toArray();
  assert(arr[0] === "M1" && arr[1] === "EMERGENCY_X" && arr[2] === "M2", "Emergency objective inserted mid-chain");

  // 5. Doubly Linked List
  console.log("[5/21] Testing NexusDoublyLinkedList (Neural Memory Walk)...");
  const dList = new NexusDoublyLinkedList<string>();
  dList.append("SECTOR_A");
  dList.append("SECTOR_B");
  assert(dList.getCurrent() === "SECTOR_B", "Current pointer at tail");
  assert(dList.stepBack() === "SECTOR_A", "StepBack moves to previous node");
  assert(dList.stepForward() === "SECTOR_B", "StepForward advances to next node");

  // 6. Circular Linked List
  console.log("[6/21] Testing NexusCircularLinkedList (Faction Orbit)...");
  const circList = new NexusCircularLinkedList<string>();
  circList.insert("FACTION_1");
  circList.insert("FACTION_2");
  assert(circList.advance() === "FACTION_2", "Advanced to next faction");
  assert(circList.advance() === "FACTION_1", "Circular loop wrapped back to start");

  // 7. Binary Search Tree
  console.log("[7/21] Testing NexusBST (Knowledge Archive)...");
  const bst = new NexusBST<number, string>();
  bst.insert(50, "Core Knowledge");
  bst.insert(25, "Sub-band Alpha");
  bst.insert(75, "Sub-band Beta");
  assert(bst.search(25) === "Sub-band Alpha", "BST search finds key");
  assert(bst.search(999) === null, "BST search returns null for missing key");
  const inOrder = bst.inOrderTraversal();
  assert(inOrder[0].key === 25 && inOrder[1].key === 50 && inOrder[2].key === 75, "In-order traversal is sorted");

  // 8. AVL Tree
  console.log("[8/21] Testing NexusAVLTree (Knowledge Stabilization Engine)...");
  const avl = new NexusAVLTree<number, string>();
  avl.insert(30, "A");
  avl.insert(20, "B");
  avl.insert(10, "C"); // Triggers LL rotation
  assert(avl.getTreeHeight() === 2, "AVL tree height balanced after LL rotation");
  avl.insert(40, "D");
  avl.insert(50, "E"); // Triggers RR rotation
  assert(avl.getTreeHeight() <= 3, "AVL tree auto-balanced after RR rotation");
  assert(avl.search(30) === "A", "Search in AVL finds root");

  // 9. Hash Table
  console.log("[9/21] Testing NexusHashTable (Neural Memory Vault)...");
  const ht = new NexusHashTable<string>(11);
  ht.set("KEY_01", "Cipher Alpha");
  ht.set("KEY_02", "Cipher Beta", true);
  const get1 = ht.get("KEY_01");
  assert(get1.value === "Cipher Alpha" && !get1.isCorrupted, "Hash table retrieval matches");
  const get2 = ht.get("KEY_02");
  assert(get2.isCorrupted === true, "Corrupted memory flag recognized");
  assert(ht.resolveCorruptedKey("KEY_02"), "Collision/corruption successfully resolved");

  // 10. Priority Queue (Binary Heap)
  console.log("[10/21] Testing NexusPriorityQueue (Apex Threat Interceptor)...");
  const minHeap = new NexusPriorityQueue<string>(true);
  minHeap.insert("Low Threat", 50);
  minHeap.insert("Critical Anomaly", 5);
  minHeap.insert("Medium Threat", 25);
  assert(minHeap.extract() === "Critical Anomaly", "Min-heap extracts lowest priority value first");
  assert(minHeap.extract() === "Medium Threat", "Next extracted is Medium Threat");

  // 11. Searching Engine
  console.log("[11/21] Testing Search Engine (Linear, Binary, Jump)...");
  const sortedData = [10, 25, 45, 60, 75, 90, 110, 130, 150];
  const binResult = NexusSearchEngine.binarySearch(sortedData, 75);
  assert(binResult.foundIndex === 4, "Binary Search found target index 4");
  const jumpResult = NexusSearchEngine.jumpSearch(sortedData, 110);
  assert(jumpResult.foundIndex === 6, "Jump Search found target index 6");
  const linResult = NexusSearchEngine.linearSearch([9, 2, 8, 4, 7], 8);
  assert(linResult.foundIndex === 2, "Linear Search found target index 2");

  // 12. Sorting Engine
  console.log("[12/21] Testing Sorting Engine (Insertion, Counting, Radix, Merge, Quick, Heap)...");
  const testArr = [64, 34, 25, 12, 22, 11, 90];
  const sortedExpected = [11, 12, 22, 25, 34, 64, 90];
  assert(JSON.stringify(NexusSortEngine.insertionSort(testArr).sortedArray) === JSON.stringify(sortedExpected), "Insertion Sort verified");
  assert(JSON.stringify(NexusSortEngine.countingSort(testArr).sortedArray) === JSON.stringify(sortedExpected), "Counting Sort verified");
  assert(JSON.stringify(NexusSortEngine.radixSort(testArr).sortedArray) === JSON.stringify(sortedExpected), "Radix Sort verified");
  assert(JSON.stringify(NexusSortEngine.mergeSort(testArr).sortedArray) === JSON.stringify(sortedExpected), "Merge Sort verified");
  assert(JSON.stringify(NexusSortEngine.quickSort(testArr).sortedArray) === JSON.stringify(sortedExpected), "Quick Sort verified");
  assert(JSON.stringify(NexusSortEngine.heapSort(testArr).sortedArray) === JSON.stringify(sortedExpected), "Heap Sort verified");

  // 13. Graph & BFS / DFS
  console.log("[13/21] Testing Living Graph, BFS & DFS...");
  const worldGraph = NexusWorldGenerator.createInitialWorld();
  assert(worldGraph.getAllVertices().length === 8, "Graph contains 8 sectors");
  assert(worldGraph.getAllEdges().length === 10, "Graph contains 10 conduits");

  const bfsRes = NexusGraphAlgorithms.bfs(worldGraph, "SECTOR_ALPHA_CORE", "SECTOR_OMEGA_GATE");
  assert(bfsRes.path[0] === "SECTOR_ALPHA_CORE" && bfsRes.path[bfsRes.path.length - 1] === "SECTOR_OMEGA_GATE", "BFS found path to Omega Gate");

  const dfsRes = NexusGraphAlgorithms.dfs(worldGraph, "SECTOR_ALPHA_CORE");
  assert(dfsRes.visitedOrder.length === 8, "DFS traversed all connected sectors");

  // 14. Dijkstra's Algorithm
  console.log("[14/21] Testing Dijkstra Optimal Shortest Path...");
  const dijkstraBalanced = NexusGraphAlgorithms.dijkstra(worldGraph, "SECTOR_ALPHA_CORE", "SECTOR_OMEGA_GATE", "BALANCED");
  assert(dijkstraBalanced.path.length >= 3, "Dijkstra computed multi-hop route to Omega Gate");
  assert(dijkstraBalanced.totalDistance > 0, "Dijkstra path has positive distance metric");

  // 15. MST (Prim & Kruskal)
  console.log("[15/21] Testing Prim and Kruskal Minimum Spanning Tree...");
  const kruskal = NexusGraphAlgorithms.kruskalMST(worldGraph);
  assert(kruskal.edges.length === 7, "Kruskal MST contains exactly V-1 = 7 edges");
  const prim = NexusGraphAlgorithms.primMST(worldGraph);
  assert(prim.edges.length === 7, "Prim MST contains exactly V-1 = 7 edges");

  // 16. Huffman Coding
  console.log("[16/21] Testing Huffman Coding (Quantum Comm Transceiver)...");
  const sampleMessage = "NEXUS_LIVING_ALGORITHM_TRANSMISSION";
  const huffman = NexusHuffmanEngine.encode(sampleMessage);
  assert(huffman.decodedText === sampleMessage, "Huffman round-trip decode perfectly matches original");
  assert(huffman.compressedBits < huffman.originalBits, "Huffman achieved real bit compression");

  // 17. Strassen Matrix Multiplication
  console.log("[17/21] Testing Strassen Fast Matrix Multiplication...");
  const A = [[1, 2], [3, 4]];
  const B = [[5, 6], [7, 8]];
  const strassenRes = NexusMatrixEngine.multiplyStrassen(A, B);
  // [1*5+2*7, 1*6+2*8] = [19, 22]
  // [3*5+4*7, 3*6+4*8] = [43, 50]
  assert(strassenRes.resultMatrix[0][0] === 19 && strassenRes.resultMatrix[1][1] === 50, "Strassen 2x2 matrix product matches theoretical result");

  // 18. Matrix Chain Multiplication
  console.log("[18/21] Testing Matrix Chain Multiplication (DP Pipeline)...");
  const dimensions = [10, 20, 30, 40, 30];
  const mcmRes = NexusMatrixEngine.matrixChainOrder(dimensions);
  assert(mcmRes.minScalarMultiplications === 30000, "MCM DP table found optimal 30,000 scalar operations");

  // 19. Recursion & Recurrence Master Theorem
  console.log("[19/21] Testing Recurrence Engine & Master Theorem Evaluator...");
  const masterCase1 = NexusRecurrenceEngine.evaluateMasterTheorem(4, 2, 1);
  assert(masterCase1.matchedCase === "CASE 1 (Leaves dominate)", "Master Theorem recognized Case 1 (4 > 2^1)");
  const masterCase2 = NexusRecurrenceEngine.evaluateMasterTheorem(2, 2, 1);
  assert(masterCase2.matchedCase === "CASE 2 (Equal work per level)", "Master Theorem recognized Case 2 (Merge Sort pattern)");

  // 20. Adaptive World & Fusion Engine
  console.log("[20/21] Testing Adaptive World & Fusion Engine...");
  const adaptiveWorld = new NexusAdaptiveWorld(worldGraph);
  adaptiveWorld.recordPlayerMove(15, 12, true);
  adaptiveWorld.recordSearchChoice("BINARY");
  const fusionEngine = new NexusAlgorithmFusionEngine();
  const fusionRes = fusionEngine.activateFusion("FUSION_BFS_HASH");
  assert(fusionRes.success, "Algorithm fusion successfully activated");

  // 21. Player Algorithmic DNA Profile
  console.log("[21/21] Testing Player Algorithmic DNA Profile...");
  const dna = NexusAlgorithmicDNA.computeDNA(adaptiveWorld.getPlayerVector(), 2);
  assert(dna.archetypeTitle.length > 0, "Algorithmic Archetype computed");
  console.log(`  Archetype: ${dna.archetypeBadge} ${dna.archetypeTitle}`);

  console.log("\n============================================================");
  console.log("🎉 ALL 29 DSA SYLLABUS CONCEPTS VERIFIED & 100% OPERATIONAL!");
  console.log("============================================================\n");
}

runTestSuite();
