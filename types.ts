
export enum NexusState {
  LEARN = 'learn',
  BUILD = 'build',
  DEBUG = 'debug',
  REFACTOR = 'refactor',
  EXPLORE = 'explore',
  ARCHIVE = 'archive'
}

export interface StateConfig {
  name: NexusState;
  color: string;
  agents: string;
  description: string;
}

export interface ElvishValue {
  type: 'list' | 'map' | 'lambda' | 'string' | 'grounding' | 'system' | 'agent-proposal' | 'logic-proposal';
  content: any;
  timestamp: number;
}

export interface TaskLog {
  id: string;
  recipe: string;
  status: 'running' | 'completed' | 'failed';
  timestamp: number;
  output?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MediaArtifact {
  id: string;
  type: 'image' | 'video' | 'analysis';
  url: string;
  prompt: string;
  timestamp: number;
  sources?: GroundingSource[];
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface GraphNode {
  id: string;
  label: string;
  type: 'state' | 'artifact' | 'agent' | 'doc';
  x: number;
  y: number;
  color: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}
