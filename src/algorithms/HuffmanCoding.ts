/**
 * NEXUS Advanced Algorithm: Huffman Coding
 * Powers: Quantum Comm Transceiver, Signal Compression under Bandwidth Saturation
 * Theoretical Complexity: Build Tree O(k log k) where k is unique symbols, Encode/Decode O(N)
 */

import { NexusPriorityQueue } from "../data-structures/PriorityQueue";

export interface HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

export interface HuffmanResult {
  originalText: string;
  encodedBitString: string;
  decodedText: string;
  frequencies: Record<string, number>;
  codeTable: Record<string, string>;
  originalBits: number;
  compressedBits: number;
  compressionRatioPercent: number;
  timeTakenUs: number;
}

export class NexusHuffmanEngine {
  static encode(text: string): HuffmanResult {
    const t0 = performance.now();
    if (!text || text.length === 0) {
      return {
        originalText: "",
        encodedBitString: "",
        decodedText: "",
        frequencies: {},
        codeTable: {},
        originalBits: 0,
        compressedBits: 0,
        compressionRatioPercent: 0,
        timeTakenUs: 1,
      };
    }

    // 1. Calculate symbol frequencies
    const freqMap: Record<string, number> = {};
    for (const char of text) {
      freqMap[char] = (freqMap[char] || 0) + 1;
    }

    // 2. Build Huffman Tree using Min-Priority Queue
    const pq = new NexusPriorityQueue<HuffmanNode>(true);
    for (const [char, freq] of Object.entries(freqMap)) {
      pq.insert({ char, freq, left: null, right: null }, freq);
    }

    if (pq.size() === 1) {
      // Single unique character edge case
      const single = pq.extract()!;
      const root: HuffmanNode = {
        char: null,
        freq: single.freq,
        left: single,
        right: null,
      };
      pq.insert(root, root.freq);
    } else {
      while (pq.size() > 1) {
        const left = pq.extract()!;
        const right = pq.extract()!;
        const parent: HuffmanNode = {
          char: null,
          freq: left.freq + right.freq,
          left,
          right,
        };
        pq.insert(parent, parent.freq);
      }
    }

    const root = pq.extract()!;

    // 3. Generate prefix code table
    const codeTable: Record<string, string> = {};
    const buildCodes = (node: HuffmanNode | null, currentCode: string) => {
      if (!node) return;
      if (node.char !== null) {
        codeTable[node.char] = currentCode || "0";
        return;
      }
      buildCodes(node.left, currentCode + "0");
      buildCodes(node.right, currentCode + "1");
    };
    buildCodes(root, "");

    // 4. Encode message into bit string
    let encodedBitString = "";
    for (const char of text) {
      encodedBitString += codeTable[char];
    }

    // 5. Decode back to verify lossless roundtrip
    let decodedText = "";
    let curr = root;
    for (let i = 0; i < encodedBitString.length; i++) {
      const bit = encodedBitString[i];
      curr = bit === "0" ? curr.left! : curr.right!;
      if (curr.char !== null) {
        decodedText += curr.char;
        curr = root;
      }
    }

    const originalBits = text.length * 8;
    const compressedBits = encodedBitString.length;
    const compressionRatioPercent = originalBits > 0 ? Number((((originalBits - compressedBits) / originalBits) * 100).toFixed(1)) : 0;
    const timeTakenUs = Math.round((performance.now() - t0) * 1000);

    return {
      originalText: text,
      encodedBitString,
      decodedText,
      frequencies: freqMap,
      codeTable,
      originalBits,
      compressedBits,
      compressionRatioPercent,
      timeTakenUs,
    };
  }
}
