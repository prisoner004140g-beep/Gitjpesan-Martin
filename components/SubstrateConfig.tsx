
import React from 'react';
import { Settings, Cpu, HardDrive, Network, ShieldCheck, Database } from 'lucide-react';

export const SubstrateConfig: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-hidden bg-slate-950/20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/30">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight mono italic">Substrate Configuration</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">The Backbone: System Tuning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <ConfigCard 
          icon={<Cpu className="w-4 h-4" />} 
          title="Engine: Elvish v0.2" 
          status="Optimized" 
          color="text-emerald-400"
          desc="Functional value streams and lambda orchestrator."
        />
        <ConfigCard 
          icon={<HardDrive className="w-4 h-4" />} 
          title="Retention: Persistence" 
          status="LocalOnly" 
          color="text-indigo-400"
          desc="Artifact and state history stored in indexedDB."
        />
        <ConfigCard 
          icon={<Network className="w-4 h-4" />} 
          title="Bridge: Gemini Pro" 
          status="Connected" 
          color="text-emerald-400"
          desc="Cognitive reasoning and visual synthesis active."
        />
        <ConfigCard 
          icon={<ShieldCheck className="w-4 h-4" />} 
          title="Sovereign Shield" 
          status="Enabled" 
          color="text-cyan-400"
          desc="Sandboxed agent execution and intent verification."
        />
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500">
          <span>Environment Trace</span>
          <Database className="w-3 h-3" />
        </div>
        <div className="bg-slate-950 p-3 rounded-lg text-[11px] font-mono text-slate-400 leading-relaxed">
          <div className="flex gap-2"><span className="text-purple-500">var</span> NEXUS_HOME = /usr/local/nexus</div>
          <div className="flex gap-2"><span className="text-purple-500">var</span> SHELL_FLAVOR = elvish</div>
          <div className="flex gap-2"><span className="text-purple-500">var</span> DETERMINISM = strict</div>
        </div>
      </div>
    </div>
  );
};

const ConfigCard = ({ icon, title, status, color, desc }: any) => (
  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl hover:border-slate-700 transition-all group">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-1.5 rounded bg-slate-800 text-slate-400 group-hover:${color}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-tighter ${color} bg-${color.split('-')[1]}-500/10 px-2 py-0.5 rounded`}>
        {status}
      </span>
    </div>
    <h3 className="text-xs font-bold text-slate-200 mb-1">{title}</h3>
    <p className="text-[10px] text-slate-500 leading-normal">{desc}</p>
  </div>
);
