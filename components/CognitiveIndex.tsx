
import React from 'react';
import { CHAT_INDEX, DocItem } from '../constants';
import { FolderTree, FileCode, ChevronRight, Binary, Terminal, Activity, Play } from 'lucide-react';

interface CognitiveIndexProps {
  selectedId?: number;
  onSelect: (id: number) => void;
  onExecuteVerb: (cmd: string) => void;
}

export const CognitiveIndex: React.FC<CognitiveIndexProps> = ({ selectedId, onSelect, onExecuteVerb }) => {
  return (
    <div className="h-full flex flex-col p-6 space-y-4 overflow-hidden bg-slate-950/40 backdrop-blur-xl border-r border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight mono italic">broot: /nexus/meaning</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">The Lens: Navigating the Index</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 mono bg-slate-900 px-2 py-1 rounded border border-slate-800">
          <Binary className="w-3 h-3" />
          <span>7.2kb semantic_map.json</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-sm space-y-1 custom-scrollbar">
        {CHAT_INDEX.map((item, idx) => (
          <div 
            key={item.id} 
            className={`group flex flex-col p-2 rounded-lg transition-all border ${
              selectedId === item.id 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'border-transparent hover:bg-emerald-500/5 hover:border-emerald-500/10'
            }`}
          >
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onSelect(item.id)}
            >
              <span className="text-slate-600">│</span>
              <span className="text-slate-600">{idx === CHAT_INDEX.length - 1 ? '└─' : '├─'}</span>
              <FileCode className={`w-4 h-4 ${selectedId === item.id ? 'text-emerald-400' : (idx % 2 === 0 ? 'text-emerald-500' : 'text-indigo-400')} opacity-70 group-hover:opacity-100`} />
              <span className={`${selectedId === item.id ? 'text-emerald-400 font-bold' : 'text-slate-300'} group-hover:text-emerald-400 transition-colors`}>
                {item.id.toString().padStart(2, '0')}_{item.title.toLowerCase().replace(/ /g, '_')}.elv
              </span>
              {selectedId === item.id && <Activity className="w-3 h-3 text-emerald-400 animate-pulse ml-auto" />}
            </div>

            <div className={`ml-10 transition-all overflow-hidden ${selectedId === item.id ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
                <span className="text-emerald-500/50 mr-2">#</span>
                {item.description}
              </p>
              
              {/* Active Documentation Verbs */}
              <div className="flex flex-wrap gap-2 pb-2">
                {item.verbs.map((verb, vidx) => (
                  <button
                    key={vidx}
                    onClick={() => onExecuteVerb(verb.cmd)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 hover:bg-emerald-500/20 text-[9px] font-bold text-slate-400 hover:text-emerald-400 rounded border border-slate-800 hover:border-emerald-500/30 transition-all"
                  >
                    <Play className="w-2.5 h-2.5" />
                    {verb.label.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-800/50 mt-auto">
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center gap-3 group">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-[9px] uppercase font-bold text-slate-500 mb-1">
              <span>Bridge Status: Active</span>
              <Terminal className="w-3 h-3" />
            </div>
            <p className="text-[10px] text-slate-400 truncate mono">gemini-3-flash: Indexing functional universe.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
