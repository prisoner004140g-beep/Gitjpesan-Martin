
import React from 'react';
import { NexusState, StateConfig } from './types';
import { BookOpen, Zap, Bug, GitBranch, Compass, Archive } from 'lucide-react';

export const STATES: Record<NexusState, StateConfig> = {
  [NexusState.LEARN]: {
    name: NexusState.LEARN,
    color: 'text-blue-400',
    agents: 'read-only',
    description: 'System ingestion and conceptual mapping.'
  },
  [NexusState.BUILD]: {
    name: NexusState.BUILD,
    color: 'text-yellow-400',
    agents: 'write',
    description: 'Active construction and artifact generation.'
  },
  [NexusState.DEBUG]: {
    name: NexusState.DEBUG,
    color: 'text-red-400',
    agents: 'restricted',
    description: 'System introspection and resolution.'
  },
  [NexusState.REFACTOR]: {
    name: NexusState.REFACTOR,
    color: 'text-purple-400',
    agents: 'write-atomic',
    description: 'Structural reorganization and optimization.'
  },
  [NexusState.EXPLORE]: {
    name: NexusState.EXPLORE,
    color: 'text-cyan-400',
    agents: 'sandboxed',
    description: 'Heuristic discovery and latent space traversal.'
  },
  [NexusState.ARCHIVE]: {
    name: NexusState.ARCHIVE,
    color: 'text-slate-500',
    agents: 'cold-storage',
    description: 'State preservation and history logging.'
  }
};

export const STATE_ICONS = {
  [NexusState.LEARN]: <BookOpen className="w-5 h-5" />,
  [NexusState.BUILD]: <Zap className="w-5 h-5" />,
  [NexusState.DEBUG]: <Bug className="w-5 h-5" />,
  [NexusState.REFACTOR]: <GitBranch className="w-5 h-5" />,
  [NexusState.EXPLORE]: <Compass className="w-5 h-5" />,
  [NexusState.ARCHIVE]: <Archive className="w-5 h-5" />,
};

export interface DocItem {
  id: number;
  title: string;
  description: string;
  verbs: { label: string; cmd: string }[];
}

export const CHAT_INDEX: DocItem[] = [
  { 
    id: 1, 
    title: "Core Vision", 
    description: "Agent‑First Nexus; workspace as state machine.",
    verbs: [
      { label: "status", cmd: "just nexus-status" },
      { label: "manifest", cmd: "cat manifest.elv" }
    ]
  },
  { 
    id: 2, 
    title: "Workspace Architecture", 
    description: "Immutable source, project projections, meta-tags.",
    verbs: [
      { label: "inspect", cmd: "just arch-check" },
      { label: "rebuild", cmd: "just workspace-init" }
    ]
  },
  { 
    id: 3, 
    title: "Contexts & States", 
    description: "Learn, Build, Debug, Refactor, Explore, Archive.",
    verbs: [
      { label: "cycle", cmd: "just state-cycle" }
    ]
  },
  { 
    id: 4, 
    title: "Shell & Orchestration", 
    description: "Elvish shell; functional state machines.",
    verbs: [
      { label: "repl", cmd: "elvish -i" },
      { label: "eval", cmd: "just elvish-bench" }
    ]
  },
  { 
    id: 5, 
    title: "Rust Hyper‑Stack", 
    description: "Ratatui, Zellij, ripgrep, fd, bat.",
    verbs: [
      { label: "tui-bench", cmd: "just ratatui-perf" },
      { label: "reload", cmd: "just rust-init" }
    ]
  },
  { 
    id: 6, 
    title: "Active Documentation", 
    description: "Executable Markdown via Broot verbs.",
    verbs: [
      { label: "exec-all", cmd: "just doc-run-verbs" }
    ]
  }
];
