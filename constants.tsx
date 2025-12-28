
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

export const CHAT_INDEX = [
  { id: 1, title: "Core Vision", description: "Agent‑First Nexus; workspace as state machine." },
  { id: 2, title: "Workspace Architecture", description: "Immutable source, project projections, meta-tags." },
  { id: 3, title: "Contexts & States", description: "Learn, Build, Debug, Refactor, Explore, Archive." },
  { id: 4, title: "Shell & Orchestration", description: "Elvish shell; functional state machines." },
  { id: 5, title: "Rust Hyper‑Stack", description: "Ratatui, Zellij, ripgrep, fd, bat." },
  { id: 6, title: "Active Documentation", description: "Executable Markdown via Broot verbs." },
  { id: 7, title: "AI / Agent Integration", description: "MCP Servers; tool-calling governance." },
  { id: 8, title: "Gemini CLI Paths", description: "Antigravity native agent manager." },
  { id: 9, title: "Data & Vector Memory", description: "SQLite+vector; semantic memory ops." },
  { id: 10, title: "Elvish Patterns", description: "Declarative workflows; lambda orchestrators." },
  { id: 11, title: "Memory & Epistemics", description: "Org-Mode, SQLite timelines." },
  { id: 12, title: "Geometry & Theory", description: "Honeycomb lattices, metaspheres, drips." },
  { id: 13, title: "Governance & Safety", description: "Whitelisted verbs; immutable audit trails." },
  { id: 14, title: "Hybrid Stack", description: "Elvish + Just + Rust + Ratatui." },
  { id: 15, title: "Next Deliverables", description: "RC templates, KDL layouts, MCP wrappers." }
];
