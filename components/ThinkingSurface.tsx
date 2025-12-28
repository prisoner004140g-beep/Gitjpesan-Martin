
import React, { useRef, useEffect } from 'react';
import { GraphNode, GraphEdge, NexusState } from '../types';

interface Drip {
  x: number;
  y: number;
  velocity: number;
  viscosity: number;
  char: string;
  color: string;
}

interface ThinkingSurfaceProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  focusNodeId?: string;
  viscosity?: number; // System Load (0.0 to 1.0)
  aberration?: number; // Error State (0.0 to 1.0)
  onNodeClick?: (nodeId: string) => void;
}

export const ThinkingSurface: React.FC<ThinkingSurfaceProps> = ({ 
  nodes, 
  edges, 
  focusNodeId,
  viscosity = 0.1,
  aberration = 0.0,
  onNodeClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dripsRef = useRef<Drip[]>([]);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Rust Physics Constants
    const GRAVITY = 9.8;
    const TERMINAL_VELOCITY = 20.0;

    const drawHex = (x: number, y: number, size: number, color: string, alpha: number) => {
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
      }
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    };

    const spawnDrip = (width: number) => {
      if (Math.random() > viscosity) {
        dripsRef.current.push({
          x: Math.random() * width,
          y: -10,
          velocity: 0,
          viscosity: viscosity,
          char: viscosity > 0.5 ? '█' : '│',
          color: viscosity > 0.5 ? '#facc15' : '#fbbf24'
        });
      }
    };

    const updatePhysics = () => {
      dripsRef.current.forEach(drip => {
        const drag = drip.viscosity * 0.5;
        const accel = GRAVITY - (drip.velocity * drag);
        drip.velocity += accel * 0.1;
        if (drip.velocity > TERMINAL_VELOCITY) drip.velocity = TERMINAL_VELOCITY;
        drip.y += drip.velocity * 0.5;
      });
      dripsRef.current = dripsRef.current.filter(d => d.y < canvas.height + 20);
    };

    const render = (time: number) => {
      lastTimeRef.current = time;

      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gridSize = 26;
      const t = time * 0.001;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let x = -gridSize; x < canvas.width + gridSize * 2; x += gridSize * 1.5) {
        for (let y = -gridSize; y < canvas.height + gridSize * 2; y += gridSize * Math.sqrt(3)) {
          const col = Math.round(x / (gridSize * 1.5));
          const offset = (col % 2) * (gridSize * Math.sqrt(3) / 2);
          const dx = x - centerX;
          const dy = (y + offset) - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let focalPulse = 0;
          if (focusNodeId) {
             const fNode = nodes.find(n => n.id === focusNodeId);
             if (fNode) {
                const fdist = Math.sqrt(Math.pow(x - fNode.x, 2) + Math.pow(y + offset - fNode.y, 2));
                focalPulse = Math.max(0, 1 - fdist / 140) * 0.4;
             }
          }
          const ripple = Math.sin(t * 2 - dist * 0.01) * 0.05 + 0.05;
          drawHex(x, y + offset, gridSize, focalPulse > 0.1 ? '#10b981' : '#1e293b', Math.max(0.02, ripple + focalPulse));
        }
      }

      spawnDrip(canvas.width);
      updatePhysics();

      dripsRef.current.forEach(drip => {
        ctx.font = '14px "JetBrains Mono"';
        if (aberration > 0.4) {
          const offset = aberration * 6;
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = '#ef4444';
          ctx.fillText(drip.char, drip.x - offset, drip.y);
          ctx.fillStyle = '#22d3ee';
          ctx.fillText(drip.char, drip.x + offset, drip.y);
          ctx.globalAlpha = 1.0;
        }
        ctx.fillStyle = drip.color;
        ctx.fillText(drip.char, drip.x, drip.y);
      });

      edges.forEach(edge => {
        const from = nodes.find(n => n.id === edge.from);
        const to = nodes.find(n => n.id === edge.to);
        if (from && to) {
          ctx.strokeStyle = from.color;
          ctx.globalAlpha = 0.15;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      });

      nodes.forEach(node => {
        const isFocused = focusNodeId === node.id;
        ctx.fillStyle = node.color;
        ctx.shadowBlur = isFocused ? 20 : 8;
        ctx.shadowColor = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, isFocused ? 7 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = isFocused ? '#fff' : 'rgba(255,255,255,0.4)';
        ctx.font = `bold 10px "JetBrains Mono"`;
        ctx.fillText(node.label.toUpperCase(), node.x + 15, node.y + 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      nodes.forEach(node => {
        const dist = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
        if (dist < 15) {
          onNodeClick?.(node.id);
        }
      });
    };

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('click', handleClick);
    handleResize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
    };
  }, [nodes, edges, focusNodeId, viscosity, aberration, onNodeClick]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 border-t border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full cursor-pointer" />
      
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mono">LOAD:</span>
          <div className="w-32 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-amber-500 transition-all duration-700 ease-out" style={{ width: `${viscosity * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mono">ERR:</span>
          <div className="w-32 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${aberration * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none text-right">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-1 italic">The Sovereign Retina</h3>
        <p className="text-[8px] text-slate-700 mono uppercase tracking-widest">ratatui::frame_buffer_v3 // interactive</p>
      </div>
    </div>
  );
};
