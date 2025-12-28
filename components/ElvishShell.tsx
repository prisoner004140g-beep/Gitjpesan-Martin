
import React, { useState, useRef, useEffect } from 'react';
import { ElvishValue, NexusState } from '../types';
import { Terminal as TerminalIcon, ChevronRight, Hash, Mic, MicOff, Volume2, ArrowRight, Code, Play, CheckCircle2 } from 'lucide-react';

interface ElvishShellProps {
  logs: ElvishValue[];
  activeState: NexusState;
  isLive: boolean;
  liveTranscription: string;
  executingTask?: string;
  onCommand: (cmd: string) => void;
  onToggleLive: () => void;
}

export const ElvishShell: React.FC<ElvishShellProps> = ({ logs, activeState, isLive, liveTranscription, executingTask, onCommand, onToggleLive }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input);
    setInput('');
  };

  const renderContent = (val: ElvishValue) => {
    if (val.type === 'map') {
      return (
        <div className="grid grid-cols-2 gap-2 mt-1 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
          {Object.entries(val.content).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-cyan-500 font-bold">&{k}=</span>
              <span className="text-slate-300 truncate">{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }
    if (val.type === 'list') {
      return (
        <div className="flex flex-wrap gap-2 mt-1">
          {val.content.map((item: any, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 text-xs">
              {String(item)}
            </span>
          ))}
        </div>
      );
    }
    if (val.type === 'grounding') {
      return (
        <div className="mt-2 space-y-2">
          <p className="text-slate-300 leading-relaxed">{val.content.text}</p>
          <div className="flex flex-wrap gap-2">
            {val.content.sources.map((s: any, i: number) => (
              <a 
                key={i} 
                href={s.uri} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline border border-cyan-400/20 px-2 py-0.5 rounded bg-cyan-400/5"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      );
    }
    if (val.type === 'agent-proposal') {
      return (
        <div className="mt-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 text-indigo-400">
             <ArrowRight className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-wider">The Brain: State Transition Proposal</span>
          </div>
          <p className="text-slate-300 text-sm italic">"{val.content.reason}"</p>
          <div className="flex items-center justify-between gap-4">
            <code className="flex-1 bg-slate-950 px-3 py-1.5 rounded text-cyan-400 text-[11px] border border-white/5 mono">
              enter {val.content.targetState}
            </code>
            <button 
              onClick={() => onCommand(`enter ${val.content.targetState}`)}
              className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <Play className="w-3 h-3" />
              EXECUTE JUST:TASK
            </button>
          </div>
        </div>
      );
    }
    if (val.type === 'logic-proposal') {
      return (
        <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 text-emerald-400">
             <Code className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-wider">The Brain: Functional Logic Proposal</span>
          </div>
          <p className="text-slate-300 text-sm italic">"{val.content.intent}"</p>
          <div className="space-y-2">
            <pre className="bg-slate-950 p-3 rounded-lg text-emerald-400 text-[11px] border border-white/5 overflow-x-auto mono max-h-32">
              {val.content.logic}
            </pre>
            <div className="flex justify-end">
              <button 
                onClick={() => onCommand(val.content.logic)}
                className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                <Play className="w-3 h-3" />
                EVALUATE JUST:RUN
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (val.type === 'system') {
      return (
        <div className="flex items-center gap-2 text-emerald-500 mt-1 font-bold">
          <CheckCircle2 className="w-3 h-3" />
          <span>» {val.content}</span>
        </div>
      );
    }
    return <p className="text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed">{val.content}</p>;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/50 backdrop-blur-sm border-l border-slate-800">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Cognitive REPL (Brain)</span>
        </div>
        <div className="flex items-center gap-4">
           {isLive && (
             <div className="flex items-center gap-2 animate-pulse">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
               <span className="text-[9px] text-red-500 font-bold uppercase mono">Agent Stream</span>
             </div>
           )}
           <span className="text-[10px] text-slate-500 font-mono">elvish::v0.2</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 mono text-[13px] scroll-smooth">
        {logs.map((log, i) => (
          <div key={i} className="group animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-center gap-2 mb-1 text-slate-500 text-[10px] uppercase tracking-tighter">
              <span className="font-bold opacity-40">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className="opacity-20">/</span>
              <span className="text-emerald-500/60">{activeState}</span>
            </div>
            {renderContent(log)}
          </div>
        ))}
        
        {executingTask && (
          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg animate-pulse flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <div className="flex-1">
              <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1 tracking-widest">just: executing</p>
              <p className="text-xs text-slate-400 italic">"{executingTask}"</p>
            </div>
          </div>
        )}

        {isLive && liveTranscription && (
          <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800 animate-pulse border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase mb-2 font-bold tracking-widest">
              <Volume2 className="w-3 h-3 text-indigo-400" />
              <span>Co-Habitant Thoughts</span>
            </div>
            <p className="text-indigo-300 italic leading-relaxed text-sm">"{liveTranscription}"</p>
          </div>
        )}
        
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-20">
            <Hash className="w-12 h-12" />
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em]">Latent Space Silence</p>
              <p className="text-[10px] mt-1">Awaiting intent to project functional logic.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleLive}
            className={`p-3 rounded-xl border transition-all ${isLive ? 'bg-red-500/10 border-red-500/40 text-red-500 shadow-lg shadow-red-500/10' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30'}`}
            title={isLive ? "Disconnect Agent" : "Invite Agent to Co-Habit"}
          >
            {isLive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
            <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`~/${activeState} > inject intent...`}
              className="flex-1 bg-transparent py-3.5 outline-none mono text-slate-200 placeholder:text-slate-700 text-sm"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
