
import React from 'react';
import { TaskLog } from '../types';
import { Hammer, CheckCircle, XCircle, Clock, Terminal } from 'lucide-react';

interface TaskManifestProps {
  tasks: TaskLog[];
}

export const TaskManifest: React.FC<TaskManifestProps> = ({ tasks }) => {
  return (
    <div className="h-full flex flex-col p-6 bg-slate-950/20 backdrop-blur-md overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
          <Hammer className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight mono">Just: Task Manifest</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">The Hands: Executing Intent</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-40">
            <Clock className="w-12 h-12 mb-2" />
            <p className="text-xs font-mono uppercase">Idle Execution Loop</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl group transition-all hover:border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                   {task.status === 'running' ? (
                     <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                   ) : task.status === 'completed' ? (
                     <CheckCircle className="w-4 h-4 text-emerald-500" />
                   ) : (
                     <XCircle className="w-4 h-4 text-red-500" />
                   )}
                   <span className="text-xs font-bold text-slate-200 mono">just {task.recipe}</span>
                </div>
                <span className="text-[9px] text-slate-600 font-mono">#{task.id}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded text-[10px] text-slate-500 mono overflow-x-auto whitespace-pre">
                {task.output || `> Initiating deterministic spine for: ${task.recipe}`}
              </div>
              <div className="mt-2 text-[9px] text-slate-700 text-right">
                {new Date(task.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-600 uppercase font-bold tracking-widest">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3" />
          <span>Determinism: 100%</span>
        </div>
        <span>v2.13.0</span>
      </div>
    </div>
  );
};
