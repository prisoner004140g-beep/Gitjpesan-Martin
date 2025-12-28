
import React from 'react';
import { NexusState, StateConfig } from '../types';
import { STATES, STATE_ICONS } from '../constants';
import { Box, Shield, Settings, Layers, Hammer } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeState: NexusState;
  viewMode: 'artifacts' | 'index' | 'tasks' | 'config';
  onViewChange: (view: 'artifacts' | 'index' | 'tasks' | 'config') => void;
  onStateChange: (state: NexusState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeState, viewMode, onViewChange, onStateChange }) => {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-slate-800 flex flex-col items-center py-6 bg-slate-900/50 backdrop-blur-md">
        <div className="mb-10 px-4 w-full flex items-center justify-center md:justify-start gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <h1 className="hidden md:block font-bold text-xl tracking-tighter text-white">NEXUS ELVISH</h1>
        </div>

        <nav className="flex-1 w-full px-3 space-y-2">
          <p className="hidden md:block text-[10px] font-bold text-slate-500 px-3 uppercase tracking-widest mb-2">Cognitive States</p>
          {(Object.values(STATES) as StateConfig[]).map((state) => (
            <button
              key={state.name}
              onClick={() => onStateChange(state.name)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                activeState === state.name 
                ? `${state.color.replace('text-', 'bg-')}/10 ${state.color} border border-white/5` 
                : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              <span className={activeState === state.name ? state.color : 'text-slate-500 group-hover:text-slate-300'}>
                {STATE_ICONS[state.name]}
              </span>
              <div className="hidden md:flex flex-col items-start leading-tight text-left">
                <span className="capitalize font-medium text-sm">{state.name}</span>
                <span className="text-[10px] opacity-60 font-mono tracking-tighter">[{state.agents}]</span>
              </div>
            </button>
          ))}

          <div className="pt-6">
             <p className="hidden md:block text-[10px] font-bold text-slate-500 px-3 uppercase tracking-widest mb-2">The Layers</p>
             <button 
               onClick={() => onViewChange('index')}
               className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${viewMode === 'index' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:bg-white/5 text-slate-400'}`}
             >
               <Layers className={`w-5 h-5 ${viewMode === 'index' ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'}`} />
               <span className="hidden md:block text-sm font-medium">The Lens (Index)</span>
             </button>
             <button 
               onClick={() => onViewChange('tasks')}
               className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${viewMode === 'tasks' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'hover:bg-white/5 text-slate-400'}`}
             >
               <Hammer className={`w-5 h-5 ${viewMode === 'tasks' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
               <span className="hidden md:block text-sm font-medium">The Hands (Tasks)</span>
             </button>
             <button 
               onClick={() => onViewChange('artifacts')}
               className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${viewMode === 'artifacts' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'hover:bg-white/5 text-slate-400'}`}
             >
               <Box className={`w-5 h-5 ${viewMode === 'artifacts' ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-400'}`} />
               <span className="hidden md:block text-sm font-medium">Artifact Storage</span>
             </button>
             <button 
               onClick={() => onViewChange('config')}
               className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${viewMode === 'config' ? 'bg-slate-100/10 text-slate-100 border border-slate-100/20' : 'hover:bg-white/5 text-slate-400'}`}
             >
               <Settings className={`w-5 h-5 ${viewMode === 'config' ? 'text-slate-100' : 'text-slate-500 group-hover:text-slate-300'}`} />
               <span className="hidden md:block text-sm font-medium">Substrate Config</span>
             </button>
          </div>
        </nav>

        <div className="w-full px-4 mt-auto">
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
             <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Retina Status</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             </div>
             <p className="text-[10px] text-slate-300 mono truncate">physics_engine::active</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-slate-950 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex-1 overflow-hidden relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};
