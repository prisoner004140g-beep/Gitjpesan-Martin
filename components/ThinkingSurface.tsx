
import React, { useRef, useEffect } from 'react';
import { GraphNode, GraphEdge } from '../types';

interface ThinkingSurfaceProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  focusNodeId?: string;
}

export const ThinkingSurface: React.FC<ThinkingSurfaceProps> = ({ nodes, edges, focusNodeId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const drawHex = (x: number, y: number, size: number, color: string, alpha: number, filled = false) => {
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
      }
      ctx.closePath();
      if (filled) {
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    };

    const render = () => {
      // Ratatui Fade Effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const size = 26;
      const time = Date.now() * 0.0008;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw Isotropic Lattice (The Retina)
      for (let x = -size; x < canvas.width + size * 2; x += size * 1.5) {
        for (let y = -size; y < canvas.height + size * 2; y += size * Math.sqrt(3)) {
          const col = Math.round(x / (size * 1.5));
          const offset = (col % 2) * (size * Math.sqrt(3) / 2);
          
          const dx = x - centerX;
          const dy = (y + offset) - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Focus Warp logic
          let focalPulse = 0;
          if (focusNodeId) {
             const fNode = nodes.find(n => n.id === focusNodeId);
             if (fNode) {
                const fdx = x - fNode.x;
                const fdy = (y + offset) - fNode.y;
                const fdist = Math.sqrt(fdx * fdx + fdy * fdy);
                focalPulse = Math.max(0, 1 - fdist / 150) * 0.4;
             }
          }

          const ripple = Math.sin(time * 2 - dist * 0.015) * 0.05 + 0.05;
          const finalAlpha = Math.max(0.02, ripple + focalPulse);
          
          drawHex(x, y + offset, size, focalPulse > 0.1 ? '#10b981' : '#1e293b', finalAlpha);
        }
      }

      // Draw Edges with Flow Drips
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (fromNode && toNode) {
          ctx.lineWidth = 1;
          const isFocused = focusNodeId === fromNode.id || focusNodeId === toNode.id;
          
          const grad = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
          grad.addColorStop(0, fromNode.color);
          grad.addColorStop(1, toNode.color);
          
          ctx.strokeStyle = grad;
          ctx.globalAlpha = isFocused ? 0.6 : 0.15;
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();

          // Drips
          const progress = (time * 1.2) % 1;
          const px = fromNode.x + (toNode.x - fromNode.x) * progress;
          const py = fromNode.y + (toNode.y - fromNode.y) * progress;
          ctx.fillStyle = toNode.color;
          ctx.globalAlpha = isFocused ? 0.9 : 0.5;
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        const isFocused = focusNodeId === node.id;
        const nodePulse = 1 + Math.sin(time * 5 + node.x) * 0.12;
        
        ctx.shadowBlur = (isFocused ? 20 : 10) * nodePulse;
        ctx.shadowColor = node.color;
        ctx.fillStyle = node.color;
        
        ctx.beginPath();
        const r = (node.type === 'state' ? 6 : 4) * (isFocused ? 1.5 : 1) * nodePulse;
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
        
        // Outer hex decoration
        drawHex(node.x, node.y, r * 2.8, node.color, isFocused ? 0.4 : 0.1);
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = isFocused ? '#fff' : 'rgba(255, 255, 255, 0.5)';
        ctx.font = `${isFocused ? 'bold' : ''} 10px "JetBrains Mono"`;
        ctx.fillText(node.label.toUpperCase(), node.x + (isFocused ? 20 : 15), node.y + 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [nodes, edges, focusNodeId]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 border-t border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-4 right-4 pointer-events-none text-right">
        <h3 className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-1">Retina::Lattice_Engine</h3>
        <p className="text-[8px] text-slate-700 mono">isotropic_v0.9.4 // ratatui_buffer_sync</p>
      </div>
    </div>
  );
};
