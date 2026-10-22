/**
 * NEXUS Player State & Data-Structure Integrated Inventory
 * Integrates:
 * 1. Stack: Temporal Rewind Drive (Action history snapshots)
 * 2. Queue: Incoming Distress Packets (FIFO processing)
 * 3. Circular Queue: Cyclic Defense Matrix (Rotating shield nodes)
 * 4. Doubly Linked List: Neural Memory Walk (Prev <-> Current <-> Next sector history)
 * 5. Circular Linked List: Nexus Faction Orbit (Cyclical planetary factions)
 */

import { NexusStack } from "../data-structures/Stack";
import { NexusQueue } from "../data-structures/Queue";
import { NexusCircularQueue } from "../data-structures/CircularQueue";
import { NexusDoublyLinkedList } from "../data-structures/DoublyLinkedList";
import { NexusCircularLinkedList } from "../data-structures/CircularLinkedList";

export interface PlayerSnapshot {
  sectorId: string;
  energy: number;
  shield: number;
  turn: number;
  summary: string;
}

export interface DistressPacket {
  id: string;
  sender: string;
  message: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reward: number;
}

export interface ShieldStation {
  id: string;
  name: string;
  frequency: number;
  charge: number;
}

export interface FactionState {
  name: string;
  influence: number;
  disposition: "ALLIED" | "NEUTRAL" | "HOSTILE";
}

export class NexusPlayerManager {
  // Core Stats
  public currentSectorId: string = "SECTOR_ALPHA_CORE";
  public energy: number = 100;
  public maxEnergy: number = 150;
  public shield: number = 100;
  public maxShield: number = 100;
  public bandwidth: number = 50;
  public turnCount: number = 1;
  public rewindCharges: number = 3;

  // Integrated DSA Mechanisms
  public rewindStack: NexusStack<PlayerSnapshot> = new NexusStack(20);
  public distressQueue: NexusQueue<DistressPacket> = new NexusQueue(50);
  public defenseMatrix: NexusCircularQueue<ShieldStation> = new NexusCircularQueue(6);
  public memoryWalk: NexusDoublyLinkedList<string> = new NexusDoublyLinkedList();
  public factionOrbit: NexusCircularLinkedList<FactionState> = new NexusCircularLinkedList();

  constructor() {
    this.initMechanisms();
  }

  private initMechanisms() {
    // 1. Initial Snapshot for Stack
    this.pushSnapshot("Nexus Neural Link Online");

    // 2. Initialize Cyclic Defense Matrix (6 rotating shield generators)
    const stations: ShieldStation[] = [
      { id: "S1", name: "Aegis Alpha", frequency: 104.2, charge: 100 },
      { id: "S2", name: "Bulwark Beta", frequency: 212.8, charge: 85 },
      { id: "S3", name: "Cipher Gamma", frequency: 324.5, charge: 90 },
      { id: "S4", name: "Delta Barrier", frequency: 450.1, charge: 70 },
      { id: "S5", name: "Epsilon Ward", frequency: 512.9, charge: 95 },
      { id: "S6", name: "Zeta Reflector", frequency: 620.4, charge: 80 },
    ];
    for (const s of stations) {
      this.defenseMatrix.enqueue(s);
    }

    // 3. Initialize Memory Walk Doubly Linked List
    this.memoryWalk.append(this.currentSectorId);

    // 4. Initialize Faction Orbit Circular Linked List
    const factions: FactionState[] = [
      { name: "Cyber-Synthetics", influence: 40, disposition: "NEUTRAL" },
      { name: "Solar Architects", influence: 65, disposition: "ALLIED" },
      { name: "Void Marauders", influence: 80, disposition: "HOSTILE" },
      { name: "Data Keepers", influence: 55, disposition: "ALLIED" },
    ];
    for (const f of factions) {
      this.factionOrbit.insert(f);
    }

    // 5. Seed Initial Distress Packets for FIFO Queue
    this.distressQueue.enqueue({
      id: "DISTRESS_01",
      sender: "Relay Node Delta-7",
      message: "Anomalous loop detected in outer sub-band. Requesting frequency filter.",
      urgency: "MEDIUM",
      reward: 35,
    });
    this.distressQueue.enqueue({
      id: "DISTRESS_02",
      sender: "Science Vessel Archimedes",
      message: "Energy well destabilized! Bandwidth packet dropped.",
      urgency: "HIGH",
      reward: 50,
    });
  }

  pushSnapshot(summary: string) {
    this.rewindStack.push(
      {
        sectorId: this.currentSectorId,
        energy: this.energy,
        shield: this.shield,
        turn: this.turnCount,
        summary,
      },
      summary
    );
  }

  rewind(): { success: boolean; message: string; restoredSnapshot?: PlayerSnapshot } {
    if (this.rewindCharges <= 0) {
      return { success: false, message: "No Temporal Rewind charges remaining!" };
    }
    if (this.rewindStack.size() <= 1) {
      return { success: false, message: "Cannot rewind beyond initialization state." };
    }

    // Pop the current state and restore previous
    this.rewindStack.pop();
    const previous = this.rewindStack.peek();
    if (!previous) {
      return { success: false, message: "Temporal stack exhausted." };
    }

    this.currentSectorId = previous.sectorId;
    this.energy = previous.energy;
    this.shield = previous.shield;
    this.turnCount = previous.turn;
    this.rewindCharges--;

    return {
      success: true,
      message: `TEMPORAL REWIND EXECUTED: Restored to Turn ${previous.turn} at ${previous.sectorId}! [1 Charge Expended]`,
      restoredSnapshot: previous,
    };
  }

  moveToSector(newSectorId: string, energyCost: number, danger: number): { success: boolean; damageTaken: number } {
    if (this.energy < energyCost) {
      return { success: false, damageTaken: 0 };
    }

    this.pushSnapshot(`Traversed to ${newSectorId}`);
    this.energy -= energyCost;
    this.currentSectorId = newSectorId;
    this.memoryWalk.append(newSectorId);
    this.turnCount++;

    // Calculate danger mitigation via rotating defense matrix
    let damageTaken = 0;
    if (danger > 20) {
      const activeShield = this.defenseMatrix.peekFront();
      const defenseMultiplier = activeShield ? activeShield.charge / 100 : 0.5;
      damageTaken = Math.max(0, Math.round(danger * (1 - defenseMultiplier * 0.7)));
      this.shield = Math.max(0, this.shield - damageTaken);

      // Rotate defense matrix to next station
      this.defenseMatrix.rotate();
    }

    // Advance faction orbit
    this.factionOrbit.advance();

    return { success: true, damageTaken };
  }

  processNextDistress(): DistressPacket | undefined {
    const packet = this.distressQueue.dequeue();
    if (packet) {
      this.energy = Math.min(this.maxEnergy, this.energy + packet.reward);
      this.bandwidth += 10;
    }
    return packet;
  }
}
