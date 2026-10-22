# NEXUS: The Living Algorithm
### *An Adaptive, Procedurally Evolving Cybernetic Game Powered by 29 Core Data Structures & Algorithms*

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![DSA Core](https://img.shields.io/badge/DSA_Coverage-29%2F29_Concepts-10b981?style=for-the-badge)](./src/academic/SyllabusRegistry.ts)

---

## 🌌 Project Overview

**NEXUS: The Living Algorithm** is an advanced university final DSA project designed as a playable, immersive sci-fi strategy game. 

### The Core Architectural Thesis:
> **The player is never asked to solve a generic DSA quiz.**  
> Instead, **the player lives inside a dynamic digital universe entirely executed and governed by Data Structures and Algorithms.**

When a player jumps across sectors, navigates conduits, recovers corrupted caches, or rewinds their mistakes, **raw, uncompromised algorithms are executing in real time**. 

With a single click of the **"Professor Demo"** or **"Academic Mode"** button, the split-screen HUD exposes the live data structure state, memory pointers, rotation traces, and microsecond Big-O benchmarks for university viva evaluation.

---

## 🏛️ Comprehensive Syllabus Mapping (All 29 DSA Topics)

Every concept in your university DSA syllabus has an authentic, concrete implementation:

| # | DSA Syllabus Topic | In-Game Feature / Mechanism | Concrete Internal Data Structure / Algorithm | Time Complexity | Space Complexity |
|---|---|---|---|---|---|
| **1** | **Stack** | **Temporal Flux (Rewind Drive)** | `NexusStack<PlayerSnapshot>` storing state snapshots | $O(1)$ push / pop | $O(k)$ depth |
| **2** | **Queue** | **Sector Transmission Relay** | `NexusQueue<DistressPacket>` buffering asynchronous packets | $O(1)$ enqueue / dequeue | $O(N)$ buffer |
| **3** | **Circular Queue** | **Cyclic Defense Matrix** | `NexusCircularQueue<ShieldStation>` with modulo pointer rotation | $O(1)$ rotate & peek | $O(\text{cap})$ fixed |
| **4** | **Singly Linked List** | **Dynamic Mission Chain** | `NexusSinglyLinkedList<Mission>` supporting mid-chain emergency inserts | $O(1)$ insert with pointer | $O(N)$ nodes |
| **5** | **Doubly Linked List** | **Neural Memory Walk** | `NexusDoublyLinkedList<string>` with `prev` & `next` history pointers | $O(1)$ bidirectional step | $O(N)$ history |
| **6** | **Circular Linked List** | **Nexus Faction Orbit** | `NexusCircularLinkedList<FactionState>` with closed loop ring | $O(1)$ pointer advance | $O(F)$ factions |
| **7** | **Recursion** | **Fractal Sub-Sector Collapse** | Recursive quad-tree dungeon room subdivision | $O(n)$ recursive divide | $O(\text{depth})$ stack |
| **8** | **Recurrence Relations** | **Adaptive Threat Synthesizer** | Master Theorem evaluator solving $T(n) = aT(n/b) + \Theta(n^k)$ | $O(1)$ closed form | $O(1)$ |
| **9** | **Asymptotic Analysis** | **NEXUS Efficiency Engine** | Real-time microsecond ($\mu s$) Big-O benchmark profiler | Live telemetry | $O(1)$ |
| **10** | **Binary Search** | **Frequency Grid Triangulation** | Logarithmic search dividing sorted frequency interval by half | $O(\log n)$ | $O(1)$ |
| **11** | **Jump Search** | **Sub-Band Wave Scanner** | Block jumping ($\sqrt{n}$) followed by linear block probe | $O(\sqrt{n})$ | $O(1)$ |
| **12** | **Linear Search** | **Corrupted Sector Scavenger** | Sequential sweep through unsorted corrupted data blocks | $O(n)$ | $O(1)$ |
| **13** | **Insertion Sort** | **Live Threat Prioritizer** | Online insertion sorting of incoming sector threats in real-time | Best $O(n)$, Avg $O(n^2)$ | $O(1)$ |
| **14** | **Counting Sort** | **Energy Core Sorter** | Non-comparative frequency-based sorting of bounded power tiers (0..50) | $O(n + k)$ | $O(k)$ |
| **15** | **Radix Sort** | **Quantum Encryption Cipher Key Sort** | Multi-pass LSD digit bucket sorting for large alphanumeric tokens | $O(d \cdot (n + b))$ | $O(n + b)$ |
| **16** | **Merge Sort** | **Sector Telemetry Consolidation** | Divide-and-conquer stable merging of multi-region telemetry | $O(n \log n)$ guaranteed | $O(n)$ |
| **17** | **Quick Sort** | **Emergency Distress Sort** | In-place partition sorting of global anomaly levels | Avg $O(n \log n)$, Worst $O(n^2)$ | $O(\log n)$ |
| **18** | **Heap / Priority Queue** | **Apex Threat Interceptor** | Binary Max/Min-Heap prioritizing urgent events & Dijkstra extraction | $O(\log n)$ extract/insert | $O(1)$ in-place |
| **19** | **Hash Table** | **Neural Memory Vault** | Polynomial rolling hash with separate chaining & collision resolution | Avg $O(1)$, Worst $O(n)$ | $O(m + n)$ |
| **20** | **Binary Search Tree** | **Knowledge Archive Tree** | Ordered key-value node hierarchy with in-order traversal export | Avg $O(\log n)$, Worst $O(n)$ | $O(n)$ |
| **21** | **AVL Tree** | **Knowledge Stabilization Engine** | Self-balancing BST with automatic LL, RR, LR, RL rotations | Strict $O(\log n)$ guaranteed | $O(n)$ |
| **22** | **Graph (Adjacency List)** | **NEXUS Living World Map** | Weighted, dynamic graph (`NexusGraph`) storing sectors and conduits | $O(1)$ add, $O(\text{deg})$ query | $O(V + E)$ |
| **23** | **BFS** | **Sub-space Signal Pulse** | Level-order queue traversal finding minimum hops to objectives | $O(V + E)$ | $O(V)$ |
| **24** | **DFS** | **Sub-core Deep Probe** | Deep recursive stack traversal discovering hidden anomalies | $O(V + E)$ | $O(V)$ |
| **25** | **Dijkstra's Algorithm** | **Dynamic Conduction Router** | Min-Heap Dijkstra calculating optimal path balancing Distance vs Danger | $O((V + E) \log V)$ | $O(V)$ |
| **26** | **MST (Prim & Kruskal)** | **Network Rebuild Grid** | Minimum Spanning Tree reconstruction of damaged planetary conduits | $O(E \log V)$ / $O(E \log E)$ | $O(V + E)$ |
| **27** | **Huffman Coding** | **Quantum Comm Transceiver** | Optimal prefix frequency tree encoding/decoding messages under channel limits | $O(k \log k)$ build | $O(k)$ |
| **28** | **Strassen Matrix Mult.** | **Quantum Core Overdrive Simulation** | Fast divide-and-conquer 7-multiplication block matrix product | $O(n^{\log_2 7}) \approx O(n^{2.807})$ | $O(n^2)$ |
| **29** | **Matrix Chain Mult.** | **Pipeline Optimization Engine** | DP table optimization determining optimal parenthesization of data filters | $O(n^3)$ DP table | $O(n^2)$ |

---

## 🌟 Key Innovations & Novelties

### 1. Adaptive Algorithmic World
The world state maintains a hidden vector:
$$\mathbf{W} = \langle \text{threat\_index}, \text{graph\_entropy}, \text{scarcity}, \text{greed\_ratio}, \text{rewind\_rate} \rangle$$
- **Anti-Greed Dynamic Balancing**: If the player exclusively takes cheap greedy routes, the world creates bottlenecks and spikes danger on short edges.
- **Deep Exploration Rewards**: Players using DFS-style deep probing discover lateral quantum rifts in outer sectors.
- **Dynamic Conduit Severing**: Seismic algorithmic mutations periodically sever conduits, requiring real-time Dijkstra repathing or MST power grid rebuilds.

### 2. Algorithm Fusion
Players unlock and synthesize algorithmic abilities inside the **Fusion Chamber**:
- `BFS + Hashing`: Instant perimeter scan with $O(1)$ vault indexation.
- `DFS + Stack`: Deep infiltration with multi-step chronological rewind safety nets.
- `Dijkstra + Priority Queue`: Real-time adaptive route repathing when conduits collapse.
- `MST + Huffman`: Unified infrastructure repair with compressed control packets.
- `AVL + Counting Sort`: Perfectly balanced multi-tier resource distribution tree.

### 3. Player Algorithmic DNA
Tracks how the player naturally approaches problems:
- **Search Efficiency**: Binary Search vs Linear Search ratio.
- **Traverser Archetype**: BFS Broad Explorer vs DFS Deep Diver.
- **Optimization Ratio**: Dijkstra minimal distance vs danger avoidance.
- **Archetypes**: *"Quantum Architect"*, *"Deep Infiltrator"*, *"Entropy Stabilizer"*, or *"Asymptotic Strategist"*.

---

## 🎓 Professor Demonstration Mode (Viva Suite)

During your presentation or university viva, click the glowing **"PROFESSOR DEMO"** button in the header.

### What it shows:
1. **Split-Screen Interactive Suite**: Live world execution on the left, step-by-step algorithmic state trace on the right.
2. **Step-by-Step Traversal Inspector**: Inspect Priority Queue extractions in Dijkstra, MST edge additions, AVL rotation triggers (LL/RR/LR/RL), and Huffman prefix tree branches.
3. **Complexity Counters**: Microsecond execution times ($\mu s$) side-by-side with theoretical Big-O bounds.
4. **Viva Defense Talking Points**: Direct, formal explanations ready to read or explain to evaluators.

---

## 🚀 Installation & Local Run

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 10+

### Setup Commands
```bash
# 1. Clone repository
git clone <YOUR_REPO_URL>
cd "DSA GAMR"

# 2. Install dependencies
npm install

# 3. Run automated verification test suite (Validates all 29 DSA concepts)
npm test

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Modular Architecture

```
src/
├── academic/
│   └── SyllabusRegistry.ts       # Detailed registry of all 29 concepts with viva talking points
├── algorithms/
│   ├── GraphAlgorithms.ts        # BFS, DFS, Dijkstra, Prim MST, Kruskal MST (DSU)
│   ├── HuffmanCoding.ts          # Prefix frequency tree, binary bitstream encoder/decoder
│   ├── MatrixAlgorithms.ts       # Strassen fast multiplication & Matrix Chain Mult (DP)
│   ├── RecurrenceEngine.ts       # Master Theorem solver & fractal dungeon generator
│   ├── Searching.ts              # Linear Search, Binary Search, Jump Search
│   └── Sorting.ts                # Insertion, Counting, Radix, Merge, Quick, Heap Sort
├── components/
│   ├── AlgorithmicDNAModal.tsx   # Player radar profile & archetype modal
│   ├── CyberHUD.tsx              # Glassmorphic cyber top-bar with resource meters
│   ├── FusionLabModal.tsx        # Algorithm fusion & mutation chamber
│   ├── KnowledgeTreeModal.tsx    # BST & AVL Tree visualizer with rotation log
│   ├── MemoryVaultModal.tsx      # Hash Table separate chaining visualizer
│   ├── MissionTerminal.tsx       # Dynamic mission chain & navigation router
│   ├── ProfessorDemoModal.tsx    # Split-screen live viva presentation suite
│   └── WorldCanvas.tsx           # Interactive canvas graph renderer with quantum pulses
├── data-structures/
│   ├── AVLTree.ts                # Self-balancing AVL tree (LL, RR, LR, RL rotations)
│   ├── BinarySearchTree.ts       # Standard BST with in-order traversal
│   ├── CircularLinkedList.ts     # Faction orbit cycle
│   ├── CircularQueue.ts          # Cyclic defense matrix (ring buffer)
│   ├── DoublyLinkedList.ts       # Neural memory walk (prev <-> current <-> next)
│   ├── Graph.ts                  # Living graph (adjacency list with dynamic weights)
│   ├── HashTable.ts              # Hash table with separate chaining & collision resolution
│   ├── PriorityQueue.ts          # Binary Min/Max-Heap
│   ├── Queue.ts                  # FIFO queue
│   ├── SinglyLinkedList.ts       # Mission chain with mid-chain insertion
│   └── Stack.ts                  # LIFO stack for temporal rewind snapshots
├── game-engine/
│   ├── AdaptiveWorld.ts          # Learning world engine & dynamic difficulty scaling
│   └── AlgorithmFusion.ts        # Algorithm fusion formulas & mutation crises
├── missions/
│   └── MissionManager.ts         # Mission chain manager
├── player/
│   ├── AlgorithmicDNA.ts         # Algorithmic personality DNA calculator
│   └── PlayerState.ts            # Player inventory & state coordinator
└── utils/
    └── audio.ts                  # Web Audio API procedural cyberpunk SFX synthesizer
```

---

## 🧪 Automated Test Suite Output

Run `npm test` anytime to verify all 29 modules:
```
============================================================
🔬 RUNNING NEXUS DSA VERIFICATION TEST SUITE (29 CONCEPTS)
============================================================
[1/21] Testing NexusStack (Temporal Flux)...
  ✓ Stack peek returns top element
  ✓ Stack pop returns LIFO element
  ✓ Stack pop empties down to T1
...
[14/21] Testing Dijkstra Optimal Shortest Path...
  ✓ Dijkstra computed multi-hop route to Omega Gate
  ✓ Dijkstra path has positive distance metric
[15/21] Testing Prim and Kruskal Minimum Spanning Tree...
  ✓ Kruskal MST contains exactly V-1 = 7 edges
  ✓ Prim MST contains exactly V-1 = 7 edges
...
[21/21] Testing Player Algorithmic DNA Profile...
  ✓ Algorithmic Archetype computed: 💠 Quantum Architect (Dijkstra-AVL Dominant)
============================================================
🎉 ALL 29 DSA SYLLABUS CONCEPTS VERIFIED & 100% OPERATIONAL!
============================================================
```

---

## 👩‍💻 Author & Credits
- **Developer**: Arshika Chhabra
- **Project**: University Final DSA Capstone Project
- **System**: NEXUS: The Living Algorithm
