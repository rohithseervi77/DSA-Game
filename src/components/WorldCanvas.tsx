"use client";

import React, { useRef, useEffect, useState } from "react";
import { SectorNode, ConduitEdge } from "../data-structures/Graph";
import { sfx } from "../utils/audio";

interface WorldCanvasProps {
  sectors: SectorNode[];
  edges: ConduitEdge[];
  currentSectorId: string;
  activePath?: string[];
  mstEdges?: ConduitEdge[];
  onSelectSector: (sector: SectorNode) => void;
  onNavigateSector: (targetSectorId: string) => void;
}

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  sectors,
  edges,
  currentSectorId,
  activePath = [],
  mstEdges = [],
  onSelectSector,
  onNavigateSector,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredSector, setHoveredSector] = useState<SectorNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.025;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with subtle dark trail
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      // Draw cyber background grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.035)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const getCoords = (sector: SectorNode) => ({
        x: (sector.x / 100) * width,
        y: (sector.y / 100) * height,
      });

      const sectorMap = new Map<string, SectorNode>();
      sectors.forEach((s) => sectorMap.set(s.id, s));

      // 1. Draw Conduits / Edges
      edges.forEach((edge) => {
        const src = sectorMap.get(edge.source);
        const tgt = sectorMap.get(edge.target);
        if (!src || !tgt) return;

        const p1 = getCoords(src);
        const p2 = getCoords(tgt);

        const isInActivePath =
          activePath.length >= 2 &&
          activePath.some((id, idx) => {
            if (idx === activePath.length - 1) return false;
            const next = activePath[idx + 1];
            return (edge.source === id && edge.target === next) || (edge.target === id && edge.source === next);
          });

        const isInMST = mstEdges.some(
          (m) => (m.source === edge.source && m.target === edge.target) || (m.source === edge.target && m.target === edge.source)
        );

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (edge.isSevered) {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (isInActivePath) {
          ctx.strokeStyle = "#f59e0b"; // Neon amber for active navigation route
          ctx.lineWidth = 4;
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else if (isInMST) {
          ctx.strokeStyle = "#10b981"; // Neon emerald for reconstructed MST
          ctx.lineWidth = 3;
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = "rgba(0, 240, 255, 0.22)";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Traveling quantum pulse particle along edge
          const pulseOffset = (time * 0.8 + (p1.x % 10)) % 1;
          const px = p1.x + (p2.x - p1.x) * pulseOffset;
          const py = p1.y + (p2.y - p1.y) * pulseOffset;

          ctx.fillStyle = "rgba(0, 240, 255, 0.75)";
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 2. Draw Sectors / Vertices
      sectors.forEach((sector) => {
        const { x, y } = getCoords(sector);
        const isCurrent = sector.id === currentSectorId;
        const isHovered = hoveredSector?.id === sector.id;

        // Radius
        const baseRadius = isCurrent ? 18 : 13;

        // Pulsing outer halo
        ctx.beginPath();
        const pulse = Math.sin(time * 3 + sector.x) * 4;
        ctx.arc(x, y, baseRadius + pulse + (isCurrent ? 6 : 2), 0, Math.PI * 2);
        if (isCurrent) {
          ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (sector.isCorrupted) {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Sector body
        ctx.beginPath();
        ctx.arc(x, y, baseRadius, 0, Math.PI * 2);

        // Fill color based on type
        if (isCurrent) {
          ctx.fillStyle = "#00f0ff";
          ctx.shadowColor = "#00f0ff";
          ctx.shadowBlur = 20;
        } else if (sector.isCorrupted) {
          ctx.fillStyle = "#ef4444";
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 14;
        } else if (sector.type === "HUB") {
          ctx.fillStyle = "#0ea5e9";
          ctx.shadowColor = "#0ea5e9";
          ctx.shadowBlur = 10;
        } else if (sector.type === "RESEARCH_LAB") {
          ctx.fillStyle = "#8b5cf6";
          ctx.shadowColor = "#8b5cf6";
          ctx.shadowBlur = 10;
        } else if (sector.type === "DEFENSE_TOWER") {
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = "#3b82f6";
          ctx.shadowColor = "#3b82f6";
          ctx.shadowBlur = 8;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner core dot
        ctx.beginPath();
        ctx.arc(x, y, isCurrent ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Sector Label
        ctx.font = isCurrent ? "bold 12px sans-serif" : "11px sans-serif";
        ctx.fillStyle = isCurrent ? "#00f0ff" : isHovered ? "#ffffff" : "#94a3b8";
        ctx.textAlign = "center";
        ctx.fillText(sector.name, x, y + baseRadius + 15);

        // Subtext / Threat indicator
        ctx.font = "9px monospace";
        ctx.fillStyle = sector.threatLevel > 50 ? "#ef4444" : "#64748b";
        ctx.fillText(`THREAT: ${sector.threatLevel}%`, x, y + baseRadius + 27);
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [sectors, edges, currentSectorId, activePath, mstEdges, hoveredSector]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.parentElement?.getBoundingClientRect();
      if (rect) {
        canvasRef.current.width = rect.width;
        canvasRef.current.height = Math.max(500, rect.height);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = sectors.find((s) => {
      const sx = (s.x / 100) * canvas.width;
      const sy = (s.y / 100) * canvas.height;
      const dist = Math.hypot(mx - sx, my - sy);
      return dist <= 24;
    });

    setHoveredSector(hit || null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredSector) {
      sfx.playScanPing();
      onSelectSector(hoveredSector);
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden glass-panel border border-cyan-500/30">
      <canvas
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Hover Tooltip Overlay */}
      {hoveredSector && (
        <div
          className="absolute z-20 pointer-events-none glass-panel px-3 py-2 rounded-lg text-xs border border-cyan-500/50 shadow-xl"
          style={{
            left: Math.min(window.innerWidth - 220, Math.max(10, ((hoveredSector.x / 100) * (canvasRef.current?.width || 600)) + 15)),
            top: Math.max(10, ((hoveredSector.y / 100) * (canvasRef.current?.height || 500)) - 30),
          }}
        >
          <div className="font-bold text-cyan-400">{hoveredSector.name}</div>
          <div className="text-gray-300 text-[10px]">{hoveredSector.description.slice(0, 65)}...</div>
          <div className="flex gap-3 mt-1 text-[10px] font-mono">
            <span className="text-amber-400">Yield: +{hoveredSector.energyYield} Energy</span>
            <span className={hoveredSector.threatLevel > 50 ? "text-red-400" : "text-emerald-400"}>
              Danger: {hoveredSector.threatLevel}%
            </span>
          </div>
          {hoveredSector.id !== currentSectorId && (
            <div className="mt-1 text-cyan-300 font-semibold text-[10px]">Click to inspect / plot route</div>
          )}
        </div>
      )}

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 glass-panel px-3 py-1.5 rounded-lg flex items-center gap-4 text-[10px] text-gray-400 border border-slate-700 pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" /> You (Current)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Research / AVL
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Corrupted Cache
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-amber-400" /> Dijkstra Path
        </span>
      </div>
    </div>
  );
};
