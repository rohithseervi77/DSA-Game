"use client";

import React, { useState } from "react";
import { Database, X, AlertTriangle, CheckCircle, RefreshCw, Key, ShieldCheck } from "lucide-react";
import { NexusHashTable, HashEntry } from "../data-structures/HashTable";
import { sfx } from "../utils/audio";

interface MemoryVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  hashTable: NexusHashTable<string>;
  onResolveCollision: (key: string) => void;
  onRehash: () => void;
}

export const MemoryVaultModal: React.FC<MemoryVaultModalProps> = ({
  isOpen,
  onClose,
  hashTable,
  onResolveCollision,
  onRehash,
}) => {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const buckets = hashTable.getBucketData();
  const loadFactor = hashTable.getLoadFactor();
  const totalCollisions = hashTable.getCollisions();

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    sfx.playScanPing();
    // 25% chance of quantum corrupted memory insertion
    const isCorrupted = Math.random() < 0.25;
    hashTable.set(newKey.trim().toUpperCase(), newValue.trim() || "Encrypted Data Packet", isCorrupted);
    setNewKey("");
    setNewValue("");
  };

  const handleSearch = () => {
    if (!searchKey.trim()) return;
    sfx.playScanPing();
    const res = hashTable.get(searchKey.trim().toUpperCase());
    if (res.value) {
      setSearchFeedback(`Found in Bucket [${res.bucketIndex}]: ${res.value} ${res.isCorrupted ? "(⚠️ CORRUPTED)" : "(✓ STABLE)"}`);
    } else {
      setSearchFeedback(`Key '${searchKey}' not found in any vault bucket.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-2xl flex flex-col overflow-hidden border border-emerald-500/40 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/30 bg-emerald-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                NEURAL MEMORY VAULT
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-mono">
                  HASH TABLE SEPARATE CHAINING (O(1))
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Capacity: {hashTable.getCapacity()} Buckets | Load Factor: {loadFactor} | Collisions: {totalCollisions}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Input */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Insert */}
          <form onSubmit={handleInsert} className="space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-bold">STORE NEW TELEMETRY:</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="KEY (e.g. ALPHA_01)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
              />
              <input
                type="text"
                placeholder="VALUE / PAYLOAD"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold"
              >
                Hash & Store
              </button>
            </div>
          </form>

          {/* Search & Rehash */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-cyan-400 font-bold flex justify-between">
              <span>RETRIEVE BY KEY (O(1) AVERAGE):</span>
              <button
                onClick={() => {
                  sfx.playScanPing();
                  onRehash();
                }}
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Trigger Rehash
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="SEARCH KEY..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold"
              >
                Query
              </button>
            </div>
            {searchFeedback && (
              <div className="text-[11px] font-mono text-gray-300 bg-black/40 px-2 py-1 rounded">
                {searchFeedback}
              </div>
            )}
          </div>
        </div>

        {/* Bucket Array Visualization */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          <div className="text-xs font-mono text-gray-400 mb-2">
            BUCKET ARRAY (INDEX = POLYNOMIAL_HASH(KEY) % CAPACITY):
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {buckets.map(({ index, entries }) => (
              <div
                key={index}
                className={`p-2.5 rounded-lg border font-mono text-xs flex flex-col gap-1.5 transition-all ${
                  entries.length > 1
                    ? "bg-amber-950/20 border-amber-500/40"
                    : entries.length === 1
                    ? "bg-slate-900/60 border-slate-800"
                    : "bg-slate-950/40 border-slate-900 opacity-60"
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                  <span className="font-bold text-gray-300">Bucket [{index}]</span>
                  <span>{entries.length} chained entries</span>
                </div>

                {entries.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {entries.map((entry) => (
                      <div
                        key={entry.key}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] border ${
                          entry.isCorrupted
                            ? "bg-red-950/50 border-red-500/50 text-red-300"
                            : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        }`}
                      >
                        <Key className="w-3 h-3" />
                        <span className="font-bold">{entry.key}:</span>
                        <span className="text-gray-300">{entry.value}</span>

                        {entry.isCorrupted && (
                          <button
                            onClick={() => {
                              sfx.playRewind();
                              onResolveCollision(entry.key);
                            }}
                            title="Resolve collision corruption"
                            className="ml-1 px-1 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[9px] font-bold"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-600 italic">Empty Slot</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
