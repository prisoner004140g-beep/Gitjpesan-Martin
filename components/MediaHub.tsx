
import React, { useState } from 'react';
import { MediaArtifact, AspectRatio, ImageSize } from '../types';
import { Image as ImageIcon, Video, Wand2, Search, FileSearch, Trash2, Maximize2, Loader2, Plus } from 'lucide-react';

interface MediaHubProps {
  artifacts: MediaArtifact[];
  loading: boolean;
  onGenerate: (prompt: string, ratio: AspectRatio, size: ImageSize) => void;
  onEdit: (id: string, prompt: string) => void;
  onAnalyze: (id: string) => void;
  onAnimate: (id: string, prompt: string) => void;
}

export const MediaHub: React.FC<MediaHubProps> = ({ artifacts, loading, onGenerate, onEdit, onAnalyze, onAnimate }) => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState<AspectRatio>('1:1');
  const [size, setSize] = useState<ImageSize>('1K');
  const [selectedArtifact, setSelectedArtifact] = useState<MediaArtifact | null>(null);
  const [editMode, setEditMode] = useState<'edit' | 'animate' | 'analyze' | null>(null);
  const [actionPrompt, setActionPrompt] = useState('');

  const handleMainAction = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt, ratio, size);
    setPrompt('');
  };

  const handleSubAction = () => {
    if (!selectedArtifact || !editMode) return;
    if (editMode === 'edit') onEdit(selectedArtifact.id, actionPrompt);
    if (editMode === 'animate') onAnimate(selectedArtifact.id, actionPrompt);
    if (editMode === 'analyze') onAnalyze(selectedArtifact.id);
    setEditMode(null);
    setActionPrompt('');
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-hidden">
      {/* Header & Main Control */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Artifact Synthesis</h2>
            <p className="text-sm text-slate-400">Generate, refine, and evolve system assets.</p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the cognitive artifact you wish to materialize..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none min-h-[80px] transition-all"
          />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              <select 
                value={ratio} 
                onChange={(e) => setRatio(e.target.value as AspectRatio)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-400 outline-none"
              >
                {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select 
                value={size} 
                onChange={(e) => setSize(e.target.value as ImageSize)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-400 outline-none"
              >
                {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button 
              disabled={loading}
              onClick={handleMainAction}
              className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Generate Pro Artifact
            </button>
          </div>
        </div>
      </div>

      {/* Artifact Grid */}
      <div className="flex-1 overflow-y-auto pr-2">
        {artifacts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-400 space-y-4">
            <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">No artifacts materialize yet...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {artifacts.map((art) => (
              <div 
                key={art.id} 
                className={`group relative aspect-square rounded-2xl overflow-hidden border transition-all cursor-pointer ${selectedArtifact?.id === art.id ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-800 hover:border-slate-700'}`}
                onClick={() => setSelectedArtifact(art)}
              >
                {art.type === 'image' ? (
                  <img src={art.url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                ) : (
                  <video src={art.url} className="w-full h-full object-cover" autoPlay muted loop />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                   <p className="text-[10px] text-white font-medium line-clamp-1">{art.prompt}</p>
                   <p className="text-[8px] text-slate-400 uppercase tracking-widest">{art.type} • {new Date(art.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Controls */}
      {selectedArtifact && (
        <div className="border-t border-slate-800 pt-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <h3 className="text-sm font-bold text-slate-200">Refine Selection</h3>
                </div>
                <button onClick={() => setSelectedArtifact(null)} className="text-slate-500 hover:text-slate-300"><Trash2 className="w-4 h-4" /></button>
             </div>
             
             {editMode ? (
               <div className="space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                    <span>Target: {editMode}</span>
                    <button onClick={() => setEditMode(null)} className="hover:underline">Cancel</button>
                  </div>
                  <input 
                    autoFocus
                    value={actionPrompt}
                    onChange={(e) => setActionPrompt(e.target.value)}
                    placeholder={editMode === 'analyze' ? 'Analyze intent...' : `Prompt for ${editMode}...`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none focus:border-indigo-500"
                  />
                  <button 
                    disabled={loading}
                    onClick={handleSubAction}
                    className="w-full bg-indigo-600 py-2 rounded-lg text-xs font-bold text-white hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                    Execute Operation
                  </button>
               </div>
             ) : (
               <div className="grid grid-cols-3 gap-2">
                 <button onClick={() => setEditMode('edit')} className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/5 text-slate-400 transition-all border border-transparent hover:border-slate-800">
                   <Wand2 className="w-4 h-4" />
                   <span className="text-[10px] font-bold uppercase">Edit</span>
                 </button>
                 <button onClick={() => setEditMode('animate')} className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/5 text-slate-400 transition-all border border-transparent hover:border-slate-800">
                   <Video className="w-4 h-4" />
                   <span className="text-[10px] font-bold uppercase">Animate</span>
                 </button>
                 <button onClick={() => setEditMode('analyze')} className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/5 text-slate-400 transition-all border border-transparent hover:border-slate-800">
                   <FileSearch className="w-4 h-4" />
                   <span className="text-[10px] font-bold uppercase">Analyze</span>
                 </button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
