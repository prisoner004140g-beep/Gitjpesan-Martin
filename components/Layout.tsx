
import React from 'react';
import { NexusState, StateConfig } from '../types';
import { STATES, STATE_ICONS } from '../constants';
import { Box, Globe, Shield, Settings, Key, Layers, Hammer } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeState: NexusState;
  showIndex: boolean;
  onToggleIndex: () => void;
  onToggleTasks: () => void;
  onStateChange: (state: NexusState) => void;
  onSelectKey: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeState, showIndex, onToggleIndex, onToggleTasks, onStateChange, onSelectKey }) => {
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
              <span className={activeState === state.name ? state.color : 'text-slate-500'}>
                {STATE_ICONS[state.name]}
              </span>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="capitalize font-medium text-sm">{state.name}</span>
                <span className="text-[10px] opacity-60 font-mono tracking-tighter">[{state.agents}]</span>
              </div>
            </button>
          ))}

          <div className="pt-6">
             <p className="hidden md:block text-[10px] font-bold text-slate-500 px-3 uppercase tracking-widest mb-2">The Layers</p>
             <button 
               onClick={onToggleIndex}
               className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${showIndex ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-white/5 text-slate-400'}`}
             >
               <Layers className={`w-5 h-5 ${showIndex ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'}`} />
               <span className="hidden md:block text-sm font-medium">The Lens (Index)</span>
             </button>
             <button 
               onClick={onToggleTasks}
               className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-slate-400 group transition-all"
             >
               <Hammer className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" />
               <span className="hidden md:block text-sm font-medium">The Hands (Tasks)</span>
             </button>
             <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-slate-400 group transition-all">
               <Box className="w-5 h-5 text-slate-500 group-hover:text-purple-400" />
               <span className="hidden md:block text-sm font-medium">Artifact Storage</span>
             </button>
          </div>
        </nav>

        <div className="w-full px-3 mt-auto space-y-2">
          <button 
            onClick={onSelectKey}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 transition-all group"
          >
            <Key className="w-5 h-5" />
            <span className="hidden md:block text-sm font-medium">Bridge: API Key</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-slate-400 transition-all">
            <Settings className="w-5 h-5" />
            <span className="hidden md:block text-sm font-medium">Substrate Config</span>
          </button>
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
